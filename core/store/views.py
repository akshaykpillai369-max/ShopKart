import re

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from .models import Cart, CartItem, Product, Profile, OrderItem, Order

from .serializers import (
    CartItemSerializer,
    ProductSerializer,
    ProfileSerializer,
    SignupSerializer,
    OrderSerializer
)

User = get_user_model()


class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = self.queryset

        search_query = (
            self.request.query_params.get("search", "")
            .lower()
            .strip()
        )

        if not search_query:
            return queryset

        pattern = r"\b(under|below|less\s+than|over|above|more\s+than)\s+(\d+)\b"

        match = re.search(pattern, search_query)

        if match:
            keyword = match.group(1)
            price = int(match.group(2))

            raw_product_name = re.sub(
                pattern,
                "",
                search_query
            )

            product_name = re.sub(
                r"\b(\w+)s\b",
                r"\1",
                raw_product_name
            )

            product_name = re.sub(
                r"[\$₹€,]",
                "",
                product_name
            )

            product_name = re.sub(
                r"\s+",
                " ",
                product_name
            ).strip()

            if product_name:
                queryset = queryset.filter(
                    Q(name__icontains=product_name)
                    | Q(description__icontains=product_name)
                )

            if keyword in ["under", "below", "less than"]:
                queryset = queryset.filter(
                    discounted_price__lte=price
                )

            elif keyword in ["over", "above", "more than"]:
                queryset = queryset.filter(
                    discounted_price__gte=price
                )

        else:
            clean_query = re.sub(
                r"\b(\w+)s\b",
                r"\1",
                search_query
            ).strip()

            if clean_query:
                queryset = queryset.filter(
                    Q(name__icontains=clean_query)
                    | Q(description__icontains=clean_query)
                )

        return queryset


class SignUpView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "Account created successfully"},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LogoutView(APIView):
    def post(self, request):
        response = Response({
            "message": "Logged out successfully."
        })

        response.delete_cookie("refresh_token", path="/api/")
        response.delete_cookie("refresh_token", path="/")

        return response


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            refresh = response.data.pop("refresh")

            response.set_cookie(
            key="refresh_token",
            value=refresh,
            max_age=7 * 24 * 60 * 60,
            secure=not settings.DEBUG,
            httponly=True,
            samesite="Lax",
            path="/",
        )

        return response


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["refresh"].required = False

    def validate(self, attrs):
        attrs["refresh"] = (
            self.context["request"]
            .COOKIES
            .get("refresh_token")
        )

        return super().validate(attrs)


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer


class AuthTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are authenticated!",
            "user": request.user.email
        })


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        details = Profile.objects.get(
            user=request.user
        )

        serializer = ProfileSerializer(details)

        return Response(serializer.data)

    def put(self, request):
        details = Profile.objects.get(
            user=request.user
        )

        serializer = ProfileSerializer(
            details,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )


class GoogleLoginView(APIView):
    def post(self, request):
        try:
            credential = request.data.get("credential")

            result = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = result["email"]
            name = result["name"]

            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)

            else:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                )

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response = Response({
                "access": str(access),
                "email": email,
            })

            response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            max_age=7 * 24 * 60 * 60,
            secure=not settings.DEBUG,
            httponly=True,
            samesite="Lax",
            path="/",
        )
            return response

        except ValueError:
            return Response(
                {"error": "Invalid Google credential"},
                status=status.HTTP_400_BAD_REQUEST
            )


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        product = get_object_or_404(
            Product,
            id=product_id
        )

        if not product.active or product.stock < 1:
            return Response(
                {"message": "Product is currently unavailable."},
                status=400
            )

        cart, _ = Cart.objects.get_or_create(
            user=request.user
        )

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if item_created:
            return Response({
                "message": "Product added to cart successfully.",
                "quantity": cart_item.quantity,
                "cart_item_id": cart_item.id
            })

        else:
            if product.stock >= cart_item.quantity + 1:
                cart_item.quantity += 1
                cart_item.save()

                return Response({
                    "message": "Product added to cart successfully.",
                    "quantity": cart_item.quantity,
                    "cart_item_id": cart_item.id
                })

            else:
                return Response(
                    {"message": "Not enough stock available."},
                    status=400
                )


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = Cart.objects.get(
            user=request.user
        )

        cart_items = CartItem.objects.filter(
            cart=cart
        )

        serializer = CartItemSerializer(
            cart_items,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cart_item_id):
        cart_item = CartItem.objects.get(
            id=cart_item_id,
            cart__user=request.user
        )

        quantity = int(
            request.data.get("quantity")
        )

        if (
            quantity <= 0
            or cart_item.product.stock < quantity
        ):
            return Response(
                {
                    "message":
                    "Invalid quantity or not enough stock available."
                },
                status=400
            )

        cart_item.quantity = quantity
        cart_item.save()

        return Response({
            "message": "Cart quantity updated successfully.",
            "quantity": cart_item.quantity,
        })

    def delete(self, request, cart_item_id):
        cart_item = CartItem.objects.get(
            id=cart_item_id,
            cart__user=request.user
        )

        cart_item.delete()

        return Response({
            "message": "Cart item removed successfully."
        })

class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {"message": "Cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items.exists():
            return Response(
                {"message": "Cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        for item in cart_items:
            if not item.product.active or item.product.stock < item.quantity:
                return Response(
                    {
                        "message": f"Not enough stock available for {item.product.name}."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        total_cost = 0

        for item in cart_items:
            total_cost += item.product.discounted_price * item.quantity

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                address=request.data.get("address"),
                total_cost=total_cost
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.discounted_price
                )

            cart_items.delete()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
import re

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.db import transaction
import requests
import os


from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.throttling import AnonRateThrottle
from django.core.cache import cache

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from .models import Cart, CartItem, Product, Profile, OrderItem, Order, Review, Category

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.password_validation import validate_password
import base64
import razorpay
from .serializers import (
    CartItemSerializer,
    ProductSerializer,
    ProfileSerializer,
    SignupSerializer,
    OrderSerializer,
    ReviewSerializer,
    CategorySerializer,
)
from rest_framework.pagination import PageNumberPagination

User = get_user_model()

class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50

class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"
    pagination_class = ProductPagination

    def list(self, request, *args, **kwargs):

        cache_params = self.request.query_params
        polished_query = f"product_{cache_params.urlencode()}"

        cached_data = cache.get(polished_query)

        if cached_data:
        
            return Response(cached_data)
        
        response = super().list(request, *args, **kwargs)
        cache.set(polished_query, response.data, timeout=300)
        return response

    def get_queryset(self):
        queryset = self.queryset
        category = self.request.query_params.get("category")

        


        if category:
            queryset = queryset.filter(category__name__iexact=category)

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

class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SignUpView(APIView):

    def post(self, request):

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            profile = Profile.objects.get(user=user)

            profile.email_verified = False
            profile.save()

            uid = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = default_token_generator.make_token(user)

            verification_link = (
                f"{os.getenv('FRONTEND_URL')}/verify-email/"
                f"{uid}/{token}"
            )

            response = requests.post(
                f"https://api.agentmail.to/v0/inboxes/{os.getenv('AGENTMAIL_INBOX_ID')}/messages/send",
                headers={
                    "Authorization": f"Bearer {os.getenv('AGENTMAIL_API_KEY')}",
                    "Content-Type": "application/json",
                },
                json={
                    "to": [user.email],
                    "subject": "Verify your ShopKart email",
                    "text": f"""
            Hello,

            Please verify your ShopKart email address by clicking the link below:

            {verification_link}

            If you did not create this account, you can ignore this email.
            """,
                },
            )

            response.raise_for_status()

            return Response(
                {
                    "message": (
                        "Account created successfully. "
                        "Please check your email to verify your account. "
                        "If you didn't receive this email, please check your spam folder."
                    )
                },
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

        email = request.data.get("username")

        try:
            user = User.objects.get(username=email)
            profile = Profile.objects.get(user=user)

        except (User.DoesNotExist, Profile.DoesNotExist):
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check email verification BEFORE generating tokens
        if not profile.email_verified:

            return Response(
                {
                    "error": "Please verify your email before logging in."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Email is verified, so now let SimpleJWT authenticate
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:

            refresh = response.data.pop("refresh")

            response.set_cookie(
                key="refresh_token",
                value=refresh,
                max_age=7 * 24 * 60 * 60,
                secure=not settings.DEBUG,
                httponly=True,
                samesite="None",
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

                Profile.objects.get_or_create(
                    user=user,
                    defaults={
                        "name": name,
                        "mobile_number": "",
                        "address": "",
                        "email_verified": True,
                    }
                )

            else:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                )

                profile = Profile.objects.get(user=user)
                profile.name = name
                profile.email_verified = True
                profile.save()

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
            samesite="None",
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
        cart, _ = Cart.objects.get_or_create(
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
        cart_item = get_object_or_404(
            CartItem,
            id=cart_item_id,
            cart__user=request.user
        )

        quantity = request.data.get("quantity")

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {"message": "Quantity must be a valid number."},
                status=400
            )

        if (
            quantity <= 0
            or cart_item.product.stock < quantity
        ):
            return Response(
                {
                    "message": "Invalid quantity or not enough stock available."
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
        cart_item = get_object_or_404(
            CartItem,
            id=cart_item_id,
            cart__user=request.user
        )

        cart_item.delete()

        return Response({
            "message": "Cart item removed successfully."
        })

class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
            .filter(user=request.user)
            .prefetch_related(
                "items__product"
            )
            .order_by("-created_at")
        )

        serializer = OrderSerializer(orders, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        address = request.data.get("address")
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity")

        if not address or not address.strip():
            return Response(
                {"message": "Delivery address is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if product_id is not None:
            try:
                quantity = int(quantity)
            except (TypeError, ValueError):
                return Response(
                    {"message": "Invalid quantity."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if quantity < 1:
                return Response(
                    {"message": "Quantity must be at least 1."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                with transaction.atomic():

                    product = (
                        Product.objects
                        .select_for_update()
                        .get(id=product_id)
                    )

                    if not product.active:
                        return Response(
                            {
                                "message":
                                f"{product.name} is currently unavailable."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    if product.stock < quantity:
                        return Response(
                            {
                                "message":
                                f"Not enough stock available for "
                                f"{product.name}."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    total_cost = (
                        product.discounted_price * quantity
                    )

                    order = Order.objects.create(
                        user=request.user,
                        address=address.strip(),
                        total_cost=total_cost
                    )

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price=product.discounted_price
                    )

                    product.stock -= quantity

                    product.save(
                        update_fields=["stock"]
                    )

                serializer = OrderSerializer(order)

                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED
                )

            except Product.DoesNotExist:
                return Response(
                    {"message": "Product not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

        try:
            with transaction.atomic():

                cart = Cart.objects.get(
                    user=request.user
                )

                cart_items = list(
                    CartItem.objects
                    .select_related("product")
                    .filter(cart=cart)
                )

                if not cart_items:
                    return Response(
                        {"message": "Cart is empty."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                total_cost = 0
                locked_products = []

                # Lock products and validate stock

                for item in cart_items:

                    product = (
                        Product.objects
                        .select_for_update()
                        .get(id=item.product.id)
                    )

                    if not product.active:
                        return Response(
                            {
                                "message":
                                f"{product.name} is currently unavailable."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    if product.stock < item.quantity:
                        return Response(
                            {
                                "message":
                                f"Not enough stock available for "
                                f"{product.name}."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    total_cost += (
                        product.discounted_price *
                        item.quantity
                    )

                    locked_products.append(
                        (item, product)
                    )


                order = Order.objects.create(
                    user=request.user,
                    address=address.strip(),
                    total_cost=total_cost
                )

                for item, product in locked_products:

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=item.quantity,
                        price=product.discounted_price
                    )

                    product.stock -= item.quantity

                    product.save(
                        update_fields=["stock"]
                    )

                CartItem.objects.filter(
                    cart=cart
                ).delete()

            serializer = OrderSerializer(order)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        except Cart.DoesNotExist:
            return Response(
                {"message": "Cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = (
                Order.objects
                .prefetch_related("items__product")
                .get(
                    id=pk,
                    user=request.user
                )
            )

            serializer = OrderSerializer(order)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        except Order.DoesNotExist:
            return Response(
                {"message": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
class ForgotPasswordThrottle(AnonRateThrottle):
    scope = "forgot_password"


class ForgotPasswordView(APIView):

    throttle_classes = [ForgotPasswordThrottle]

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response({
                "message": "If an account exists with this email, a reset link has been sent."
            })

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        encoded_token = base64.urlsafe_b64encode(
            token.encode()
        ).decode()

        reset_link = (
             f"{os.getenv('FRONTEND_URL')}/reset-password/"
            f"{uid}/{encoded_token}"
        )

        response = requests.post(
            f"https://api.agentmail.to/v0/inboxes/{os.getenv('AGENTMAIL_INBOX_ID')}/messages/send",
            headers={
                "Authorization": f"Bearer {os.getenv('AGENTMAIL_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "to": [user.email],
                "subject": "Reset your ShopKart password",
                "text": f"""
        Hello,

        You requested a password reset for your ShopKart account.

        Use this link to reset your password:

        {reset_link}

        If you did not request this, you can ignore this email.
        """,
            },
        )

        response.raise_for_status()

        return Response({
            "message": (
            "If an account exists with this email, a reset link has been sent. "
            "If you didn't see this email, please check your spam folder. "
            )
        })
    
class ResetPasswordView(APIView):

    def post(self, request):

        uid = request.data.get("uid")
        encoded_token = request.data.get("token")
        password = request.data.get("password")

        if not uid or not encoded_token or not password:
            return Response(
                {"error": "UID, token and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = base64.urlsafe_b64decode(
                encoded_token.encode()
            ).decode()

        except Exception:
            return Response(
                {"error": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(password, user)

        except Exception as error:
            return Response(
                {"error": error.messages},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response({
            "message": "Password reset successfully."
        })

class EmailVerificationView(APIView):

    def get(self, request, uid, token):

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid verification link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired verification link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = Profile.objects.get(user=user)

        profile.email_verified = True
        profile.save()

        return Response({
            "message": "Email verified successfully."
        })


class ResendVerificationThrottle(AnonRateThrottle):
    scope = "resend_verification"

class ResendVerificationEmailView(APIView):

    throttle_classes = [ResendVerificationThrottle]

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            profile = Profile.objects.get(user=user)

        except (User.DoesNotExist, Profile.DoesNotExist):
            return Response({
                "message": (
                    "If an account exists with this email, "
                    "a verification link has been sent. "
                    "If you didn't receive this email, please check your spam folder. "

                )
            })

        if profile.email_verified:
            return Response({
                "message": "This email is already verified."
            })

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        verification_link = (
             f"{os.getenv('FRONTEND_URL')}/verify-email/"
            f"{uid}/{token}"
        )

        response = requests.post(
            f"https://api.agentmail.to/v0/inboxes/{os.getenv('AGENTMAIL_INBOX_ID')}/messages/send",
            headers={
                "Authorization": f"Bearer {os.getenv('AGENTMAIL_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "to": [user.email],
                "subject": "Verify your ShopKart email",
                "text": f"""
    Hello,

    Please verify your ShopKart email address by clicking the link below:

    {verification_link}

    If you did not create this account, you can ignore this email.
    """,
        },
    )

        response.raise_for_status()

        return Response({
            "message": ("If an account exists with this email, a verification link has been sent. " 
                        "If you didn't receive this email, please check your spam folder. ")
        })

class CreatePaymentOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        amount = request.data.get("amount")

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response(
                {"message": "Invalid amount."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if amount <= 0:
            return Response(
                {"message": "Amount must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        payment_order = client.order.create({
            "amount": amount * 100,
            "currency": "INR",
            "payment_capture": 1
        })

        return Response({
            "order_id": payment_order["id"],
            "amount": payment_order["amount"],
            "currency": payment_order["currency"],
            "key": settings.RAZORPAY_KEY_ID
        })

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        address = request.data.get("address")
        items = request.data.get("items")

        if (
            not razorpay_order_id
            or not razorpay_payment_id
            or not razorpay_signature
        ):
            return Response(
                {"message": "Payment details are incomplete."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not address:
            return Response(
                {"message": "Delivery address is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not items:
            return Response(
                {"message": "No products found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            })

        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"message": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():

                total_cost = 0
                order_items = []

                for item in items:

                    product_id = item.get("id")
                    quantity = int(item.get("quantity", 0))

                    if quantity <= 0:
                        raise ValueError("Invalid quantity.")

                    product = Product.objects.select_for_update().get(id=product_id)

                    if product.stock < quantity:
                        raise ValueError(
                            f"Not enough stock for {product.name}."
                        )

                    price = product.discounted_price
                    total_cost += price * quantity
                    order_items.append({
                        "product": product,
                        "quantity": quantity,
                        "price": price,
                        

                    })

                    product.stock -= quantity
                    product.save(update_fields=["stock"])

                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    total_cost=total_cost,
                    status="Pending",
                )

                for item in order_items:
                    OrderItem.objects.create(
                        order=order,
                        product=item["product"],
                        quantity=item["quantity"],
                        price=item["price"]
                    )

        except Product.DoesNotExist:
            return Response(
                {"message": "One or more products no longer exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        except (ValueError, TypeError):
            return Response(
                {"message": "Invalid order data."},
                status=status.HTTP_400_BAD_REQUEST
            )

        CartItem.objects.filter(cart__user=request.user).delete()

        
        return Response({
            "message": "Payment verified and order created successfully.",
            "order_id": order.id
        })

class IsReviewOwner(BasePermission):

    def has_object_permission(self, request, view, obj):

        if obj.user == request.user:
            return True

        else :

            return False

class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.filter(product__active=True)

        product_id = self.request.query_params.get("product")

        if product_id:
            queryset = queryset.filter(product_id=product_id)

        return queryset

    def get_permissions(self):

        if self.action in ['list', 'retrieve']:

            return [AllowAny()]

        elif self.action == 'create':

            return [IsAuthenticated()]
        
        else:
            
            return [IsAuthenticated(), IsReviewOwner()]

    def perform_create(self, serializer):

        product = serializer.validated_data["product"]

        user = self.request.user
        order_item = OrderItem.objects.filter(order__user = user, order__status = 'Delivered', product = product)

        if order_item.exists():
            serializer.save(user = user)

        else:
            raise PermissionDenied("You can review only products you have purchased and received.")

        
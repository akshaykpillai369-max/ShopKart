import re

from django.conf import settings
from django.db.models import Q

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Profile
from .serializers import ProductSerializer, SignupSerializer, ProfileSerializer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model

User = get_user_model()

class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = self.queryset
        search_query = self.request.query_params.get("search", "").lower().strip()

        if not search_query:
            return queryset

        pattern = r"\b(under|below|less\s+than|over|above|more\s+than)\s+(\d+)\b"
        match = re.search(pattern, search_query)

        if match:
            keyword = match.group(1)
            price = int(match.group(2))

            raw_product_name = re.sub(pattern, "", search_query)
            product_name = re.sub(r"\b(\w+)s\b", r"\1", raw_product_name)
            product_name = re.sub(r"[\$₹€,]", "", product_name)
            product_name = re.sub(r"\s+", " ", product_name).strip()

            if product_name:
                queryset = queryset.filter(
                    Q(name__icontains=product_name)
                    | Q(description__icontains=product_name)
                )

            if keyword in ["under", "below", "less than"]:
                queryset = queryset.filter(discounted_price__lte=price)

            elif keyword in ["over", "above", "more than"]:
                queryset = queryset.filter(discounted_price__gte=price)

        else:
            clean_query = re.sub(r"\b(\w+)s\b", r"\1", search_query).strip()

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


class CookieTokenObtainPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            refresh = response.data.pop("refresh")

            response.set_cookie(
                key="refresh_token",
                value=refresh,
                secure=not settings.DEBUG,
                httponly=True,
                samesite="Lax",
            )

        return response


class CookieTokenRefreshSerializer(TokenRefreshSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["refresh"].required = False

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")

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

        details = Profile.objects.get(user = request.user)
        serializer = ProfileSerializer(details)
        return Response(serializer.data)

    def put(self, request):

        details = Profile.objects.get(user = request.user)
        serializer = ProfileSerializer(details, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class GoogleLoginView(APIView):

    def post(self, request):
        try:
            credential = request.data.get("credential")
            result = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID)
            email = result['email']
            name = result['name']
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
                            secure=not settings.DEBUG,
                            httponly=True,
                            samesite="Lax",
                        )
            
            return response
        except ValueError:
            return Response(
                {"error": "Invalid Google credential"},
                status=status.HTTP_400_BAD_REQUEST
            )



                            
    
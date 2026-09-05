from django.urls import path, include
from .views import ProductViewSet, SignUpView, CookieTokenObtainPairView
from .views import CookieTokenRefreshView, AuthTestView, ProfileView, GoogleLoginView
from .views import AddToCartView, CartView, CartItemView, LogoutView, OrderView
from rest_framework.routers import DefaultRouter
from .views import ForgotPasswordView, ResetPasswordView, EmailVerificationView
from .views import ResendVerificationEmailView, OrderDetailView, CreatePaymentOrderView
from .views import VerifyPaymentView, ReviewViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'categories', CategoryViewSet, basename='category')
 
urlpatterns = [

     path('', include(router.urls)),
     path("auth/signup/", SignUpView.as_view(), name = 'signup'),
     path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
     path("auth/test/", AuthTestView.as_view()),
     path('profile/',ProfileView.as_view(), name='profile'),
     path('auth/google/', GoogleLoginView.as_view(), name='google_auth'),
     path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
     path('cart/', CartView.as_view(), name='cart'),
     path('cart-item/<int:cart_item_id>/',CartItemView.as_view(),name='cart-item'),
     path("logout/", LogoutView.as_view(), name="logout"),
     path('orders/', OrderView.as_view(), name='orders'),
     path("auth/forgot-password/",ForgotPasswordView.as_view(),name="forgot-password"),
     path('auth/reset-password/',ResetPasswordView.as_view(),name='reset-password'),
     path("auth/verify-email/<uid>/<token>/",EmailVerificationView.as_view(),name="verify_email"),
     path("auth/resend-verification/",ResendVerificationEmailView.as_view(),name="resend_verification"),
     path("orders/<int:pk>/",OrderDetailView.as_view(),name='order_detailed_view'),
     path('payment/create/', CreatePaymentOrderView.as_view(), name='create-payment'),
     path("payment/verify/", VerifyPaymentView.as_view(), name="verify-payment"),
]



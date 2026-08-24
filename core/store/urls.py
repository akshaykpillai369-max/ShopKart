from django.urls import path, include
from .views import ProductViewSet, SignUpView, CookieTokenObtainPairView
from .views import CookieTokenRefreshView, AuthTestView, ProfileView, GoogleLoginView
from .views import AddToCartView, CartView, CartItemView, LogoutView
from rest_framework.routers import DefaultRouter
 


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
 
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
]
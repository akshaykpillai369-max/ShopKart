from django.urls import path, include
from .views import ProductViewSet, SignUpView, CookieTokenObtainPairView,CookieTokenRefreshView, AuthTestView, ProfileView, GoogleLoginView
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
     path('auth/google/', GoogleLoginView.as_view(), name='google_auth')
]
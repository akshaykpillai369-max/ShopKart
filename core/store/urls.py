from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

from .views import AuthTestView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
 
urlpatterns = [

     path('', include(router.urls)),
     path("auth/test/", AuthTestView.as_view()),

]
from .models import Product
from .serializers import ProductSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

# Create your views here.
class ProductViewSet(ReadOnlyModelViewSet):

    queryset = Product.objects.filter(active = True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    


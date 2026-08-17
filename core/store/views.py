import re
from django.db.models import Q   
from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Product
from .serializers import ProductSerializer

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.
class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = self.queryset
        search_query = self.request.query_params.get('search', '').lower().strip()

        if search_query:
            pattern = r'\b(under|below|less\s+than|over|above|more\s+than)\s+(\d+)\b'
            match = re.search(pattern, search_query)

            if match:
                keyword = match.group(1)
                price = int(match.group(2))
                
                raw_product_name = re.sub(pattern, '', search_query)
                product_name = re.sub(r'\b(\w+)s\b', r'\1', raw_product_name)
                product_name = re.sub(r'[\$₹€,]', '', product_name)
                product_name = re.sub(r'\s+', ' ', product_name).strip()

               
                if product_name:
                    queryset = queryset.filter(
                        Q(name__icontains=product_name) | Q(description__icontains=product_name)
                    )

               
                if keyword in ['under', 'below', 'less than']:
                    queryset = queryset.filter(discounted_price__lte=price)
                elif keyword in ['over', 'above', 'more than']:
                    queryset = queryset.filter(discounted_price__gte=price)

            else:
               
                clean_query = re.sub(r'\b(\w+)s\b', r'\1', search_query).strip()
                if clean_query:
                    queryset = queryset.filter(
                        Q(name__icontains=clean_query) | Q(description__icontains=clean_query)
                    )

        return queryset
    

class AuthTestView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "message" : "you are authenticated",
                "username" : request.user.username
            }
        )

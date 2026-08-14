from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    display_rating = serializers.ReadOnlyField()
    image = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'description', 
            'price', 
            'discounted_price', 
            'rating', 
            'display_rating', 
            'image', 
            'slug',
            'stock',
            'active'
        ]
        read_only_fields = ['rating', 'slug']
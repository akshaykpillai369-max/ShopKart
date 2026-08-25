from rest_framework import serializers
from .models import Product, Profile, CartItem, Order, OrderItem
from django.contrib.auth.models import User

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


class SignupSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                'password': 'Passwords do not match.'
            })

        if User.objects.filter(username=data['email']).exists():
            raise serializers.ValidationError({
                'email': 'An account with this email already exists.'
            })

        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:

        model = Profile
        fields = ['id', 'user', 'name', 'mobile_number', 'email', 'address']
        read_only_fields = ['user', 'email']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'address', 'total_cost', 'status', 'created_at', 'items']
from rest_framework import serializers
from .models import Product, Profile, CartItem, Order, OrderItem, Review
from django.contrib.auth.models import User
from django.db.models import Avg

class ProductSerializer(serializers.ModelSerializer):
    display_rating = serializers.ReadOnlyField()
    image = serializers.ImageField(use_url=True, required=False)
    can_review = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()
    rating_avg = serializers.SerializerMethodField()

    def get_rating_avg(self, obj):

        result = Review.objects.filter(product=obj).aggregate(average=Avg("rating"))

        average = result["average"]

        return round(average,1) if average else 0
        

    def get_rating_count(self, obj):

        return Review.objects.filter(product = obj).count()

    def get_can_review(self, obj):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return False

        has_purchased = OrderItem.objects.filter(order__user=request.user,order__status='Delivered',product=obj).exists()

        if not has_purchased:
            return False
        
        has_reviewed = Review.objects.filter(user=request.user,product=obj).exists()

        return not has_reviewed

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
            'active',
            'can_review',
            'rating_count',
            'rating_avg'
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

    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'address', 'total_cost', 'status', 'created_at', 'items']


class ReviewSerializer(serializers.ModelSerializer):

    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'rating', 'description', 'created_at', 'product', 'user']
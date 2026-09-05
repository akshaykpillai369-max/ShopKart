from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Category(models.Model):

    name= models.CharField(max_length=100)
    image = models.ImageField(upload_to='category/images/')

    def __str__(self):
        return self.name


class Product(models.Model):

    name = models.TextField()
    description = models.TextField()
    price = models.IntegerField()
    discounted_price = models.IntegerField()
    rating = models.DecimalField(max_digits = 2 , decimal_places = 1, validators=[MinValueValidator(1), MaxValueValidator(5)], default=5.0)
    image = models.ImageField(upload_to='images/', default= 'images/product_placeholder.png')
    slug = models.SlugField(unique=True, blank=True, max_length=200)
    stock = models.IntegerField(validators=[MinValueValidator(0)], default=10)
    active = models.BooleanField(default=True)
    category = models.ForeignKey(Category , on_delete=models.PROTECT)

    @property
    def display_rating(self):

        return(
            int(self.rating)
            if self.rating % 1 == 0
            else self.rating
        )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug = slug).exclude(pk = self.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter+=1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.slug

class Profile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Cart(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
            return f"{self.user}'s  Cart"

class CartItem(models.Model):

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product= models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], default=1)

    def __str__(self):
        return f"{self.cart.user}'s  {self.product.name} "

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "product"],
                name="unique_cart_product"
            )
        ]


class Order(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="orders")
    address = models.TextField()
    total_cost = models.IntegerField()
    status = models.CharField(max_length=20,default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name="items")
    product = models.ForeignKey(Product,on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.IntegerField()

    def __str__(self):
        return f"Order #{self.order.id} - {self.product.name} x {self.quantity}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    rating = models.IntegerField(validators=[MinValueValidator(1),MaxValueValidator(5)])
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_user_product_review"
            )
        ]
    def __str__(self):
        return f' {self.user.username} {self.product.slug} review '
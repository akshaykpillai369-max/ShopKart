from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Product(models.Model):

    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.IntegerField()
    discounted_price = models.IntegerField()
    rating = models.DecimalField(max_digits = 2 , decimal_places = 1, validators=[MinValueValidator(1), MaxValueValidator(5)], default=5.0)
    image = models.ImageField(upload_to='images/')
    slug = models.SlugField(unique=True, blank=True)
    stock = models.IntegerField(validators=[MinValueValidator(0)], default=10)
    active = models.BooleanField(default=True)

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

    def __str__(self):
        return self.name


class Cart(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

class CartItem(models.Model):

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product= models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], default=1)

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


class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name="items")
    product = models.ForeignKey(Product,on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.IntegerField()
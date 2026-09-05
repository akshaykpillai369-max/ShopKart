from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Profile, Product
from django.core.cache import cache

User = get_user_model()

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):

    if created:
        Profile.objects.create(user = instance)

@receiver(post_save, sender=Product)
def invalid_product_cache(sender, instance, **kwargs):

    cache.clear()

@receiver(post_delete, sender=Product)
def invalid_product_cache_delete(sender, instance, **kwargs):

    cache.clear()
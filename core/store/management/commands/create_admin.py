import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create or update the admin user"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        username = os.environ["DJANGO_ADMIN_USERNAME"]
        email = os.environ["DJANGO_ADMIN_EMAIL"]
        password = os.environ["DJANGO_ADMIN_PASSWORD"]

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email}
        )

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS("Admin user created."))
        else:
            self.stdout.write(self.style.SUCCESS("Admin user updated."))
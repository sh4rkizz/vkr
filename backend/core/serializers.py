from rest_framework import serializers

from core.models import User


class UserSerializers:
    class UserProfileSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['id', 'email', 'first_name', 'last_name', 'username']

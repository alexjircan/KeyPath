from rest_framework import serializers
from KeyPathApp.models import Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('UserId', 'UserName', 'UserEmail')

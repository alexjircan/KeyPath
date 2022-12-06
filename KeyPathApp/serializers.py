from rest_framework import serializers
from KeyPathApp.models import Users, Accounts


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('UserId', 'UserFirstName', 'UserLastName', 'UserPassword', 'UserEmail')


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounts
        fields = ('AccountId', 'AccountUser', 'AccountUserName', 'AccountPassword', 'AccountUrl')

from django.db import models


class Users(models.Model):
    UserId = models.AutoField(primary_key=True)
    UserFirstName = models.CharField(max_length=20, default="")
    UserLastName = models.CharField(max_length=20, default="")
    UserEmail = models.CharField(max_length=20, default="", unique=True)
    UserPassword = models.CharField(max_length=20, default="")


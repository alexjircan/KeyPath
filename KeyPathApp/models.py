from django.db import models


class Users(models.Model):
    UserId = models.AutoField(primary_key=True)
    UserName = models.CharField(max_length=20)
    UserEmail = models.CharField(max_length=20, default="")


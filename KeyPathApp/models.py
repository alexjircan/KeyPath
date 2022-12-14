from djongo import models


class Accounts(models.Model):
    id = models.IntegerField(primary_key=True)
    AccountUserName = models.CharField(max_length=20)
    AccountPassword = models.CharField(max_length=20)
    AccountUrl = models.CharField(max_length=20)


class Users(models.Model):
    UserId = models.AutoField(primary_key=True)
    UserFirstName = models.CharField(max_length=20, default="")
    UserLastName = models.CharField(max_length=20, default="")
    UserEmail = models.CharField(max_length=40, default="", unique=True)
    UserPassword = models.CharField(max_length=100, default="")
    UserAccounts = models.ArrayField(
        model_container=Accounts,
    )

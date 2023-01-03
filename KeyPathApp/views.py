import jwt
import secrets

import requests
from django.core.mail import EmailMessage
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import DatabaseError
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse, HttpResponse
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import UntypedToken

from KeyPathApp.models import Users
from KeyPathApp.serializers import UserSerializer, AccountSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings

BLACKLIST_TOKENS = set()


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class EmailSender(metaclass=Singleton):
    def send_registration_email(self, to_email, name, token):
        mail_subject = "Activate your user account"
        message = "Hello " + name + ",\n\nPlease click on the link below to confirm your registration:\n\n" + \
                  "http://localhost:4200/auth/confirm-email?token=" + token
        email = EmailMessage(mail_subject, message, to={to_email})
        if email.send():
            return "success"
        else:
            return "fail"

    def send_reset_email(self, to_email, name, token):
        mail_subject = "Reset your password"
        message = "Hello " + name + ",\n\nPlease click on the link below to reset your password:\n\n" + \
                  "http://localhost:4200/auth/password-reset/" + token
        email = EmailMessage(mail_subject, message, to={to_email})
        if email.send():
            return "success"
        else:
            return "fail"


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['FirstName'] = user.UserFirstName
        token['LastName'] = user.UserLastName

        return token


def checkToken(request):
    try:
        token = request.META.get('HTTP_AUTHORIZATION')
        if token is None:
            return 'Missing token'
        decoded = jwt.decode(token[7:], settings.SECRET_KEY, algorithms=["HS256"])
        if token in BLACKLIST_TOKENS:
            return 'Invalid token'
        return decoded.get('user_id')
    except Exception as ex:
        return 'Invalid token'


@csrf_exempt
def userLogin(request):
    if request.method == 'POST':
        json_data = JSONParser().parse(request)
        try:
            user = Users.objects.get(UserEmail=json_data["email"])
        except Users.DoesNotExist:
            return JsonResponse("Email not found", safe=False)

        if user.UserIsActive == 0:
            return JsonResponse("Email not confirmed", safe=False)

        if check_password(json_data["password"], user.UserPassword):
            refresh = MyTokenObtainPairSerializer.get_token(user)
            return JsonResponse(
                {
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh)
                }
                , status=status.HTTP_200_OK
            )
        else:
            return JsonResponse("Password incorrect", safe=False)
    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def userLogOut(request):
    if request.method == 'POST':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        token = request.META.get('HTTP_AUTHORIZATION')
        BLACKLIST_TOKENS.add(token)
        return JsonResponse("User was successfully logged out", safe=False)
    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def userRegister(request):
    if request.method == 'POST':
        try:
            json_data = JSONParser().parse(request)
            user_data = {"UserFirstName": json_data['firstname'], "UserLastName": json_data['lastname'],
                         "UserPassword": make_password(json_data['password']), "UserEmail": json_data['email'],
                         "UserAccounts": [], "UserToken": secrets.token_hex(32)}
            users_serializer = UserSerializer(data=user_data)
            if users_serializer.is_valid():
                users_serializer.save()
                email_sender = EmailSender()
                if email_sender.send_registration_email(json_data['email'], user_data["UserFirstName"], user_data["UserToken"]) == "success":
                    return JsonResponse("Registration success", safe=False)
                else:
                    return JsonResponse("Registration failed - email not sent", safe=False)
        except DatabaseError:
            return JsonResponse("Registration failed - duplicated email", safe=False)
        return JsonResponse("Registration failed", safe=False)
    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def userShow(request):
    if request.method == 'GET':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        user = Users.objects.get(UserId=token)
        data = {
            'firstname': user.UserFirstName,
            'lastname': user.UserLastName,
            'email': user.UserEmail
        }
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse("GET REQUEST!", safe=False)


@csrf_exempt
def refreshToken(request):
    if request.method == 'POST':
        json_data = JSONParser().parse(request)
        old_refresh = json_data["refresh_token"]
        try:
            UntypedToken(old_refresh)
            decoded_refresh = jwt.decode(old_refresh, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_refresh.get('user_id')
            user = Users.objects.get(UserId=user_id)
        except Exception:
            return JsonResponse("invalid token", safe=False)
        if user is None or decoded_refresh.get('token_type') != "refresh":
            return JsonResponse("invalid token", safe=False)
        refresh = MyTokenObtainPairSerializer.get_token(user)
        return JsonResponse(
            {
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }
            , status=status.HTTP_200_OK
        )
    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def userConfirmEmail(request):
    if request.method == 'GET':
        token = request.GET.get('token', None)
        try:
            user = Users.objects.get(UserToken=token)
        except Users.DoesNotExist:
            return JsonResponse("Activation Failed - invalid token", safe=False)
        user.UserToken = ""
        user.UserIsActive = 1
        user.save()
        return JsonResponse("Activation Succeeded", safe=False)
    else:
        return JsonResponse("GET REQUEST!", safe=False)


@csrf_exempt
def userResetPassword(request):
    if request.method == 'PATCH':
        token = request.GET.get('token', None)
        try:
            user = Users.objects.get(UserToken=token)
        except Users.DoesNotExist:
            return JsonResponse("Reset Failed - invalid token", safe=False)
        json_data = JSONParser().parse(request)
        user.UserToken = ""
        user.UserPassword = make_password(json_data['password'])
        user.save()
        return JsonResponse("Reset Succeeded", safe=False)
    else:
        return JsonResponse("PATCH REQUEST!", safe=False)


@csrf_exempt
def userSendResetEmail(request):
    if request.method == 'POST':
        json_data = JSONParser().parse(request)
        try:
            user = Users.objects.get(UserEmail=json_data['email'])
        except Users.DoesNotExist:
            return JsonResponse("Send Failed - invalid email", safe=False)
        token = secrets.token_hex(32)
        email_sender = EmailSender()
        if email_sender.send_reset_email(json_data['email'], user.UserFirstName, token) == "success":
            user.UserToken = token
            user.save()
            return JsonResponse("Sent email", safe=False)
        else:
            return JsonResponse("Send Failed", safe=False)
    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def userChangePassword(request):
    if request.method == 'PATCH':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        json_data = JSONParser().parse(request)
        user = Users.objects.get(UserId=token)
        user.UserPassword = make_password(json_data["password"])
        user.save()
        return JsonResponse("Password changed", safe=False)
    else:
        return JsonResponse("PATCH REQUEST!", safe=False)


@csrf_exempt
def accountsShow(request):
    if request.method == 'GET':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        accounts = Users.objects.get(UserId=token)
        data = {
            'accounts': accounts.UserAccounts
        }
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse("GET REQUEST!", safe=False)


@csrf_exempt
def accountAdd(request):
    if request.method == 'POST':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        json_data = JSONParser().parse(request)
        user = Users.objects.get(UserId=token)
        user_id = 0
        if len(user.UserAccounts) > 0:
            user_id = user.UserAccounts[len(user.UserAccounts) - 1]["id"] + 1
        new_account = {
            "id": user_id,
            "AccountUserName": json_data['username'],
            "AccountPassword": json_data['password'],
            "AccountUrl": json_data['url']
        }
        new_account_serialized = AccountSerializer(data=new_account)
        if new_account_serialized.is_valid():
            user.UserAccounts.extend([new_account_serialized.data])
            user.save()
            return JsonResponse("Account added successfully", safe=False)
        else:
            return JsonResponse("Account failed to add", safe=False)

    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def accountDelete(request):
    if request.method == 'DELETE':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        json_data = JSONParser().parse(request)
        accounts = [account for account in Users.objects.get(UserId=token).UserAccounts if
                    account['id'] == json_data["id"]]
        user = Users.objects.get(UserId=token)
        if len(accounts) == 1:
            user.UserAccounts.remove(accounts[0])
            user.save()
            return JsonResponse("Account deleted", safe=False)
        else:
            return JsonResponse("Delete failed", safe=False)
    else:
        return JsonResponse("DELETE REQUEST!", safe=False)


@csrf_exempt
def accountUpdate(request):
    if request.method == 'PUT':
        token = checkToken(request)
        if token == 'Invalid token' or token == 'Missing token':
            return JsonResponse(token, safe=False)
        json_data = JSONParser().parse(request)
        user = Users.objects.get(UserId=token)
        accounts = [account for account in user.UserAccounts if
                    account['id'] == json_data["id"]]
        if len(accounts) == 1:
            user.UserAccounts.remove(accounts[0])
            new_account = {
                "id": json_data["id"],
                "AccountUserName": json_data['AccountUserName'],
                "AccountPassword": json_data['AccountPassword'],
                "AccountUrl": json_data['AccountUrl']
            }
            new_account_serialized = AccountSerializer(data=new_account)
            if new_account_serialized.is_valid():
                user.UserAccounts.extend([new_account_serialized.data])
                user.save()
                return JsonResponse("Account updated successfully", safe=False)
            else:
                return JsonResponse("Account failed to update", safe=False)
        else:
            return JsonResponse("Account failed to update", safe=False)
    else:
        return JsonResponse("PUT REQUEST!", safe=False)


@csrf_exempt
def accountIcon(request):
    if request.method == 'GET':
        url = request.GET.get('url', None)
        try:
            image_data = requests.get(url)
            if image_data.apparent_encoding is None:
                response = HttpResponse(image_data, content_type="image/png")
                return response
            else:
                return JsonResponse("Failed to get an image", safe=False)
        except requests.exceptions.ConnectionError:
            return JsonResponse("Failed to get an image", safe=False)
    else:
        return JsonResponse("GET REQUEST!", safe=False)

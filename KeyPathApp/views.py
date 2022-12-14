import jwt
from django.core.mail import EmailMessage
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import DatabaseError
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from KeyPathApp.models import Users, Accounts
from KeyPathApp.serializers import UserSerializer, AccountSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings


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
        return decoded.get('user_id')
    except Exception as ex:
        return 'Invalid token'


def activateEmail(to_email):
    mail_subject = "Activate your user account."
    message = "Abc"
    email = EmailMessage(mail_subject, message, to={to_email})
    if email.send():
        return "success"
    else:
        return "fail"



@csrf_exempt
def userLogin(request):
    if request.method == 'POST':
        json_data = JSONParser().parse(request)
        try:
            user = Users.objects.get(UserEmail=json_data["email"])
        except Users.DoesNotExist:
            return JsonResponse("Email not found", safe=False)

        if check_password(json_data["password"], user.UserPassword):
            refresh = MyTokenObtainPairSerializer.get_token(user)
            return JsonResponse(
                {
                    'access_token': str(refresh.access_token),
                    # 'refresh_token': str(refresh)
                }
                , status=status.HTTP_200_OK
            )
        else:
            return JsonResponse("Password incorrect", safe=False)
    else:
        return JsonResponse("POST REQUEST!", safe=False)


@csrf_exempt
def userRegister(request):
    if request.method == 'POST':
        try:
            json_data = JSONParser().parse(request)
            user_data = {"UserFirstName": json_data['firstname'], "UserLastName": json_data['lastname'],
                         "UserPassword": make_password(json_data['password']), "UserEmail": json_data['email'],
                         "UserAccounts": []}
            users_serializer = UserSerializer(data=user_data)
            if users_serializer.is_valid():
                users_serializer.save()
                activateEmail(json_data['email'])
                return JsonResponse("Registration success", safe=False)
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
        new_account = {
            "id": len(user.UserAccounts),
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




import djongo.database
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import DatabaseError
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from KeyPathApp.models import Users
from KeyPathApp.serializers import UserSerializer



# Create your views here.

@csrf_exempt
def userLogin(request):
    if request.method == 'POST':
        json_data = JSONParser().parse(request)
        try:
            user = Users.objects.get(UserEmail=json_data["email"])
        except Users.DoesNotExist:
            return JsonResponse("Email not found", safe=False)

        if user.UserPassword == json_data["password"]:
            return JsonResponse("Login success", safe=False)
        else:
            return JsonResponse("Password incorrect", safe=False)

@csrf_exempt
def userRegister(request):
    if request.method == 'POST':
        try:
            json_data = JSONParser().parse(request)
            user_data = {"UserFirstName": json_data['firstname'], "UserLastName": json_data['lastname'],
                         "UserPassword": json_data['password'], "UserEmail": json_data['email']}
            users_serializer = UserSerializer(data=user_data)
            if users_serializer.is_valid():
                users_serializer.save()
                return JsonResponse("Registration success", safe=False)
        except DatabaseError:
            return JsonResponse("Registration failed - duplicated email", safe=False)
        return JsonResponse("Registration failed", safe=False)
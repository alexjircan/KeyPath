from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from KeyPathApp.models import Users
from KeyPathApp.serializers import UserSerializer


# Create your views here.

@csrf_exempt
def userApi(request, id=0):
    if request.method == 'GET':
        users = Users.objects.all()
        users_serializer = UserSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False)
    elif request.method == 'POST':
        user_data=JSONParser().parse(request)
        users_serializer=UserSerializer(data=user_data)
        if users_serializer.is_valid():
            users_serializer.save()
            return JsonResponse("Added Successfully", safe=False)
        return JsonResponse("Failed to Add", safe=False)
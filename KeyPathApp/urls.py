from django.urls import re_path

from KeyPathApp import views

urlpatterns = [
    re_path(r'^auth/login$', views.userLogin),
    re_path(r'^auth/register$', views.userRegister)
]

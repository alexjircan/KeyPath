from django.urls import re_path

from KeyPathApp import views

urlpatterns = [
    re_path(r'^user$', views.userApi)
]

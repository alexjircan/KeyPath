from django.urls import re_path

from KeyPathApp import views

urlpatterns = [
    re_path(r'^auth/login$', views.userLogin),
    re_path(r'^auth/register$', views.userRegister),
    re_path(r'^account/getAll$', views.accountsShow),
    re_path(r'^account/add$', views.accountAdd),
    re_path(r'^user/details$', views.userShow),
    re_path(r'^user/confirm-email$', views.userConfirmEmail),
]

from django.urls import re_path

from KeyPathApp import views

urlpatterns = [
    re_path(r'^refresh-token$', views.refreshToken),
    re_path(r'^auth/login$', views.userLogin),
    re_path(r'^auth/register$', views.userRegister),
    re_path(r'^user/details$', views.userShow),
    re_path(r'^user/confirm-email$', views.userConfirmEmail),
    re_path(r'^user/send-reset-email$', views.userSendResetEmail),
    re_path(r'^user/reset-password$', views.userResetPassword),
    re_path(r'^user/change-password$', views.userChangePassword),
    re_path(r'^account/getAll$', views.accountsShow),
    re_path(r'^account/delete$', views.accountDelete),
    re_path(r'^account/add$', views.accountAdd),
    re_path(r'^account/update$', views.accountUpdate),
    re_path(r'^account/get-url-icon$', views.accountIcon)
]

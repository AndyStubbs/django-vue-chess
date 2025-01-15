from django.urls import path
from . import views
from .views import CookieTokenObtainPairView
from .views import LogoutView
from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
)

urlpatterns = [
	path("register/", views.register_user, name="register-user"),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('login/', CookieTokenObtainPairView.as_view(), name='cookie_token_obtain_pair'),
	path('logout/', LogoutView.as_view(), name='logout'),
]

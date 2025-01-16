from django.urls import path
from . import views
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, delete_user

urlpatterns = [
	path("register/", views.register_user, name="register-user"),
	path("login/", CookieTokenObtainPairView.as_view(), name="cookie_token_obtain_pair"),
	path("logout/", LogoutView.as_view(), name="logout"),
	path("auth-check/", views.check_auth, name="check-auth"),
	path("delete-user/", delete_user, name="delete-user"),
	path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
]

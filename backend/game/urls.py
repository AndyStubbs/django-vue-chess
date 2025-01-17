from django.urls import path
from . import views

urlpatterns = [
	path("options/", views.options, name="game-options"),
]

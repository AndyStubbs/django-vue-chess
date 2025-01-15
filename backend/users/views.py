import random
import string

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
import logging

logger = logging.getLogger(__name__)

def generate_random_username():
	return "user_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=8))

@csrf_exempt
def register_user(request):
	if request.method == "POST":
		try:
			data = json.loads(request.body)
			
			# Generate a random username
			username = generate_random_username()
			
			# Ensure username uniqueness
			while User.objects.filter( username = username ).exists():
				username = generate_random_username()
			
			# Extract required fields
			email = data.get("email")
			password = data.get("password")

			# Basic validation
			if not username or not email or not password:
				return JsonResponse({"error": "All fields are required."}, status=400)

			# Validate email format
			try:
				EmailValidator()(email)
			except ValidationError:
				return JsonResponse({"error": "Invalid email format."}, status=400)

			# Validate password strength
			try:
				validate_password(password)
			except ValidationError as e:
				return JsonResponse({"error": " ".join(e.messages)}, status=400)

			# Check if username already exists
			if User.objects.filter(username=username).exists():
				return JsonResponse({"error": "Username is already taken."}, status=400)

			# Check if email already exists
			if User.objects.filter(email=email).exists():
				return JsonResponse({"error": "Email is already registered."}, status=400)

			# Create the user
			user = User.objects.create_user(username=username, email=email, password=password)

			return JsonResponse({
				"message": f"Successfully registered account for {email}."
			}, status=201)

		except json.JSONDecodeError:
			return JsonResponse({"error": "Invalid JSON data."}, status=400)

		except Exception as e:
			return JsonResponse({
				"error": f"An unexpected error occurred: {str(e)}"}, status=500
			)

	# Return 405 for non-POST requests
	return JsonResponse({"error": "Method not allowed."}, status=405)

class CookieTokenObtainPairView(APIView):
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		# Extract email and password
		email = request.data.get('email')
		password = request.data.get('password')
		
		if not email or not password:
			return Response( { "error": "Email and password are required." }, status = 400 )
		
		# Debug log
		logger.debug( f"Attempting login with email: {email}" )
		
		try:
			user = User.objects.get( email = email )
		except User.DoesNotExist:
			logger.debug( f"No user found with email: {email}" )
			return Response( { "error": "Invalid email or password." }, status = 401 )
		
		# Authenticate using username (required by authenticate)
		user = authenticate( username = user.username, password = password )
		
		if user is not None:
			# Generate tokens
			refresh = RefreshToken.for_user(user)
			access = refresh.access_token

			# Set cookies
			response = Response({"message": "Login successful"})
			response.set_cookie(
				settings.SIMPLE_JWT['AUTH_COOKIE'],  # Cookie name
				access,
				max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
			)
			return response
		return Response({"error": "Invalid credentials"}, status=401)

class LogoutView(APIView):
	def post(self, request, *args, **kwargs):
		response = Response({"message": "Logout successful"})
		response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
		return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
	return Response({"is_authenticated": True, "username": request.user.username})

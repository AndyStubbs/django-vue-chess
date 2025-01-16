import random
import string
import json
import logging
from datetime import datetime, timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate

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
				value=str(access),
				max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
			)
			response.set_cookie(
				key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
				value=str(refresh),
				httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
				max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
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
	try:
		# Extract the token from the request's cookies
		token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
		if not token:
			raise InvalidToken("No access token found in cookies.")

		# Validate and decode the token
		validated_token = JWTAuthentication().get_validated_token(token)

		# Extract expiration time (exp) from the token
		token_exp = validated_token.get("exp")

		return Response({
			"is_authenticated": True,
			"username": request.user.username,
			"email": request.user.email,
			"token_exp": token_exp
		})

	except InvalidToken:
		return Response({
			"is_authenticated": False,
			"error": "Invalid or expired token."
		}, status=401)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
	# Get the authenticated user
	user = request.user

	try:
		logger.info(f"User {user.username} deleted their account.")

		# Delete the user's account
		user.delete()
		response = Response({"message": "Account deleted successfully."}, status=200)
		response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
		response.delete_cookie(settings.SIMPLE_JWT['REFRESH_COOKIE'])

		# Return a success response
		return response

	except Exception as e:
		# Handle any errors
		return Response({"error": f"An error occurred: {str(e)}"}, status=500)

class CookieTokenRefreshView(TokenRefreshView):
	def post(self, request, *args, **kwargs):
		# Attempt to extract the refresh token from the cookie
		refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_COOKIE'])
		if not refresh_token:
			logger.warning("Refresh token not found in cookies.")
			return Response(
				{"error": "Refresh token not found in cookies."},
				status=status.HTTP_400_BAD_REQUEST
			)

		# Replace the request data with the refresh token
		request.data['refresh'] = refresh_token

		try:
			response = super().post(request, *args, **kwargs)
		except InvalidToken as e:
			logger.warning(f"Invalid or expired refresh token: {str(e)}")
			return Response(
				{"error": "Invalid or expired refresh token."},
				status=status.HTTP_401_UNAUTHORIZED
			)

		# Extract the new access token and its expiration time
		access_token = response.data.get('access')
		if access_token:
			token = AccessToken(access_token)
			exp_time = datetime.fromtimestamp(token.get("exp"), tz=timezone.utc)
			response.data['token_exp'] = exp_time.isoformat()

			# Set the new access token in the cookie
			response.set_cookie(
				settings.SIMPLE_JWT['AUTH_COOKIE'],
				access_token,
				httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
				max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
			)

		# Set the new refresh token in the cookie
		if 'refresh' in response.data:
			response.set_cookie(
				settings.SIMPLE_JWT['REFRESH_COOKIE'],
				response.data['refresh'],
				httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
				max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
			)
			del response.data['refresh']

		# Security headers
		response["X-Content-Type-Options"] = "nosniff"
		response["X-Frame-Options"] = "DENY"

		return response
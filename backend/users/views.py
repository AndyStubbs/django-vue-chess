import random
import string
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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

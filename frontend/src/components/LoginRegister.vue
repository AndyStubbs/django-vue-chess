<template>
	<!-- Login Form -->
	<div id="login-form-container">
		<h3>Login</h3>
		<form id="login-form">
			<div class="form-group">
				<label for="login-email">Email:</label>
				<input type="email" id="login-email" name="email" required value="" />
			</div>
			<div class="form-group">
				<label for="login-password">Password:</label>
				<div class="password-container">
					<input
						type="password"
						class="password"
						id="login-password"
						name="password"
						required
						value=""
					/>
					<CustomButton variant="icon">
						<EyeIcon />
					</CustomButton>
				</div>
			</div>
			<button type="submit" id="login-submit-btn" class="btn btn-c1">Login</button>
		</form>
		<p>
			Don't have an account?
			<a href="#" id="toggle-to-register">Register</a>
		</p>
	</div>
</template>
<script setup>
import EyeIcon from "./icons/EyeIcon.vue";
import CustomButton from "./custom/CustomButton.vue";
</script>

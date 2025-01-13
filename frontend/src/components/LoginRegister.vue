<template>
	<!-- Login Form -->
	<div>
		<form>
			<CustomInput label="Email:" required />
			<CustomInput label="Password:" type="password" required />
			<button type="submit" id="login-submit-btn" class="btn btn-c1">Login</button>
		</form>
		<p>
			Don't have an account?
			<a href="#" id="toggle-to-register">Register</a>
		</p>
	</div>
</template>
<script setup>
import CustomInput from "./custom/CustomInput.vue";
</script>

<template>
	<!-- Login Form -->
	<div>
		<form>
			<CustomInput label="Email" placeholder="Enter Email" required class="login-email" />
			<CustomInput
				label="Password"
				placeholder="Enter Password"
				class="login-password"
				type="password"
				required
			/>
			<CustomButton type="submit" class="login-submit">Login</CustomButton>
		</form>
		<p>
			Don't have an account?
			<a href="#" id="toggle-to-register">Register</a>
		</p>
	</div>
</template>
<script setup>
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
</script>
<style scoped>
.login-password {
	margin: 12px 0;
}
.login-submit {
	margin-top: 6px;
}
</style>

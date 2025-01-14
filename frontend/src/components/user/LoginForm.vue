<template>
	<div>
		<form @submit.prevent="submitLogin">
			<CustomInput
				v-model="email"
				:error="emailError"
				label="Email"
				placeholder="Enter Email"
				required
			/>
			<CustomInput
				v-model="password"
				:error="passwordError"
				label="Password"
				placeholder="Enter Password"
				type="password"
				required
			/>
			<CustomButton type="submit" class="login-submit">Login</CustomButton>
		</form>
		<p>
			Don't have an account?
			<CustomButton variant="link" @click="emits('register')">Register</CustomButton>
		</p>
	</div>
</template>
<script setup>
import { ref, computed } from "vue";
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { usePasswordValidate } from "@/composables/usePasswordValidate";
const emits = defineEmits(["register"]);
const email = ref("");
const password = ref("");
const emailError = computed(() => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.value)) {
		return "Please enter a valid email address.";
	}
	return "";
});
const passwordError = computed(() => usePasswordValidate().validate(password.value));
const submitLogin = () => {
	if (validateLogin()) {
		console.log("Submitting Login");
	}
};
const validateLogin = () => {
	if (emailError.value) {
		return false;
	}
	return true;
};
</script>
<style scoped>
.form-group {
	margin: 0;
}
.login-submit {
	margin-top: 6px;
}
</style>

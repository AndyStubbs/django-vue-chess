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
			<CustomButton type="submit" class="login-submit" :disabled="disableSubmit"
				>Login</CustomButton
			>
		</form>
		<p>
			Don't have an account?
			<CustomButton variant="link" @click="emits('register')">Register</CustomButton>
		</p>
	</div>
</template>
<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { usePasswordValidate } from "@/composables/usePasswordValidate";
import { useToastStore } from "@/stores/toast.js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const toastStore = useToastStore();
const emits = defineEmits(["register"]);
const email = ref("astubbs50@gmail.com");
const password = ref("TestPassword1$");
const disableSubmit = ref(false);
const emailError = computed(() => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.value)) {
		return "Please enter a valid email address.";
	}
	return "";
});
const passwordError = computed(() => usePasswordValidate().validate(password.value));
const submitLogin = async () => {
	if (validateLogin()) {
		disableSubmit.value = true;
		try {
			const response = await axios.post("/api/users/login/", {
				email: email.value,
				password: password.value,
			});
			await authStore.checkAuth();
			if (!authStore.isAuthenticated) {
				throw { message: "Login failed" };
			}
			toastStore.addToast({
				message: response.data.message,
				status: "success",
				duration: 5000,
			});
		} catch (error) {
			const status = "error";
			let message = "";
			if (error.response && error.response.data && error.response.data.error) {
				message = error.response.data.error;
			} else if (error.message) {
				message = error.message;
			} else {
				console.error(error);
			}
			if (message !== "") {
				toastStore.addToast({ message, status });
			}
		} finally {
			disableSubmit.value = false;
		}
	}
};
const validateLogin = () => {
	if (emailError.value || passwordError.value) {
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

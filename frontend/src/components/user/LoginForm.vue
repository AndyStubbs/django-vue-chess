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
import { ref, computed } from "vue";
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { usePasswordValidate } from "@/composables/usePasswordValidate";
import { useEmailValidate } from "@/composables/useEmailValidate";
import { useToastStore } from "@/stores/toast.js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const toastStore = useToastStore();
const emits = defineEmits(["register", "close"]);
const email = ref("astubbs50@gmail.com");
const password = ref("TestPassword1$");
const disableSubmit = ref(false);
const emailValidate = useEmailValidate();
const emailError = computed(() => emailValidate.validate(email.value));
const passwordValidate = usePasswordValidate();
const passwordError = computed(() => passwordValidate.validate(password.value));
const submitLogin = async () => {
	if (validateLoginForm()) {
		disableSubmit.value = true;
		try {
			await authStore.login(email.value, password.value);
			toastStore.addToast({
				message: "You are now logged in. Have fun!",
				status: "success",
				duration: 5000,
			});
			emits("close");
		} catch (error) {
			const status = "error";
			const message = error.message;
			if (message !== "") {
				toastStore.addToast({ message, status, duration: 15000 });
			}
		} finally {
			disableSubmit.value = false;
		}
	}
};
const validateLoginForm = () => {
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

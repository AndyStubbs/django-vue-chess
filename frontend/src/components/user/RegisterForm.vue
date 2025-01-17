<template>
	<div>
		<form @submit.prevent="submitRegister">
			<CustomInput
				v-model="email"
				:error="emailError"
				label="Email"
				placeholder="Enter Email"
				required
				class="register-email"
			/>
			<CustomInput
				v-model="password"
				:error="passwordError"
				label="Password"
				placeholder="Enter Password"
				class="register-password"
				type="password"
				required
			/>
			<CustomInput
				v-model="confirm"
				:error="confirmError"
				label="Confirm Password"
				placeholder="Confirm Password"
				class="confirm-password"
				type="password"
				required
			/>
			<CustomButton type="submit" class="register-submit" :disabled="disableSubmit"
				>Register</CustomButton
			>
		</form>
		<p>
			Already have an account?
			<CustomButton variant="link" @click="emits('login')">Login</CustomButton>
		</p>
	</div>
</template>
<script setup>
import { ref, computed } from "vue";
import api from "@/utils/api";
import URLS from "@/utils/urls";
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { usePasswordValidate } from "@/composables/usePasswordValidate";
import { useToastStore } from "@/stores/toast.js";

const toastStore = useToastStore();
const emits = defineEmits(["login"]);

const email = ref("astubbs50@gmail.com");
const password = ref("TestPassword1$");
const confirm = ref("TestPassword1$");
const disableSubmit = ref(false);
const emailError = computed(() => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.value)) {
		return "Please enter a valid email address.";
	}
	return "";
});
const usePassword = usePasswordValidate();
const passwordError = computed(() => usePassword.validate(password.value));
const confirmError = computed(() =>
	confirm.value === password.value ? "" : "Please confirm password.",
);
const submitRegister = async () => {
	if (validateRegister()) {
		disableSubmit.value = true;
		try {
			const response = await api.post(URLS.REGISTER, {
				email: email.value,
				password: password.value,
			});
			toastStore.addToast({
				message: response.data.message,
				status: "success",
				duration: 5000,
			});
		} catch (error) {
			console.error(error);
			const status = "error";
			let message = "";
			if (error.response && error.response.data && error.response.data.error) {
				message = error.response.data.error;
			} else {
				message = error.message;
			}
			toastStore.addToast({ message, status });
		} finally {
			disableSubmit.value = false;
		}
	}
};

const validateRegister = () => {
	if (emailError.value || passwordError.value || confirmError.value) {
		return false;
	}
	return true;
};
</script>
<style scoped>
.form-group {
	margin: 12px 0;
}
.register-submit {
	margin-top: 6px;
}
</style>

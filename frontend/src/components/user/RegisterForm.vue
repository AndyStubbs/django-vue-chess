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
			<CustomButton type="submit" class="register-submit">Register</CustomButton>
		</form>
		<p>
			Already have an account?
			<CustomButton variant="link" @click="emits('login')">Login</CustomButton>
		</p>
	</div>
</template>
<script setup>
import { ref, computed } from "vue";
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { usePasswordValidate } from "@/composables/usePasswordValidate";
const emits = defineEmits(["login"]);

const email = ref("");
const password = ref("");
const confirm = ref("");
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
const submitRegister = () => {
	if (validateRegister()) {
		console.log("Submitting Register");
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

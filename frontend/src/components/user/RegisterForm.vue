<template>
	<div>
		<form>
			<CustomInput label="Email" placeholder="Enter Email" required class="register-email" />
			<CustomInput
				label="Password"
				placeholder="Enter Password"
				class="register-password"
				type="password"
				required
			/>
			<CustomInput
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
import CustomInput from "@/components/custom/CustomInput.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
const emits = defineEmits(["login"]);
</script>
<style scoped>
.form-group {
	margin: 12px 0;
}
.register-submit {
	margin-top: 6px;
}
</style>

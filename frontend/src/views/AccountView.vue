<template>
	<h1>Account</h1>
	<div>Username: {{ auth.username }}</div>
	<div>Email: {{ auth.email }}</div>
	<div style="margin-top: 8px">
		<CustomButton @click="logout" style="width: 120px">Logout</CustomButton>
	</div>
	<div style="margin-top: 8px">
		<CustomButton @click="deleteAccount" style="width: 120px">Delete Account</CustomButton>
	</div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import CustomButton from "@/components/custom/CustomButton.vue";
const auth = useAuthStore();
const logout = () => {
	auth.logout();
};
const deleteAccount = () => {
	if (confirm("Are you sure you want to delete your account?")) {
		auth.deleteAccount();
	}
};
</script>

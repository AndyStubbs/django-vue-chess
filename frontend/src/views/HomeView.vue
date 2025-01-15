<template>
	<div>
		<h1>Home Page</h1>
		<TestMessage />
		<TestModal />
		<CustomButton @click="toast">Toast</CustomButton>
	</div>
</template>

<script setup>
import TestMessage from "@/components/TestMessage.vue";
import TestModal from "@/components/TestModal.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { useToastStore } from "@/stores/toast.js";

const toastStore = useToastStore();
const STATUS = ["success", "info", "warn", "error"];
function toast() {
	const status = STATUS[Math.floor(Math.random() * STATUS.length)];
	toastStore.addToast({
		message: `This is a ${status} message!`,
		status: status,
		duration: 50000,
	});
}
</script>

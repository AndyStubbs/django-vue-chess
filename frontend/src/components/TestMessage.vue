<template>
	<div>
		<h1>{{ message }}</h1>

		<CustomButton variant="1" @click="fetchMessage" :disabled="btnDisabled"
			>Load Message</CustomButton
		>
	</div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/utils/api";
import CustomButton from "@/components/custom/CustomButton.vue";

const message = ref("Click the button to load a message!");
const btnDisabled = ref(false);

const fetchMessage = async () => {
	try {
		const response = await api.get("/api/test-message/");
		message.value = response.data.message;
		btnDisabled.value = true;
	} catch (error) {
		console.error("Error fetching the message:", error);
		message.value = "Failed to load message.";
	}
};
</script>

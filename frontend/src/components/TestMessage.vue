<template>
	<div>
		<h1>{{ message }}</h1>

		<button @click="fetchMessage">Load Message</button>
	</div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const message = ref("Click the button to load a message!");

const fetchMessage = async () => {
	try {
		const response = await axios.get("/api/test-message/");
		message.value = response.data.message;
	} catch (error) {
		console.error("Error fetching the message:", error);
		message.value = "Failed to load message.";
	}
};
</script>

<style>
h1 {
	color: #333;
}
</style>

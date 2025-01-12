<template>
	<div>
		<button @click="showModal = true">Open Modal</button>
		<BasicModal
			v-bind:isVisible="showModal"
			title="Welcome to the Modal"
			@close="showModal = false"
		>
			<p>This is the modal body content!</p>
			<template #footer>
				<button @click="showModal = false">Close</button>
			</template>
		</BasicModal>
	</div>
</template>

<script setup>
import BasicModal from "@/components/BasicModal.vue";
import { ref } from "vue";

const showModal = ref(false);
</script>

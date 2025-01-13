<template>
	<div>
		<CustomButton @click="showModal = true" variant="1">Open Modal</CustomButton>
		<BasicModal
			v-bind:isVisible="showModal"
			title="Welcome to the Modal"
			@close="showModal = false"
		>
			<p>This is the modal body content!</p>
			<template #footer>
				<CustomButton @click="showModal = false" variant="1">Close</CustomButton>
			</template>
		</BasicModal>
	</div>
</template>

<script setup>
import BasicModal from "@/components/BasicModal.vue";
import CustomButton from "./CustomButton.vue";

import { ref } from "vue";

const showModal = ref(false);
</script>

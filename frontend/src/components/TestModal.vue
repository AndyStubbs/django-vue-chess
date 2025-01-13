<template>
	<div>
		<CustomButton @click="showModal = true" variant="1">Open Modal</CustomButton>
		<CustomModal
			v-bind:isVisible="showModal"
			title="Welcome to the Modal"
			@close="showModal = false"
		>
			<p>This is the modal body content!</p>
			<template #footer>
				<CustomButton @click="showModal = false" variant="1">Close</CustomButton>
			</template>
		</CustomModal>
	</div>
</template>

<script setup>
import CustomModal from "@/components/custom/CustomModal.vue";
import CustomButton from "@/components/custom/CustomButton.vue";

import { ref } from "vue";

const showModal = ref(false);
</script>

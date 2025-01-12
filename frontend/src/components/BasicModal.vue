<template>
	<div v-if="isVisible" class="modal-overlay" @click="handleBackdropClick">
		<div class="modal-content" @click.stop>
			<header class="modal-header">
				<h3>{{ title }}</h3>
				<button class="close-button" @click="closeModal">x</button>
			</header>
			<div class="modal-body">
				<slot />
			</div>
			<footer class="modal-footer">
				<slot name="footer" />
			</footer>
		</div>
	</div>
</template>

<script setup>
//import { emit } from "vue";

const props = defineProps({
	title: {
		type: String,
		default: "Modal Title",
	},
	isVisible: {
		type: Boolean,
		required: true,
	},
	closeOnBackdrop: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["close"]);

function closeModal() {
	emit("close");
}

function handleBackdropClick() {
	if (props.closeOnBackdrop) {
		closeModal();
	}
}
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background: #fff;
	padding: 1.5rem;
	border-radius: 8px;
	width: 90%;
	max-width: 500px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	position: relative;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #eaeaea;
	padding-bottom: 0.5rem;
	margin-bottom: 1rem;
}

.close-button {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: #333;
}

.modal-body {
	padding: 1rem 0;
}

.modal-footer {
	margin-top: 1rem;
	text-align: right;
}
</style>

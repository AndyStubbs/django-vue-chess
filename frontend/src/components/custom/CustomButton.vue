<template>
	<button :class="className"><slot /></button>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
	variant: String,
});
const className = computed(() => `btn-${props.variant}`);
</script>

<style scoped>
.btn-1 {
	color: var(--btn-fg-color-1);
	background-color: var(--btn-bg-color-1);
	border-color: var(--btn-border-color-1);
	cursor: pointer;
	padding: 5px 10px;
	border: 1px solid var(--btn-border-color-1);
	border-radius: 5px;
	transition-duration: 0.35s;
}
.btn-1:hover {
	background-color: var(--btn-hover-bg-color-1, pink);
}
.btn-1:disabled {
	background-color: var(--btn-disabled-bg-color-1);
	opacity: 0.8;
}

.btn-icon {
	background-color: rgba(0, 0, 0, 0);
	border: none;
	padding: 0.5rem 1rem;
	cursor: pointer;
	border-radius: 3px;
	font-family: var(--font-body);
	transition-duration: 0.35s;
}
.btn-icon:hover {
	opacity: 0.8;
	transform: scale(1.1);
}
.btn-icon:disabled {
	opacity: 0.35;
}
</style>

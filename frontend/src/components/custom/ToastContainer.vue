<template>
	<div class="toast-container">
		<TransitionGroup name="toast" tag="div">
			<CustomToast
				v-for="(toast, index) in store.toasts"
				:key="toast.id"
				:status="toast.status"
				:index="index"
				:duration="toast.duration"
				:onDismiss="() => store.removeToast(toast.id)"
			>
				{{ toast.message }}
			</CustomToast>
		</TransitionGroup>
	</div>
</template>

<script setup>
import { useToastStore } from "@/stores/toast";
import CustomToast from "@/components/custom/CustomToast.vue";
const store = useToastStore();
</script>

<style scoped>
.toast-container {
	position: fixed;
	top: 160px;
	right: 0px;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	gap: 16px;
}
.toast-move,
.toast-enter-active,
.toast-leave-active {
	transition: all 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
	opacity: 0;
	transform: translateX(100%) translateY(0);
}
</style>

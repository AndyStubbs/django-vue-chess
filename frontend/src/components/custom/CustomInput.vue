<template>
	<div class="form-group">
		<label v-if="props.label" :for="id">{{ props.label }}</label>
		<div v-if="type === 'password'">
			<input :id="id" :type="props.type" />
			<CustomButton variant="icon">
				<EyeIcon />
			</CustomButton>
		</div>
		<div v-else>
			<input :id="id" :type="props.type" />
		</div>
		<div></div>
	</div>
</template>
<script setup>
import EyeIcon from "@/components/icons/EyeIcon.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { useId } from "vue";
const props = defineProps({
	required: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
		default: "text",
	},
	name: {
		type: String,
		default: "input",
	},
	label: {
		type: String,
		default: "",
	},
});
const id = `${useId()}`;
</script>

<style scoped>
.form-group {
	width: 100%;
}
input {
	width: 100%;
}
</style>

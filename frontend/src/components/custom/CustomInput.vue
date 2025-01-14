<template>
	<div class="form-group">
		<label v-if="props.label" :for="id">{{ props.label }}</label>
		<div class="password" v-if="type === 'password'">
			<input :id="id" type="password" :placeholder="props.placeholder" v-bind="$attrs" />
			<CustomButton variant="icon-b">
				<EyeIcon />
			</CustomButton>
		</div>
		<div v-else>
			<input :id="id" :type="props.type" :placeholder="props.placeholder" v-bind="$attrs" />
		</div>
		<div></div>
	</div>
</template>
<script setup>
import EyeIcon from "@/components/icons/EyeIcon.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import { useId } from "vue";
defineOptions({
	inheritAttrs: false,
});
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
	placeholder: {
		type: String,
		default: "",
	},
});
const id = `${useId()}`;
</script>

<style scoped>
label {
	font-weight: bold;
}
.form-group {
	width: 100%;
}
input {
	width: 100%;
	height: 38px;
	box-sizing: border-box;
	padding: 0 6px;
}
.password {
	display: flex;
	column-gap: 12px;
}
.password button {
	width: 40px;
	height: 38px;
}
.password svg {
	position: relative;
	top: -2px;
	left: -8px;
}
</style>

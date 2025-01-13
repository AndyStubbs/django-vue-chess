<template>
	<div class="form-group">
		<label for="login-email">Email:</label>
		<input :type="props.type" id="login-email" name="email" required value="" />
		<span></span>
	</div>
</template>
<script setup>
const props = defineProps({
	type: {
		type: String,
		default: "text",
	},
});
</script>

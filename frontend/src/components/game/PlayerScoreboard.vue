<template>
	<div class="scoreboard">
		<div class="icon" :class="color"></div>
		<div class="details">
			<div class="name">Player 1 (206) - 08:13</div>
			<div class="captures">&#9812; &#9813; &#9814; &#9815; &#9816;</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	color: String,
});
</script>

<style scoped>
.scoreboard {
	display: flex;
	flex-direction: row;
	column-gap: 8px;
	width: 250px;
	height: 80px;
	color: black;
	background-color: yellowgreen;
	border: 1px solid black;
	padding: 5px;
}
.details {
	display: flex;
	flex-direction: column;
}
.player {
	display: flex;
	flex-direction: row;
}
.icon {
	width: 64px;
	height: 64px;
}
.icon.b {
	background-color: black;
}
.icon.w {
	background-color: white;
}
</style>

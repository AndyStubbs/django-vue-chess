<template>
	<div class="scoreboard">
		<div class="player">
			<div class="icon" :class="color"></div>
			<div class="name">Player 1 (206)</div>
		</div>
		<div class="captures">&#9812; &#9813; &#9814; &#9815; &#9816;</div>
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
	flex-direction: column;
	width: 250px;
	height: 80px;
	color: black;
	background-color: yellowgreen;
	border: 1px solid black;
	padding: 5px;
}
.player {
	display: flex;
	flex-direction: row;
}
.icon {
	width: 32px;
	height: 32px;
	margin-right: 8px;
}
.icon.b {
	background-color: black;
}
.icon.w {
	background-color: white;
}
</style>

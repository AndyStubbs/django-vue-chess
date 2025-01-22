<template>
	<div class="scoreboard">
		<div class="icon">
			<img :src="color === 'b' ? PIECES.k : PIECES.K" :class="color" />
		</div>
		<div class="details">
			<div class="name">
				<div>Player 1 (206)</div>
				<div class="time">08:13</div>
			</div>
			<div class="captures">
				<img :src="PIECES.p" />
				<img :src="PIECES.p" />
				<img :src="PIECES.p" />
				<img :src="PIECES.p" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { PIECES } from "@/utils/constants";
defineProps({
	color: String,
});
</script>

<style scoped>
.scoreboard {
	display: flex;
	flex-direction: row;
	column-gap: 8px;
	width: 300px;
	height: 80px;
	color: var(--fg-color-1);
	border: 3px solid var(--border-color-1);
	box-shadow: 0 0 5px var(--shadow-color-3);
	border-radius: 9px;
	padding: 5px;
}
.details {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.player {
	display: flex;
	flex-direction: row;
}
.icon {
	background-color: #88888833;
}
.icon img {
	width: 64px;
	height: 64px;
	position: relative;
	top: -1px;
}
.name {
	display: flex;
	justify-content: space-between;
}
.time {
	padding: 0 8px;
	font-family: var(--font-time);
	font-weight: bold;
	font-size: large;
	background-color: var(--shadow-color-4);
	text-shadow: 2px 1px 11px var(--input-bg-color-1);
	color: var(--fg-color-3);
}
.captures {
	margin-left: 12px;
}
.captures img {
	width: 32px;
	height: 32px;
	margin-left: -20px;
}
</style>

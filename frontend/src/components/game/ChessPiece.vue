<template>
	<img
		:src="PIECES[square.type]"
		width="10"
		height="10"
		draggable="false"
		@mousedown="mousedown"
		@mouseup="mouseup"
		:style="{
			left: `${x}px`,
			top: `${y}px`,
			cursor,
			zIndex: isDragging ? 1 : 0,
			transitionDuration: transition,
		}"
	/>
</template>

<script setup>
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game";
import { PIECES } from "@/utils/constants";

const gameStore = useGameStore();
const props = defineProps({
	square: Object,
});
const isDragging = ref(false);
const mousePosX = ref(0);
const mousePosY = ref(0);
const x = ref(0);
const y = ref(0);
const transition = ref("0");

let hoverElement = null;
let moves = null;

const cursor = computed(() => {
	if (gameStore.turn === gameStore.userColor && props.square.color === gameStore.userColor) {
		return isDragging.value ? "grabbing" : "grab";
	}
	return "not-allowed";
});

const mousedown = () => {
	if (props.square.color !== gameStore.userColor || gameStore.turn !== gameStore.userColor) {
		return;
	}
	hoverElement = null;
	isDragging.value = true;
	moves = gameStore.getValidMoves(props.square.square);
	gameStore.clearMarks();
	gameStore.clearHovered();
	moves.forEach((move) => {
		gameStore.addMark(move.to, "move-mark");
	});
	transition.value = "";
	gameStore.addMark(props.square.square, "reset-mark");
};
const mouseup = () => {
	isDragging.value = false;
	transition.value = "0.25s";
	x.value = 0;
	y.value = 0;
	if (!hoverElement) {
		return;
	}
	const moveSquare = hoverElement.dataset.square;
	if (moveSquare !== "") {
		for (const move of moves) {
			if (move.to === moveSquare) {
				gameStore.makeMove(move);
			}
		}
	}
	hoverElement = null;
};
window.addEventListener("mousemove", (e) => {
	if (isDragging.value) {
		const diffX = e.clientX - mousePosX.value;
		const diffY = e.clientY - mousePosY.value;
		x.value += diffX;
		y.value += diffY;

		// Get the hover square
		const elementsOver = document.elementsFromPoint(mousePosX.value, mousePosY.value);
		elementsOver.forEach((el) => {
			if (el.classList.contains("chess-square") && hoverElement !== el) {
				hoverElement = el;
				gameStore.addHovered(hoverElement.dataset.square);
			}
		});
	}
	mousePosX.value = e.clientX;
	mousePosY.value = e.clientY;
});
</script>

<style scoped>
img {
	position: relative;
	width: var(--square-size);
	height: var(--square-size);
}
</style>

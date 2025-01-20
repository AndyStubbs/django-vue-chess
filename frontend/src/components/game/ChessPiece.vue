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
			cursor: isDragging ? 'grabbing' : 'grab',
			zIndex: isDragging ? 1 : 0,
			transitionDuration: transition,
		}"
	/>
</template>

<script setup>
import { ref } from "vue";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
const props = defineProps({
	square: Object,
});
const PIECES = {
	P: "/images/chess/pawn-w.svg", // White Pawn
	p: "/images/chess/pawn-b.svg", // Black Pawn
	N: "/images/chess/knight-w.svg", // White Knight
	n: "/images/chess/knight-b.svg", // Black Knight
	B: "/images/chess/bishop-w.svg", // White Bishop
	b: "/images/chess/bishop-b.svg", // Black Bishop
	R: "/images/chess/rook-w.svg", // White Rook
	r: "/images/chess/rook-b.svg", // Black Rook
	Q: "/images/chess/queen-w.svg", // White Queen
	q: "/images/chess/queen-b.svg", // Black Queen
	K: "/images/chess/king-w.svg", // White King
	k: "/images/chess/king-b.svg", // Black King
};

const isDragging = ref(false);
const mousePosX = ref(0);
const mousePosY = ref(0);
const x = ref(0);
const y = ref(0);
const transition = ref("0");

let hoverElement = null;
let moves = null;

const mousedown = () => {
	isDragging.value = true;
	moves = gameStore.getValidMoves(props.square.square);
	gameStore.clearMarks();
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
	const moveSquare = hoverElement.dataset.square;
	if (moveSquare !== "") {
		for (const move of moves) {
			if (move.to === moveSquare) {
				gameStore.makeMove(move);
			}
		}
	}
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

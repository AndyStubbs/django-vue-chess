<template>
	<img
		:src="getPiece(square)"
		width="10"
		height="10"
		draggable="false"
		@mousedown="isDragging = true"
		@mouseup="isDragging = false"
		:style="{
			left: `${x}px`,
			top: `${y}px`,
			cursor: isDragging ? 'grabbing' : 'grab',
			zIndex: isDragging ? 1 : 0,
		}"
	/>
</template>

<script setup>
import { ref } from "vue";
defineProps({
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
const getPiece = (square) => {
	if (square.color === "w") {
		return PIECES[square.type.toUpperCase()];
	}
	return PIECES[square.type];
};
const isDragging = ref(false);
const mousePosX = ref(0);
const mousePosY = ref(0);
const x = ref(0);
const y = ref(0);

window.addEventListener("mousemove", (e) => {
	if (isDragging.value) {
		const diffX = e.clientX - mousePosX.value;
		const diffY = e.clientY - mousePosY.value;
		x.value += diffX;
		y.value += diffY;
	}
	mousePosX.value = e.clientX;
	mousePosY.value = e.clientY;
});
document.addEventListener("mouseleave", () => (isDragging.value = false));
</script>
<style scoped>
img {
	position: relative;
	width: var(--square-size);
	height: var(--square-size);
}
</style>

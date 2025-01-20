<template>
	<img
		:src="getPiece(square)"
		width="10"
		height="10"
		draggable="false"
		@mousedown="$emit('pieceselected', square)"
		@mouseup="$emit('piecereleased', square)"
	/>
</template>

<script setup>
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
</script>
<style scoped>
img {
	position: relative;
	width: var(--square-size);
	height: var(--square-size);
}
</style>

<template>
	<div class="chess-board" :style="`--square-size: ${squareSize}px`">
		<div v-for="(row, rowIndex) in board" :key="rowIndex" class="chess-row">
			<div
				v-for="(square, colIndex) in row"
				:key="`${rowIndex}-${colIndex}`"
				class="chess-square"
				:class="[getSquareColor(rowIndex, colIndex)]"
			>
				<img v-if="square?.type" :src="getPiece(square)" width="50" height="50" />
			</div>
		</div>
	</div>
</template>

<script setup>
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
defineProps({
	board: Array,
});
const squareSize = 80;
const getSquareColor = (rowIndex, colIndex) => {
	return (rowIndex + colIndex) % 2 === 0 ? "white" : "black";
};
const getPiece = (square) => {
	if (square.color === "w") {
		return PIECES[square.type.toUpperCase()];
	}
	return PIECES[square.type];
};
</script>

<style scoped>
.chess-board {
	display: grid;
	grid-template-rows: repeat(8, 0fr);
	max-width: 100%;
	max-height: 100%;
	margin: auto;
}
.chess-row {
	display: grid;
	grid-template-columns: repeat(8, 0fr);
}
.chess-square {
	aspect-ratio: 1 / 1;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	width: var(--square-size);
	height: var(--square-size);
}
.chess-square img {
	width: 100%;
	height: 100%;
}
.chess-square.white {
	background-color: #f0d9b5;
}
.chess-square.black {
	background-color: #b58863;
}
</style>

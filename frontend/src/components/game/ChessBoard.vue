<template>
	<div class="chess-board" :style="`--square-size: ${squareSize}px`">
		<div v-for="(row, rowIndex) in board" :key="rowIndex" class="chess-row">
			<div
				v-for="square in row"
				:key="square.key"
				class="chess-square"
				:class="square.bColor"
				@mouseover="$emit('squarehover')"
			>
				<div v-if="square.marked" class="mark" :class="square.marked">&nbsp;</div>
				<ChessPiece
					v-if="square?.type"
					:square="square"
					@pieceselected="$emit('pieceselected', square)"
					@piecereleased="$emit('piecereleased', square)"
				></ChessPiece>
			</div>
		</div>
	</div>
</template>

<script setup>
import ChessPiece from "@/components/game/ChessPiece.vue";
defineProps({
	board: Array,
});
const squareSize = 80;
</script>

<style scoped>
.chess-board {
	display: grid;
	grid-template-rows: repeat(8, 0fr);
	max-width: 100%;
	max-height: 100%;
	margin: auto;
	user-select: none;
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
.chess-square.white {
	background-color: #f0d9b5;
}
.chess-square.black {
	background-color: #b58863;
}
.chess-square .mark {
	position: absolute;
	width: calc(var(--square-size) * 0.67);
	height: calc(var(--square-size) * 0.67);
	text-align: center;
	border-radius: 999px;
	opacity: 0.5;
	transform: rotate(180deg);
}
.chess-square .reset-mark {
	border: 2px inset #aaaaaa;
	background-color: #aaccaa;
}
.chess-square .move-mark {
	border: 2px inset #33aa33;
	background-color: #33cc33;
}
</style>

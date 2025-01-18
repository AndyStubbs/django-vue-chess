<template>
	<div>
		<h1>Chess Game</h1>
		<div class="board">
			<ChessBoard :board="board" />
			<CustomButton @click="run(true)">Run</CustomButton>
			<CustomButton @click="run(false)">Pause</CustomButton>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { Chess } from "chess.js";
import CustomButton from "@/components/custom/CustomButton.vue";
import ChessBoard from "@/components/game/ChessBoard.vue";

const chess = new Chess();
const ascii = ref(chess.ascii());
const board = ref(chess.board());
console.log(chess.board());
let interval = null;
const run = (start) => {
	if (start && interval === null) {
		interval = setInterval(makeRandomMove, 100);
	} else if (!start) {
		clearInterval(interval);
		interval = null;
	}
};

// Methods
const makeRandomMove = () => {
	const moves = chess.moves();
	if (chess.isGameOver() || moves.length === 0) {
		run(false);
		alert("Game Over!");
		return;
	}
	if (moves.length > 0) {
		const move = moves[Math.floor(Math.random() * moves.length)];
		chess.move(move);
		ascii.value = chess.ascii();
		board.value = chess.board();
	}
};
</script>

<style scoped>
.board {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

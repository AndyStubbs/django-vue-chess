<template>
	<div>
		<div class="board">
			<ChessBoard :board="gameStore.board" />
			<CustomButton @click="run(true)">Run</CustomButton>
			<CustomButton @click="run(false)">Pause</CustomButton>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useGameStore } from "@/stores/game";
import CustomButton from "@/components/custom/CustomButton.vue";
import ChessBoard from "@/components/game/ChessBoard.vue";

const gameStore = useGameStore();
let interval = null;
const run = (start) => {
	if (start && interval === null) {
		interval = setInterval(makeRandomMove, 10);
	} else if (!start) {
		clearInterval(interval);
		interval = null;
	}
};

// Hooks
onMounted(() => {
	gameStore.initGame();
});

const makeRandomMove = () => {
	gameStore.makeRandomMove();
};
</script>

<style scoped>
.board {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

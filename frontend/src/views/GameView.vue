<template>
	<div>
		<div class="game">
			<ChessBoard :board="gameStore.board" />
			<div class="scoreboards">
				<PlayerScoreboard color="b" />
				<PlayerScoreboard color="w" />
			</div>
			<div class="actions">
				<CustomButton @click="run(true)">Run</CustomButton>
				<CustomButton @click="run(false)">Pause</CustomButton>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useGameStore } from "@/stores/game";
import CustomButton from "@/components/custom/CustomButton.vue";
import ChessBoard from "@/components/game/ChessBoard.vue";
import PlayerScoreboard from "@/components/game/PlayerScoreboard.vue";

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
.game {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.scoreboards {
	position: relative;
	left: 8px;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	column-gap: 32px;
}
.actions {
	margin-top: 16px;
	display: flex;
}
</style>

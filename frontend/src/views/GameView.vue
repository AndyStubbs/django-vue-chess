<template>
	<div>
		<div class="game">
			<ChessBoard
				:board="gameStore.board"
				:is-reversed="gameStore.userColor === 'b'"
				@on-piece-moved="onPieceMoved"
			/>
			<div class="scoreboards">
				<PlayerScoreboard
					color="w"
					:active="gameStore.turn === 'w'"
					:player="gameStore.players.w"
				/>
				<PlayerScoreboard
					color="b"
					:active="gameStore.turn === 'b'"
					:player="gameStore.players.b"
				/>
			</div>
			<div class="actions">
				<CustomButton @click="run(true)">Run</CustomButton>
				<CustomButton @click="run(false)">Pause</CustomButton>
				<CustomButton @click="reset()">Reset</CustomButton>
			</div>
		</div>
	</div>
	<Teleport to="body">
		<CustomModal
			title="Promotion"
			:isVisible="showPromotion"
			style="max-width: 370px; background-color: var(--green-color-2); color: white"
			@close="cancelPromotion"
		>
			<CustomButton variant="icon" @click="promote('n')">
				<img :src="gameStore.userColor === 'w' ? PIECES.N : PIECES.n" />
			</CustomButton>
			<CustomButton variant="icon" @click="promote('b')">
				<img :src="gameStore.userColor === 'w' ? PIECES.B : PIECES.b" />
			</CustomButton>
			<CustomButton variant="icon" @click="promote('r')">
				<img :src="gameStore.userColor === 'w' ? PIECES.R : PIECES.r" />
			</CustomButton>
			<CustomButton variant="icon" @click="promote('q')">
				<img :src="gameStore.userColor === 'w' ? PIECES.Q : PIECES.q" />
			</CustomButton>
		</CustomModal>
	</Teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useGameStore } from "@/stores/game";
import CustomButton from "@/components/custom/CustomButton.vue";
import ChessBoard from "@/components/game/ChessBoard.vue";
import CustomModal from "@/components/custom/CustomModal.vue";
import PlayerScoreboard from "@/components/game/PlayerScoreboard.vue";
import { PIECES } from "@/utils/constants";

const gameStore = useGameStore();

// Refs
const showPromotion = ref(false);

let promotions = [];
let interval = null;
const run = (start) => {
	if (start && interval === null) {
		interval = setInterval(makeRandomMove, 10);
	} else if (!start) {
		clearInterval(interval);
		interval = null;
	}
};
const reset = () => {
	gameStore.resetGame();
};
const makeRandomMove = () => {
	gameStore.makeRandomMove();
};
const onPieceMoved = (moves) => {
	console.log(moves);
	if (moves.length === 1) {
		gameStore.makeMove(moves[0]);
	} else if (moves.length > 0) {
		promotions = moves;
		showPromotion.value = true;
	}
};
const promote = (promoted) => {
	for (const move of promotions) {
		if (move.promotion === promoted) {
			gameStore.makeMove(move);
			break;
		}
	}
	showPromotion.value = false;
};
const cancelPromotion = () => {
	showPromotion.value = false;
};

// Hooks
onMounted(() => {
	gameStore.startGame();
});
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
	column-gap: 16px;
}
</style>

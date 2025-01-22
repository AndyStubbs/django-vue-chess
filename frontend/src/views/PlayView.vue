<template>
	<div>
		<h1>Play</h1>
		<div class="wrapper">
			<div class="menu">
				<form @submit.prevent="submitGame" class="game-options">
					<div>
						<h2>Opponent</h2>
					</div>
					<div class="toggle-group">
						<ToggleGroup :options="OPPONENTS" v-model="gameOpponent">
							<template #default="{ option }">
								{{ option.value }}
							</template>
						</ToggleGroup>
					</div>
					<div><h2>Bot</h2></div>
					<div class="toggle-group">
						<ToggleGroup :options="BOTS" v-model="gameBot">
							<template #default="{ option }">
								{{ option.value }}
							</template>
						</ToggleGroup>
					</div>
					<div><h2>Game Mode</h2></div>
					<ToggleGroup :options="gameModes" v-model="selectedGameMode">
						<template #default="{ option }">
							<span>{{ option.name }}</span>
							<div>{{ option.time }} + {{ option.bonus }}</div>
						</template>
					</ToggleGroup>
					<div class="control-options">
						<CustomButton type="submit" variant="3" @click="startGame"
							>Start Game</CustomButton
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import api from "@/utils/api";
import URLS from "@/utils/urls";
import CustomButton from "@/components/custom/CustomButton.vue";
import ToggleGroup from "@/components/custom/ToggleGroup.vue";

// Constants
const OPPONENTS = [
	{ id: 0, value: "Human" },
	{ id: 1, value: "Bot" },
	{ id: 2, value: "Practice" },
];

// Bots
const BOTS = [{ id: 0, value: "Randy" }];

// Use Variables
const gameStore = useGameStore();
const router = useRouter();

// Refs
const gameOpponent = ref(OPPONENTS[1]);
const gameBot = ref(BOTS[0]);
const selectedGameMode = ref({ id: -1 });

// Other Variables
let gameModes = [];

// Hooks
onMounted(async () => {
	try {
		const data = (await api(URLS.GAME_OPTIONS)).data;
		gameModes = structuredClone(data.game_modes);
		selectedGameMode.value = gameModes.find((gm) => gm.id === data.default_game_mode);
	} catch (error) {
		console.error("Failed to load game modes:", error);
	}
});

const startGame = () => {
	gameStore.setGameSettings({
		opponent: gameOpponent.value,
		bot: gameBot.value,
		mode: selectedGameMode.value,
	});
	router.push({ name: "game" });
};
</script>

<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
}
.menu {
	display: flex;
	flex-direction: column;
	row-gap: 16px;
	max-width: 800px;
	width: 100%;
}
.menu button {
	height: 45px;
}
.game-options {
	display: flex;
	flex-direction: column;
	row-gap: 8px;
}
.toggle-group {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-auto-rows: 50px;
	row-gap: 8px;
	column-gap: 8px;
}
.selected-game-mode {
	border: 3px solid var(--active-item-color);
}
.control-options {
	border-top: 1px solid var(--border-color-1);
	margin-top: 8px;
	padding-top: 16px;
	display: flex;
	justify-content: space-between;
}
.control-options button {
	width: 120px;
}
</style>

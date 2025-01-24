<template>
	<div>
		<h1>Play</h1>
		<div class="wrapper">
			<div class="menu">
				<form @submit.prevent="submitGame" class="game-options">
					<!-- Opponent Selection -->
					<div>
						<h2>Opponent</h2>
					</div>
					<div class="toggle-group">
						<ToggleGroup :options="OPPONENT_TYPES" v-model="opponentType">
							<template #default="{ option }">
								{{ option.value }}
							</template>
						</ToggleGroup>
					</div>

					<!-- Bot Selection -->
					<div><h2>Bot</h2></div>
					<div class="toggle-group">
						<ToggleGroup :options="availableBots" v-model="selectedBot">
							<template #default="{ option }">
								{{ option.name }}
							</template>
						</ToggleGroup>
					</div>

					<!-- Game Mode Selection -->
					<div><h2>Game Mode</h2></div>
					<ToggleGroup :options="availableGameModes" v-model="selectedGameMode">
						<template #default="{ option }">
							<span>{{ option.name }}</span>
							<div>{{ option.time }} + {{ option.bonus }}</div>
						</template>
					</ToggleGroup>

					<!-- Piece Preference -->
					<div><h2>Play As</h2></div>
					<div class="toggle-group">
						<ToggleGroup :options="PIECE_PREFERENCES" v-model="piecePreference">
							<template #default="{ option }">
								{{ option.value }}
							</template>
						</ToggleGroup>
					</div>

					<!-- Start Game -->
					<div class="control-options">
						<CustomButton type="button" variant="3" @click="startGame">
							Start Game
						</CustomButton>
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
import { useAuthStore } from "@/stores/auth";
import { loadBots } from "@/utils/loadBots";
import api from "@/utils/api";
import URLS from "@/utils/urls";
import CustomButton from "@/components/custom/CustomButton.vue";
import ToggleGroup from "@/components/custom/ToggleGroup.vue";

// Constants
const OPPONENT_TYPES = [
	{ id: 0, value: "Human" },
	{ id: 1, value: "Bot" },
	{ id: 2, value: "Practice" },
];

const PIECE_PREFERENCES = [
	{ id: "r", value: "Random" },
	{ id: "w", value: "White" },
	{ id: "b", value: "Black" },
];

// Stores
const gameStore = useGameStore();
const authStore = useAuthStore();
const router = useRouter();

// Refs
const opponentType = ref(OPPONENT_TYPES[1]);
const selectedBot = ref(null);
const selectedGameMode = ref(null);
const piecePreference = ref(PIECE_PREFERENCES[0]); // Default to White

// Data
let availableGameModes = [];
let availableBots = [];

// Hooks
onMounted(async () => {
	try {
		// Load game modes from the server
		const data = (await api(URLS.GAME_OPTIONS)).data;
		availableGameModes = structuredClone(data.game_modes);
		selectedGameMode.value = availableGameModes.find((gm) => gm.id === data.default_game_mode);

		// Load bots
		availableBots = await loadBots();
		selectedBot.value = availableBots[0];
	} catch (error) {
		console.error("Failed to load game modes or bots:", error);
	}
});

// Start game logic
const startGame = () => {
	let userColor = piecePreference.value.id;
	if (userColor === "r") {
		userColor = Math.random() > 0.5 ? "w" : "b";
	}
	const playerSettings = {
		[userColor]: {
			name: authStore.name,
			rating: authStore.rating,
			userId: authStore.userId,
			botId: null,
		},
		[userColor === "w" ? "b" : "w"]: {
			name: selectedBot.value.name,
			rating: selectedBot.value.rating,
			userId: selectedBot.value.id,
			botId: selectedBot.value.id,
		},
	};
	gameStore.setGameSettings({
		userColor,
		opponentType: opponentType.value,
		mode: selectedGameMode.value,
		players: playerSettings,
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
	border-top: 1px solid var(--green-color-1);
	margin-top: 8px;
	padding-top: 16px;
	display: flex;
	justify-content: space-between;
}
.control-options button {
	width: 120px;
}
</style>

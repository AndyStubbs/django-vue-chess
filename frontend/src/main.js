import "./assets/base.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useGameStore } from "./stores/game";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Restore authorization
const authStore = useAuthStore();
authStore.restoreAuth();

// Restore game
const gameStore = useGameStore();
gameStore.restoreGame();

app.mount("#app");

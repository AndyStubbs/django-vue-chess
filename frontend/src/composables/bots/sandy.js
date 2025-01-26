//composables/bots/fish.js

"use strict";

import { useEngine } from "@/composables/engines/zeyu2001";

export function useBot() {
	const id = "sandy";
	const name = "Sandy";
	const rating = 100;
	const DEPTH = 1;
	const engine = useEngine();

	const getMove = (chess, color) => {
		return engine.getBestMove(chess, color, DEPTH)[0];
	};

	const updateEngine = (chess, move) => {
		return engine.updateEngine(chess, move);
	};

	return {
		id,
		name,
		rating,
		getMove,
		updateEngine,
	};
}

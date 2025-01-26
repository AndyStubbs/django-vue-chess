//composables/bots/fish.js

"use strict";

import { useEngine } from "@/composables/engines/zeyu2001";

export function useBot() {
	const id = "sandy";
	const name = "Sandy";
	const rating = 100;
	const DEPTH = 3;
	const engine = useEngine();

	const getMove = async (chess, color) => {
		const [bestMove] = await engine.getBestMoveAsync(chess, color, DEPTH, 10000);
		return bestMove;
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

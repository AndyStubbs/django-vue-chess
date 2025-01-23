//compoasables/bots/useRandyBot.js

"use strict";

export function useBot() {
	const id = "randy";
	const displayName = "Randy";
	const rating = 0;

	const getMove = (chess) => {
		const moves = chess.moves();
		return moves[Math.floor(Math.random() * moves.length)];
	};

	return {
		id,
		displayName,
		rating,
		getMove,
	};
}

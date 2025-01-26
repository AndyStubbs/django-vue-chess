//compoasables/bots/randy.js

"use strict";

export function useBot() {
	const id = "randy";
	const name = "Randy";
	const rating = 0;

	const getMove = (chess) => {
		const moves = chess.moves({ verbose: true });
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(moves[Math.floor(Math.random() * moves.length)]);
			}, Math.random() * 1000);
		});
	};

	const updateEngine = () => {
		return null;
	};

	return {
		id,
		name,
		rating,
		getMove,
		updateEngine,
	};
}

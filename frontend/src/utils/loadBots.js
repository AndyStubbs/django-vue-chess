// utils/loadBots.js

"use strict";

export async function loadBots() {
	const botModules = import.meta.glob("../composables/bots/*.js");
	const bots = [];

	for (const path in botModules) {
		const module = await botModules[path]();
		if (module.useBot) {
			const bot = module.useBot();
			bots.push({
				id: bot.id,
				displayName: bot.displayName,
				rating: bot.rating,
				getMove: bot.getMove,
			});
		}
	}

	return bots;
}

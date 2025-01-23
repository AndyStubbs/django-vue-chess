// stores/game.js

"use strict";

import { ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { Chess } from "chess.js";
import { loadBots } from "@/utils/loadBots";

function mapBoard(board, marks, hovered) {
	return board.map((row, rowIndex) => {
		return row.map((cell, colIndex) => {
			const bColor = (rowIndex + colIndex) % 2 === 0 ? "white" : "black";
			if (cell === null) {
				cell = {
					square: getSquareFromIndices(colIndex, rowIndex),
					type: null,
				};
			} else {
				if (cell.color === "w") {
					cell.type = cell.type.toUpperCase();
				}
			}
			cell.bColor = bColor;
			if (marks.has(cell.square)) {
				cell.marked = marks.get(cell.square);
			} else {
				cell.marked = "";
			}
			if (hovered === cell.square) {
				cell.hovered = "hovered";
			}

			return cell;
		});
	});
}

function getSquareFromIndices(colIndex, rowIndex) {
	return `${String.fromCharCode("a".charCodeAt(0) + colIndex)}${8 - rowIndex}`;
}

async function loadBot(player) {
	const allBots = await loadBots();
	const displayName = player.bot.displayName;
	player.bot = allBots.find((bot) => bot.displayName === displayName);
}

const DEFAULT_SETTINGS = {
	players: {
		w: {
			displayName: null,
			rating: null,
			userId: null,
			isMainPlayer: false,
			bot: null,
			time: 0,
		},
		b: {
			displayName: null,
			rating: null,
			userId: null,
			isMainPlayer: false,
			bot: null,
			time: 0,
		},
	},
	opponentType: null,
	mode: null,
};

export const useGameStore = defineStore("game", () => {
	let settings = structuredClone(DEFAULT_SETTINGS);
	let chess = new Chess();
	const board = shallowRef([]);
	const turn = ref("w");
	const marks = new Map();
	let hovered = null;
	let saveTimeout = null;

	const setGameSettings = ({ opponentType, mode, players }) => {
		settings = structuredClone(DEFAULT_SETTINGS);
		settings.opponentType = opponentType;
		settings.mode = mode;
		settings.players = players;
		resetGame();
	};

	const updateBoard = () => {
		board.value = mapBoard(chess.board(), marks, hovered);
		turn.value = chess.turn();
		saveGame();
	};

	const makeMove = (move) => {
		try {
			chess.move(move);
			clearMarks();
			clearHovered();
			updateBoard();
			endTurn();
			return true;
		} catch {
			return false;
		}
	};

	const makeRandomMove = () => {
		const moves = chess.moves();
		if (chess.isGameOver()) {
			return false;
		}
		if (moves.length > 0) {
			const move = moves[Math.floor(Math.random() * moves.length)];
			makeMove(move);
			return true;
		}
		return false;
	};

	const endTurn = async () => {
		if (chess.isGameOver()) {
			if (chess.isDraw()) {
				alert("Draw");
			} else {
				if (chess.turn() === "b") {
					alert("White Wins!");
				} else {
					alert("Black Wins");
				}
			}
		} else {
			const bot = settings.players[chess.turn()].bot;
			if (bot) {
				const move = await bot.getMove(chess);
				makeMove(move);
			}
		}
	};

	const getValidMoves = (square) => {
		const moves = chess.moves({ square, verbose: true });
		return moves;
	};

	const addMark = (square, value) => {
		marks.set(square, value);
		updateBoard();
	};

	const clearMarks = () => {
		marks.clear();
	};

	const addHovered = (square) => {
		hovered = square;
		updateBoard();
	};

	const clearHovered = () => {
		hovered = null;
		updateBoard();
	};

	const saveGame = () => {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveGame2, 1);
	};

	const resetGame = () => {
		chess = new Chess();
		chess.setHeader("White", settings.players.w.displayName);
		chess.setHeader("Black", settings.players.b.displayName);
		chess.setHeader("Date", new Date().toISOString().split("T")[0]);
		updateBoard();
	};

	const saveGame2 = () => {
		let wBotId = settings.players.w.bot ? settings.players.w.bot.id : null;
		let bBotId = settings.players.b.bot ? settings.players.b.bot.id : null;
		const gameData = {
			settings: {
				opponentType: settings.opponentType,
				mode: settings.mode,
				players: {
					w: {
						displayName: settings.players.w.displayName,
						rating: settings.players.w.rating,
						userId: settings.players.w.userId,
						isMainPlayer: settings.players.w.isMainPlayer,
						bot: wBotId,
						time: settings.players.w.time,
					},
					b: {
						displayName: settings.players.b.displayName,
						rating: settings.players.b.rating,
						userId: settings.players.b.userId,
						isMainPlayer: settings.players.b.isMainPlayer,
						bot: bBotId,
						time: settings.players.b.time,
					},
				},
			},
			pgn: chess.pgn(),
		};
		localStorage.setItem("gameData", JSON.stringify(gameData));
	};

	const restoreGame = async () => {
		const dataStr = localStorage.getItem("gameData");
		if (!dataStr) {
			return;
		}
		const data = JSON.parse(dataStr);
		const loadedSettings = data.settings;
		const loadedPgn = data.pgn;

		// Load Settings
		settings.opponentType = loadedSettings.opponentType;
		settings.mode = loadedSettings.mode;
		settings.players = loadedSettings.players;
		if (settings.players.w.bot) {
			loadBot(settings.players.w);
		}
		if (settings.players.b.bot) {
			loadBot(settings.players.b);
		}

		// Load Chess Game
		chess = new Chess();
		chess.loadPgn(loadedPgn);

		// Update the board
		updateBoard();
	};

	return {
		// Game settings
		settings,
		setGameSettings,

		// Game Logic
		chess,
		board,
		turn,
		resetGame,
		restoreGame,
		makeMove,
		makeRandomMove,
		getValidMoves,
		addMark,
		clearMarks,
		addHovered,
		clearHovered,
	};
});

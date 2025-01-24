// stores/game.js

"use strict";

import { ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { Chess } from "chess.js";
import { loadBots } from "@/utils/loadBots";

function mapBoard(board, marks, hovered, isReverse) {
	const mappedBoard = [];

	for (let i = 0; i < board.length; i += 1) {
		let rowIndex = i;
		if (isReverse) {
			rowIndex = board.length - 1 - i;
		}
		const row = board[rowIndex];
		mappedBoard.push(
			row.map((cell, colIndex) => {
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
			}),
		);
	}
	return mappedBoard;
}

function getSquareFromIndices(colIndex, rowIndex) {
	return `${String.fromCharCode("a".charCodeAt(0) + colIndex)}${8 - rowIndex}`;
}

export const useGameStore = defineStore("game", () => {
	let chess = new Chess();
	let hovered = null;
	let opponentType = null;
	let mode = null;
	const marks = new Map();
	const board = shallowRef([]);
	const turn = ref("w");
	const players = ref({
		w: {
			displayName: "Player 1 (0)",
			time: 0,
			captures: [],
		},
		b: {
			displayName: "Player 2 (0)",
			time: 0,
			captures: [],
		},
	});
	const staticPlayersData = {
		w: {
			name: null,
			rating: null,
			userId: null,
			botId: null,
			bot: null,
		},
		b: {
			name: null,
			rating: null,
			userId: null,
			botId: null,
			bot: null,
		},
	};
	const userColor = ref("w");

	const setGameSettings = (settings) => {
		opponentType = settings.opponentType;
		mode = settings.mode;
		userColor.value = settings.userColor;
		resetPlayers(players.value, staticPlayersData, settings.players);
		userColor.value = settings.userColor;
		resetGame();
	};

	const updateBoard = () => {
		board.value = mapBoard(chess.board(), marks, hovered, userColor.value === "b");
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
				if (turn.value === "b") {
					alert("White Wins!");
				} else {
					alert("Black Wins");
				}
			}
		} else {
			const bot = staticPlayersData[turn.value].bot;
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

	const startGame = () => {
		endTurn();
	};

	const resetGame = () => {
		chess = new Chess();
		chess.setHeader("White", staticPlayersData.w.name);
		chess.setHeader("Black", staticPlayersData.b.name);
		chess.setHeader("Date", new Date().toISOString().split("T")[0]);
		updateBoard();
		endTurn();
	};

	const saveGame = () => {
		const gameData = {
			settings: {
				userColor: userColor.value,
				opponentType: opponentType,
				mode: mode,
				players: {
					w: {
						name: staticPlayersData.w.name,
						rating: staticPlayersData.w.rating,
						userId: staticPlayersData.w.userId,
						botId: staticPlayersData.w.botId,
						time: players.value.w.time,
						captures: players.value.w.captures,
					},
					b: {
						name: staticPlayersData.b.name,
						rating: staticPlayersData.b.rating,
						userId: staticPlayersData.b.userId,
						botId: staticPlayersData.b.botId,
						time: players.value.b.time,
						captures: players.value.b.captures,
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
		opponentType = loadedSettings.opponentType;
		mode = loadedSettings.mode;
		userColor.value = loadedSettings.userColor;
		resetPlayers(players.value, staticPlayersData, loadedSettings.players);
		players.value.w.time = loadedSettings.players.w.time;
		players.value.w.captures = loadedSettings.players.w.captures;
		players.value.b.time = loadedSettings.players.b.time;
		players.value.b.captures = loadedSettings.players.b.captures;

		// Load Chess Game
		chess = new Chess();
		chess.loadPgn(loadedPgn);

		// Update the board
		updateBoard();
	};

	const resetPlayers = (playersValue, staticPlayersData, players) => {
		// White player
		staticPlayersData.w.name = players.w.name;
		staticPlayersData.w.rating = players.w.rating;
		staticPlayersData.w.userId = players.w.userId;
		staticPlayersData.w.botId = players.w.botId;
		playersValue.w.displayName = `${players.w.name} (${players.w.rating})`;
		playersValue.w.time = 0;
		playersValue.w.captures = [];

		// Black player
		staticPlayersData.b.name = players.b.name;
		staticPlayersData.b.rating = players.b.rating;
		staticPlayersData.b.userId = players.b.userId;
		staticPlayersData.b.botId = players.b.botId;
		playersValue.b.displayName = `${players.b.name} (${players.b.rating})`;
		playersValue.b.time = 0;
		playersValue.b.captures = [];

		// Load bots
		if (staticPlayersData.w.botId) {
			loadBot(staticPlayersData.w);
		} else {
			staticPlayersData.w.bot = null;
		}
		if (staticPlayersData.b.botId) {
			loadBot(staticPlayersData.b);
		} else {
			staticPlayersData.b.bot = null;
		}
	};

	const loadBot = async (player) => {
		const allBots = await loadBots();
		player.bot = allBots.find((bot) => bot.id === player.botId);
		endTurn();
	};

	return {
		// Game State
		chess,
		board,
		turn,
		players,
		userColor,

		// Game Methods
		setGameSettings,
		startGame,
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

// stores/game.js

"use strict";

import { ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { Chess } from "chess.js";
import { loadBots } from "@/utils/loadBots";
import { PIECE_WEIGHTS } from "@/utils/constants";

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

	// Refs
	const board = shallowRef([]);
	const turn = ref("w");
	const players = ref({
		w: {
			displayName: "Player 1 (0)",
			name: "Player 1",
			time: 0,
			captures: [],
		},
		b: {
			displayName: "Player 2 (0)",
			name: "Player 2",
			time: 0,
			captures: [],
		},
	});
	const userColor = ref("w");
	const gameover = ref(null);
	const gameoverType = ref(null);

	const setGameSettings = (settings) => {
		opponentType = settings.opponentType;
		mode = settings.mode;
		userColor.value = settings.userColor;
		resetPlayers(settings.players);
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
			if (move.captured) {
				const captured = turn.value === "b" ? move.captured.toUpperCase() : move.captured;
				players.value[turn.value].captures.push(captured);
				players.value[turn.value].captures.sort((a, b) => {
					return PIECE_WEIGHTS[a.toLowerCase()] - PIECE_WEIGHTS[b.toLowerCase()];
				});
			}
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
		const moves = chess.moves({ verbose: true });
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
			console.log("Game Over");
			if (chess.isDraw()) {
				console.log("DRAW");
				gameover.value = "tie";
				if (chess.isDrawByFiftyMoves()) {
					gameoverType.value = "Draw by 50 Moves";
				} else {
					gameoverType.value = "Draw by Insufficient Material";
				}
			} else if (chess.isStalemate()) {
				console.log("STALEMATE");
				gameover.value = "tie";
				gameoverType.value = "Stalemate";
			} else if (chess.isThreefoldRepetition()) {
				console.log("THREEFOLD REPETITION");
				gameover.value = "tie";
				gameoverType.value = "Stalemate";
			} else {
				if (turn.value === "b") {
					gameover.value = "w";
				} else {
					gameover.value = "b";
				}
			}
		} else {
			const bot = staticPlayersData[turn.value].bot;
			if (bot) {
				const move = await bot.getMove(chess);
				makeMove(move);
			}
		}
		console.log(gameoverType.value);
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
		gameover.value = null;
		gameoverType.value = null;
		chess = new Chess();
		chess.setHeader("White", staticPlayersData.w.name);
		chess.setHeader("Black", staticPlayersData.b.name);
		chess.setHeader("Date", new Date().toISOString().split("T")[0]);
		resetPlayers();
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
		resetPlayers(loadedSettings.players);
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

	const resetPlayers = (playersNewData) => {
		// White player
		if (playersNewData) {
			staticPlayersData.w.name = playersNewData.w.name;
			staticPlayersData.w.rating = playersNewData.w.rating;
			staticPlayersData.w.userId = playersNewData.w.userId;
			staticPlayersData.w.botId = playersNewData.w.botId;
			players.value.w.displayName = `${playersNewData.w.name} (${playersNewData.w.rating})`;
			players.value.w.name = playersNewData.w.name;
		}
		players.value.w.time = 0;
		players.value.w.captures = [];

		// Black player
		if (playersNewData) {
			staticPlayersData.b.name = playersNewData.b.name;
			staticPlayersData.b.rating = playersNewData.b.rating;
			staticPlayersData.b.userId = playersNewData.b.userId;
			staticPlayersData.b.botId = playersNewData.b.botId;
			players.value.b.displayName = `${playersNewData.b.name} (${playersNewData.b.rating})`;
			players.value.b.name = playersNewData.b.name;
		}
		players.value.b.time = 0;
		players.value.b.captures = [];

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
		gameover,
		gameoverType,

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

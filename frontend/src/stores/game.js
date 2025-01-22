// stores/game.js

"use strict";

import { shallowRef } from "vue";
import { defineStore } from "pinia";
import { Chess } from "chess.js";

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

export const useGameStore = defineStore("game", () => {
	const settings = {
		opponent: null,
		bot: null,
		mode: null,
	};

	const chess = new Chess();
	const board = shallowRef([]);
	const marks = new Map();
	let hovered = null;

	const setGameSettings = ({ opponent, bot, mode }) => {
		settings.opponent = opponent;
		settings.bot = bot;
		settings.mode = mode;
	};

	const initGame = () => {
		//if (!settings.mode) {
		//	throw new Error("Unable to start game, game settings not set.");
		//}
		resetGame();
	};

	const updateBoard = () => {
		board.value = mapBoard(chess.board(), marks, hovered);
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
			chess.move(move);
			updateBoard();
			endTurn();
			return true;
		}
		return false;
	};

	const endTurn = () => {
		if (chess.isGameOver()) {
			if (chess.isStalemate()) {
				alert("Stalemate");
			} else {
				if (chess.turn() === "b") {
					alert("White Wins!");
				} else {
					alert("Black Wins");
				}
			}
		} else if (chess.turn() === "b") {
			makeRandomMove();
		}
	};

	const getValidMoves = (square) => {
		const moves = chess.moves({ square, verbose: true });
		return moves;
	};

	const resetGame = () => {
		chess.reset();
		updateBoard();
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

	return {
		// Game settings
		settings,
		setGameSettings,

		// Game Logic
		chess,
		board,
		initGame,
		makeMove,
		makeRandomMove,
		getValidMoves,
		resetGame,
		addMark,
		clearMarks,
		addHovered,
		clearHovered,
	};
});

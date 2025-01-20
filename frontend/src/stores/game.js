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
			cell.key = getKeyFromIndices(colIndex, rowIndex);
			if (marks.has(cell.key)) {
				cell.marked = marks.get(cell.key);
			} else {
				cell.marked = "";
			}
			if (hovered === cell.key) {
				cell.hovered = "hovered";
			}

			return cell;
		});
	});
}

function getKeyFromIndices(colIndex, rowIndex) {
	return `${rowIndex}-${colIndex}`;
}

function getKeyFromSquare(square) {
	const col = square.charCodeAt(0) - "a".charCodeAt(0);
	const row = 8 - parseInt(square.charAt(1));
	return `${row}-${col}`;
}

function getSquareFromIndices(colIndex, rowIndex) {
	return `${String.fromCharCode("a".charCodeAt(0) + colIndex)}${rowIndex}`;
}

export const useGameStore = defineStore("game", () => {
	const chess = new Chess();
	const board = shallowRef([]);
	const marks = new Map();
	let hovered = null;

	const initGame = () => {
		resetGame();
	};

	const updateBoard = () => {
		board.value = mapBoard(chess.board(), marks, hovered);
	};

	const makeMove = (from, to) => {
		const move = chess.move({ from, to });
		if (move) {
			updateBoard();
		}
		return move;
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
			return true;
		}
		return false;
	};

	const getValidMoves = (square) => {
		const moves = chess.moves({ square, verbose: true });
		return moves;
	};

	const resetGame = () => {
		chess.reset();
		updateBoard();
	};

	const addMark = (key, value) => {
		marks.set(key, value);
		updateBoard();
	};

	const addHovered = (key) => {
		hovered = key;
		updateBoard();
	};

	const clearMarks = () => {
		marks.clear();
	};

	return {
		chess,
		board,
		initGame,
		makeMove,
		makeRandomMove,
		getValidMoves,
		resetGame,
		addMark,
		clearMarks,
		getKeyFromSquare,
		addHovered,
	};
});

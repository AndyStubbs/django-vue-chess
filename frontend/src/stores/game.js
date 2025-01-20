// stores/game.js

"use strict";

import { shallowRef } from "vue";
import { defineStore } from "pinia";
import { Chess } from "chess.js";

function mapBoard(board, marks) {
	return board.map((row, rowIndex) => {
		return row.map((cell, colIndex) => {
			const bColor = (rowIndex + colIndex) % 2 === 0 ? "white" : "black";
			if (cell === null) {
				cell = {
					square: `${String.fromCharCode("a".charCodeAt(0) + colIndex)}${rowIndex}`,
					type: null,
				};
			}
			cell.bColor = bColor;
			cell.key = `${rowIndex}-${colIndex}`;
			cell.marked = marks.has(cell.key);
			return cell;
		});
	});
}

export const useGameStore = defineStore("game", () => {
	const chess = new Chess();
	const board = shallowRef([]);
	const marks = new Set();

	const initGame = () => {
		resetGame();
	};

	const updateBoard = () => {
		board.value = mapBoard(chess.board(), marks);
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
		return chess.moves({ square, verbose: true });
	};

	const resetGame = () => {
		chess.reset();
		updateBoard();
	};

	const addMark = (key) => {
		marks.add(key);
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
	};
});

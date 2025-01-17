# config/game_config.py

GAME_OPTIONS = {
	"game_modes": [
		{ "id": 0, "name": "Bullet", "time": 1, "bonus": 0 },
		{ "id": 1, "name": "Bullet", "time": 1, "bonus": 1 },
		{ "id": 2, "name": "Blitz", "time": 3, "bonus": 0 },
		{ "id": 3, "name": "Blitz", "time": 3, "bonus": 2 },
		{ "id": 4, "name": "Rapid", "time": 10, "bonus": 0 },
		{ "id": 5, "name": "Rapid", "time": 10, "bonus": 5 },
		{ "id": 6, "name": "Classical", "time": 30, "bonus": 0 },
		{ "id": 7, "name": "Classical", "time": 30, "bonus": 10 },
	],
	"default_game_mode": 2,
}

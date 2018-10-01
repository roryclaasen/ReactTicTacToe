const Game = require('./game');

class GameManager {
	constructor() {
		this.games = {};
	}

	isInGame(socketId) {
		let game;
		for (const token of Object.keys(this.games)) {
			if (game !== undefined) break;
			const value = this.games[token];
			if (value.hasPlayer(socketId)) {
				game = value;
				break;
			}
		}
		return game;
	}

	hasGame(token) {
		return token in this.games;
	}

	newGame(token, cb) {
		this.games[token] = new Game(token);
		if (cb) cb(this.games[token]);
	}

	make(uid, cb) {
		const oldGame = this.isInGame(uid);
		if (oldGame !== undefined && oldGame !== null) {
			this.removeGame(oldGame.token);
		}
		let token;
		do {
			token = (Math.floor(Math.random() * 900000) + 100000).toString();
		} while (this.hasGame(token));
		this.newGame(token, cb);
	}

	joinGame(token, username, uid, cb) {
		const isPlayer = this.games[token].addPlayer(username, uid);
		if (cb) cb(this.games[token], isPlayer);
	}

	removeGame(token) {
		delete this.games[token];
	}

	getGame(token) {
		return this.games[token];
	}
}

const manager = new GameManager();
module.exports = manager;

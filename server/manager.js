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
		if (token === null || token === undefined) return false;
		return token in this.games;
	}

	getGame(token) {
		if (this.hasGame(token)) return this.games[token];
		throw new Error(`No Game exists with this token '${token}'`);
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
		if (!this.hasGame(token)) throw new Error(`No Game exists with this token '${token}'`);
		const isPlayer = this.games[token].addPlayer(username, uid);
		if (cb) cb(this.games[token], isPlayer);
	}

	removeGame(token) {
		if (this.hasGame(token)) delete this.games[token];
	}
}

const manager = new GameManager();
module.exports = manager;

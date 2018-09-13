class GameManager {
	constructor() {
		this.games = {};
	}

	hasGame(token) {
		return token in this.games;
	}

	make(cb) {
		var token;
		do {
			token = (Math.floor(Math.random() * 900000) + 100000).toString();
		} while (this.hasGame(token));
		this.newGame(token, cb);
	}

	newGame(token, cb) {
		this.games[token] = new Game(token);
		if (cb) cb(this.games[token]);
	}

	joinGame(token, username, uid, cb) {
		this.games[token].addPlayer(username, uid);
		if (cb) cb(this.games[token]);
	}

	removeGame(token) {
		delete this.games[token];
	}

	getGame(token) {
		return this.games[token];
	}
}

class Game {
	constructor(token) {
		this.token = token;
		this.players = [];
		this.spectators = [];
	}

	addPlayer(username, uid) {
		var player = {
			username: username,
			id: uid
		}
		if (this.players.length >= 2) this.spectators.push(player);
		else this.players.push(player);
	}

	removePlayer(uid) {
		var index = this.players.findIndex(p => p.id === uid);
		if (index > -1) this.players.splice(index, 1);
		else {
			index = this.spectators.findIndex(p => p.id === uid);
			if (index > -1) this.spectators.splice(index, 1);
		}
	}

	forClient() {
		return {
			token: this.token,
			players: this.players,
			spectators: this.spectators
		}
	}
}

const manager = new GameManager();
module.exports = manager;
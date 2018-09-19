const NO_SECTORS = 9;
const NO_CELLS = 9;
const NO_IN_ROW = 3;

class GameManager {
	constructor() {
		this.games = {};
	}

	isInGame(socketId) {
		return this.games.find(g => g.hasPlayer(socketId));
	}

	hasGame(token) {
		return token in this.games;
	}

	make(uid, cb) {
		var oldGame = this.isInGame(uid);
		if (oldGame !== undefined || oldGame !== null) {
			this.removeGame(oldGame.token);
		}
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

		var sectorList = [];
		for (var i = 0; i < NO_SECTORS; i++) {
			sectorList[i] = {
				cells: new Array(NO_CELLS).fill(-1),
				win: -1
			}
		}
		this.sectors = sectorList;
		this.sectorFinal = new Array(NO_CELLS).fill(-1);
		this.win = -1;
		this.current = 0;
		this.currentSector = -1;
	}

	addPlayer(username, uid) {
		var player = {
			username: username,
			id: uid
		}
		if (this.players.length >= 2) this.spectators.push(player);
		else this.players.push(player);
	}

	hasPlayer(uid) {
		var player = this.players.findIndex(p => p.id === uid);
		return player >= 0;
	}

	removePlayer(uid) {
		var index = this.players.findIndex(p => p.id === uid);
		if (index > -1) this.players.splice(index, 1);
		else {
			index = this.spectators.findIndex(p => p.id === uid);
			if (index > -1) this.spectators.splice(index, 1);
		}
	}

	click(sectorId, cellId, clientId) {
		var player = this.players[this.current];
		// May throw if current is not 0/1
		if (player.id !== clientId) return;
		if (this.win !== -1) return;

		if (this.currentSector !== -1 && this.currentSector !== sectorId) return;
		var sector = this.sectors[sectorId];

		if (sector.cells[cellId] !== -1) return;

		sector.cells[cellId] = this.current;
		this.current = this.current === 0 ? 1 : 0;

		this.currentSector = cellId;

		if (sector.win === -1) {
			var sectorWinner = this.calculateWinner(sector.cells);
			if (sectorWinner !== null) {
				sector.win = sectorWinner;
				this.sectorFinal[sectorId] = sectorWinner;
			}
		}

		var gameWinner = -1;
		if (this.win === -1) {
			gameWinner = this.calculateWinner(this.sectorFinal);
			if (gameWinner !== null) {
				this.win = gameWinner;
			}
		}

		var full = true;
		for (var i = 0; i < NO_CELLS; i++) {
			if (sector.cells[i] === -1) {
				full = false;
				break;
			}
		}

		if (full || gameWinner !== null) this.currentSector = -1;
		
		this.sectors[sectorId] = sector;
	}

	calculateWinner(cells) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (cells[a] !== -1 && cells[a] === cells[b] && cells[a] === cells[c]) {
				return cells[a];
			}
		}
		return null;
	}

	forClient(id) {
		return {
			token: this.token,
			players: this.players,
			spectators: this.spectators,
			sectors: this.sectors,
			sectorFinal: this.sectorFinal,
			win: this.win,
			current: this.current,
			currentSector: this.currentSector
		}
	}
}

const manager = new GameManager();
module.exports = manager;
import { NO_SECTORS, NO_CELLS, CalculateWinner } from '../src/globals';

export default class Game {
	constructor(token) {
		this.token = token;
		this.players = [];
		this.spectators = [];

		const sectorList = [];
		for (let i = 0; i < NO_SECTORS; i += 1) {
			sectorList[i] = {
				cells: new Array(NO_CELLS).fill(-1),
				win: -1
			};
		}
		this.sectors = sectorList;
		this.sectorFinal = new Array(NO_CELLS).fill(-1);
		this.win = -1;
		this.current = 0;
		this.currentSector = -1;
	}

	addPlayer(username, uid) {
		const player = {
			username,
			id: uid
		};
		if (this.players.length >= 2) {
			this.spectators.push(player);
			return false;
		}
		this.players.push(player);
		return true;
	}

	hasPlayer(uid) {
		const player = this.players.findIndex((p) => p.id === uid);
		return player >= 0;
	}

	removePlayer(uid) {
		let index = this.players.findIndex((p) => p.id === uid);
		if (index > -1) this.players.splice(index, 1);
		else {
			index = this.spectators.findIndex((p) => p.id === uid);
			if (index > -1) this.spectators.splice(index, 1);
		}
	}

	click(sectorId, cellId, clientId) {
		const player = this.players[this.current];
		// May throw if current is not 0/1
		if (player.id !== clientId) return;
		if (this.win !== -1) return;

		if (this.currentSector !== -1 && this.currentSector !== sectorId) return;
		const sector = this.sectors[sectorId];

		if (sector.cells[cellId] !== -1) return;

		sector.cells[cellId] = this.current;
		this.current = this.current === 0 ? 1 : 0;

		this.currentSector = cellId;

		if (sector.win === -1) {
			const sectorWinner = CalculateWinner(sector.cells);
			if (sectorWinner !== null) {
				sector.win = sectorWinner;
				this.sectorFinal[sectorId] = sectorWinner;
			}
		}

		let gameWinner = -1;
		if (this.win === -1) {
			gameWinner = CalculateWinner(this.sectorFinal);
			if (gameWinner !== null) {
				this.win = gameWinner;
			}
		}

		let full = true;
		for (let i = 0; i < sector.cells.length; i += 1) {
			if (sector.cells[i] === -1) {
				full = false;
				break;
			}
		}

		if (full || gameWinner !== null) this.currentSector = -1;

		this.sectors[sectorId] = sector;
	}

	forClient() {
		return {
			token: this.token,
			players: this.players,
			spectators: this.spectators,
			sectors: this.sectors,
			sectorFinal: this.sectorFinal,
			win: this.win,
			current: this.current,
			currentSector: this.currentSector
		};
	}
}

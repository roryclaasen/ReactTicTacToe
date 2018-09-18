import io from 'socket.io-client';
import * as commands from './socket.commands';

export default class SocketClient {

	constructor() {
		this.socket = io();
		//this.token = undefined;
		this.gameData = undefined;
		this.socketId = undefined;

		this.updateGameHandler = undefined;

		this.socket.on(commands.game.started, this.updateGame);
		this.socket.on(commands.game.update, this.updateGame);
		this.socket.on(commands.lobby.disconnected, this.updateGame);
	}

	setSocketId(id) {
		if (this.socketId !== undefined) return;
		this.socketId = id;
	}

	updateGame = (game) => {
		if (this.token !== game.token) return;
		this.gameData = game;
		if (this.updateGameHandler !== undefined) {
			this.updateGameHandler(this.gameData);
		}
	}

	createGame = (username, cb) => {
		this.socket.emit(commands.lobby.make, username, (data) => {
			this.gameData = data;
			this.token = data.token;
			this.setSocketId(data.socketId);
			cb(data);
		});
	}

	joinGame = (username, token, cb) => {
		this.token = token;
		this.socket.emit(commands.lobby.join, {
			username: username,
			token: token
		}, (data) => {
			this.gameData = data;
			this.token = data.token;
			this.setSocketId(data.socketId);
			cb(data);
		});
	}

	leaveGame = () => {
		this.socket.emit(commands.lobby.leave, this.token);
	}

	click = (sector, cell, cb) => {
		this.socket.emit(commands.game.click, {
			token: this.token,
			sector: sector,
			cell: cell
		}, (data) => {
			this.gameData = data;
			cb(data);
		});
	}
}
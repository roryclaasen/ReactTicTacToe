import io from 'socket.io-client';
import * as commands from './socket.commands';

import izitoast from 'izitoast';

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
			if (!data.error) {
				this.gameData = data;
				this.token = data.token;
				this.setSocketId(data.socketId);
			} else {
				izitoast.error({ message: 'Unable to create game, please try again' });
				(console.error || console.log).call(console, 'Unable to create game, please try again');
				// console.log(data.error.stack);
			}
			cb(data);
		});
	}

	joinGame = (username, token, cb) => {
		this.token = token;
		this.socket.emit(commands.lobby.join, {
			username: username,
			token: token
		}, (data) => {
			if (!data.error) {
				this.gameData = data;
				this.token = data.token;
				this.setSocketId(data.socketId);
			} else {
				if (data.error.type === 'msg') {
					izitoast.warning({
						title: 'Unable to join game',
						message: data.error.message
					});
					console.log('WARN: Unable to join game, please try again');
				} else {
					izitoast.error({ message: 'Unable to join game, please try again' });
					(console.error || console.log).call(console, 'Unable to join game, please try again');
					// console.log(data.error.stack);
				}
			}
			cb(data);
		});
	}

	leaveGame = () => {
		this.socket.emit(commands.lobby.leave, this.token);
		this.gameData = undefined;
	}

	click = (sector, cell, cb) => {
		this.socket.emit(commands.game.click, {
			token: this.token,
			sector: sector,
			cell: cell
		}, (data) => {
			if (!data.error) {
				this.gameData = data;
			} else {
				izitoast.error({ message: 'Unable to place tile' });
				(console.error || console.log).call(console, 'Unable to place tile');
				// console.log(data.error.stack);
			}
			cb(data);
		});
	}
}
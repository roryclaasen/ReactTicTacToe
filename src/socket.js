/* eslint no-console: 0 */

import io from 'socket.io-client';
import * as commands from './socket.commands';

import Handler from './onlineHandler';

export default class SocketClient {
	constructor() {
		this.socket = io();
		this.gameData = undefined;

		this.updateGameHandler = undefined;

		this.socket.on(commands.game.started, this.updateGame);
		this.socket.on(commands.game.update, this.updateGame);
		this.socket.on(commands.lobby.disconnected, this.updateGame);
	}

	socketId = () => this.socket.id;

	hasGame = (token) => new Promise((resolve) => {
		this.socket.emit(commands.lobby.exists, token, (game) => {
			if (game.error !== undefined) resolve(false);
			else resolve(game !== undefined);
		});
	});

	updateGame = (game) => {
		console.log(game);
		if (Handler.token !== game.token) return;
		this.gameData = game;
		if (this.updateGameHandler !== undefined) {
			this.updateGameHandler(this.gameData);
		}
	}

	createGame = (username) => new Promise((resolve, reject) => {
		this.socket.emit(commands.lobby.make, username, (data) => {
			if (!data.error) this.gameData = data;
			else {
				(console.error || console.log).call(console, 'Unable to create game, please try again');
				// console.log(data.error.stack);
				reject(data);
			}
			resolve(data);
		});
	});

	joinGame = (username, token) => new Promise((resolve, reject) => {
		this.socket.emit(commands.lobby.join, {
			username,
			token
		}, (data) => {
			if (!data.error) this.updateGame(data);
			else if (data.error.type === 'msg') {
				(console.warn || console.log).call(console, data.error.message);
				reject(data);
			} else {
				(console.error || console.log).call(console, 'Unable to join game, please try again');
				// console.log(data.error.stack);
				reject(data);
			}
			resolve(data);
		});
	});

	leaveGame = (token) => {
		this.socket.emit(commands.lobby.leave, token);
		this.gameData = undefined;
	}

	click = (sector, cell) => new Promise((resolve, reject) => {
		this.socket.emit(commands.game.click, {
			token: Handler.token,
			sector,
			cell
		}, (data) => {
			if (!data.error) this.gameData = data;
			else {
				(console.error || console.log).call(console, 'Unable to place tile');
				// console.log(data.error.stack);
				reject(data);
			}
			resolve(data);
		});
	});
}

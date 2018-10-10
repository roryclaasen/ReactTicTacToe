/* eslint no-console: 0 */

import io from 'socket.io-client';
import * as commands from './socket.commands';

export default class SocketClient {
	constructor() {
		this.socket = io();
		this.gameData = undefined;

		this.updateGameHandler = undefined;

		this.socket.on(commands.game.started, this.updateGame);
		this.socket.on(commands.game.update, this.updateGame);
		this.socket.on(commands.lobby.disconnected, this.updateGame);
	}

	socketId = () => {
		const match = document.cookie.match(new RegExp('(^| )io=([^;]+)'));
		if (match) return match[2];
		return undefined;
	}

	hasGame = (token, callback) => this.socket.emit(commands.lobby.exists, token, (game) => callback(game !== undefined));

	updateGame = (game) => {
		if (this.gameData.token !== game.token) return; // TODO Test if needed
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
				(console.warn || console.log).call(console, 'Unable to join game, please try again');
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
			token: this.token,
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

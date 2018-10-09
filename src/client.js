/* eslint no-console: 0 */

import izitoast from 'izitoast';
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

	hasGame = (token) => new Promise((resolve) => this.socket.emit(commands.lobby.exists, token, (game) => resolve(game !== undefined)));

	updateGame = (game) => {
		if (this.token !== game.token) return;
		this.gameData = game;
		if (this.updateGameHandler !== undefined) {
			this.updateGameHandler(this.gameData);
		}
	}

	createGame = (username, cb) => this.socket.emit(commands.lobby.make, username, (data) => {
		if (!data.error) {
			this.gameData = data;
			this.token = data.token;
		} else {
			izitoast.error({ message: 'Unable to create game, please try again' });
			(console.error || console.log).call(console, 'Unable to create game, please try again');
			// console.log(data.error.stack);
		}
		cb(data);
	});

	joinGame = (username, token, cb) => {
		this.token = token;
		this.socket.emit(commands.lobby.join, {
			username,
			token
		}, (data) => {
			if (!data.error) {
				this.updateGame(data);
			} else if (data.error.type === 'msg') {
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
			sector,
			cell
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

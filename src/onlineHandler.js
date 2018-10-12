import izitoast from 'izitoast';

import SocketClient from './socket';

class OnlineHandler {
	constructor() {
		this.token = undefined;
		this.username = undefined;
		this.playing = false;
		this.waiting = false;
		this.socket = new SocketClient();
	}

	hasGame = () => new Promise((resolve) => {
		if (!this.hasUsername() || !this.hasToken()) resolve(false);
		else this.socket.hasGame(this.token).then((exists) => resolve(exists)).catch(() => resolve(false));
	});

	changeToken = (token) => {
		this.token = token;
		if (token === undefined) {
			this.playing = false;
			this.waiting = false;
		}
	}

	changeUsername = (username) => {
		this.username = username;
	}

	hasUsername = () => {
		if (this.username === undefined) return false;
		return this.username.length > 3;
	}

	hasToken = () => {
		if (this.token === undefined) return false;
		return this.token.length === 6;
	}

	createGame = () => this.socket.createGame(this.username).then((data) => {
		this.token = data.token;
		this.playing = false;
		this.waiting = true;
		return data;
	}).catch((data) => {
		this.playing = false;
		this.waiting = false;

		izitoast.error({ message: 'Unable to create game, please try again' });
		throw data;
	});

	joinGame = () => this.socket.joinGame(this.username, this.token).then((data) => {
		if (this.token !== data.token) throw data;
		this.waiting = false;
		this.playing = true;
		return data;
	}).catch((data) => {
		this.waiting = false;
		this.playing = false;

		if (data.error.type === 'msg') {
			izitoast.warning({
				title: 'Unable to join game',
				message: data.error.message
			});
		} else izitoast.error({ message: 'Unable to join game, please try again' });
		throw data;
	});

	leaveGame = () => {
		this.socket.leaveGame(this.token);
		this.changeToken(undefined);
		this.playing = false;
		this.waiting = false;
	}

	click = (sector, cell) => this.socket.click(sector, cell).catch((data) => {
		izitoast.error({ message: 'Unable to place tile' });
		throw data;
	});
}

const Handler = new OnlineHandler();
export default Handler;

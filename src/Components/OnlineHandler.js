import SocketClient from '../client';

class OnlineHandler {
	constructor() {
		this.token = undefined;
		this.username = undefined;
		this.playing = false;
		this.socket = new SocketClient();
	}

	hasGame() {
		if (!this.hasUsername || !this.hasToken) return false;
		return this.socket.hasGame().then((exists) => exists);
	}

	changeToken(token) {
		if (!this.hasToken) {
			// TODO Disconect from old game
			this.playing = false;
		}
		this.token = token;
	}

	changeUsername(username) {
		this.username = username;
	}

	hasUsername = () => this.username !== undefined && this.username.length > 3;

	hasToken = () => this.token !== undefined && this.token.length === 6;
}

const Handler = new OnlineHandler();
export default Handler;

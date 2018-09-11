import io from 'socket.io-client';

export default class SocketClient {
	constructor() {
		this.socket = io();
	}

	temp() {
		// TEMP CALL
	}
}
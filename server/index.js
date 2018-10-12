/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const manager = require('./manager');
const commands = require('../src/socket.commands');

const port = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, 'node_modules', 'push.js', 'bin')));

app.get([
	'/',
	'/about',
	'/play',
	/\/play\/\d{6}/,
	'/connect',
	'/connect/username',
	'/connect/token'
], (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.get('/license', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'LICENSE.md'));
});


io.on('connection', (socket) => {
	let token;

	console.log('User Connected (%s)', socket.id);

	socket.on('disconnect', () => {
		try {
			console.log('User Disconnected (%s)', socket.id);
			if (token !== undefined) {
				manager.getGame(token).removePlayer(socket.id);
				io.in(token).emit(commands.lobby.disconnected, manager.getGame(token).export());

				if (manager.getGame(token).players.length === 0) {
					console.log('Removing game %s', token);
					manager.removeGame(token);
				}
			}
		} catch (e) {
			console.log('Error in \'%s\'', 'disconnect');
			(console.error || console.log).call(console, e.stack || e);
		}
	});

	socket.on(commands.lobby.exists, (tok, fn) => {
		try {
			fn(manager.getGame(tok).export());
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.exists);
			(console.error || console.log).call(console, e.stack || e);

			fn({
				error: {
					type: 'stack',
					stack: e
				}
			});
		}
	});

	socket.on(commands.lobby.make, (username, fn) => {
		try {
			const oldGame = manager.isInGame(socket.id);
			if (oldGame !== undefined) {
				manager.removeGame(oldGame.token);
				console.log('Removing game %s', oldGame.token);
			}
			manager.make(socket.id, (game) => {
				game.addPlayer(username, socket.id);
				socket.join(game.token);

				token = game.token; // eslint-disable-line prefer-destructuring

				fn(game.export());

				console.log('%s has made a new game %s', socket.id, token);
			});
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.make);
			(console.error || console.log).call(console, e.stack || e);

			fn({
				error: {
					type: 'stack',
					stack: e
				}
			});
		}
	});

	socket.on(commands.lobby.join, (data, fn) => {
		try {
			const { username } = data;
			const ftoken = data.token;
			if (manager.hasGame(ftoken)) {
				manager.joinGame(ftoken, username, socket.id, (game, isPlayer) => {
					token = ftoken;
					socket.join(token);

					fn(game.export());

					if (isPlayer) {
						io.in(token).emit(commands.game.started, game.export());
						console.log('%s has joined game %s as a player', socket.id, token);
					} else {
						console.log('%s has joined game %s as a spectator', socket.id, token);
						// socket.emit(commands.game.started, game);
					}
				});
			} else {
				fn({
					error: {
						type: 'msg',
						message: `No game exists with token ${ftoken}`,
						token: ftoken
					}
				});
			}
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.join);
			(console.error || console.log).call(console, e.stack || e);

			fn({
				error: {
					type: 'stack',
					stack: e
				}
			});
		}
	});

	socket.on(commands.lobby.leave, (dToken) => {
		try {
			if (token !== dToken) return;

			manager.getGame(token).removePlayer(socket.id);
			socket.to(token).emit(commands.lobby.disconnected, manager.getGame(token).export());
			socket.leave(token);

			console.log('%s leaving game %s', socket.id, token);

			if (manager.getGame(token).players.length === 0) {
				console.log('Removing game %s', token);
				manager.removeGame(token);
			}

			token = undefined;
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.leave);
			(console.error || console.log).call(console, e.stack || e);
		}
	});

	socket.on(commands.game.click, (data, fn) => {
		try {
			if (token !== data.token) return;
			const game = manager.getGame(token);
			if (game !== undefined) {
				manager.getGame(token).click(data.sector, data.cell, socket.id);
				io.in(token).emit(commands.game.update, manager.getGame(token).export());
			} else throw new Error('Game doesn\'t exist');
		} catch (e) {
			console.log('Error in \'%s\'', commands.game.click);
			(console.error || console.log).call(console, e.stack || e);

			fn({
				error: {
					type: 'stack',
					stack: e
				}
			});
		}
	});
});

server.listen(port, () => {
	console.log('Serve listening on *:%d', port);
});

module.exports = app;

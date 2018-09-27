'use strict';

const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const manager = require('./game');
const commands = require('../src/socket.commands');

const port = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);
var io = socket(server);

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

io.on('connection', function (socket) {
	var token;

	console.log('User Connected (%s)', socket.id);

	socket.on('disconnect', function () {
		try {
			console.log('User Disconnected');
			if (token !== undefined) {
				manager.getGame(token).removePlayer(socket.id);
				io.in(token).emit(commands.lobby.disconnected, manager.getGame(token));

				if (manager.getGame(token).players.length === 0) {
					console.log('removing game %s', token);
					manager.removeGame(token);
				}
			}
		} catch (e) {
			console.log('Error in \'%s\'', 'disconnect');
			(console.error || console.log).call(console, e.stack || e);
		}
	});

	socket.on(commands.lobby.make, function (username, fn) {
		try {
			manager.make(socket.token, (game) => {
				game.addPlayer(username, socket.id);
				socket.join(game.token);

				token = game.token;
				var gameReturn = game.forClient();
				gameReturn.socketId = socket.id;

				fn(gameReturn);

				console.log('%s has made a new game %s', socket.id, token);
			});
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.make);
			(console.error || console.log).call(console, e.stack || e);

			fn({ error: {
				type: 'stack',
				stack: e
			}});
		}
	});

	socket.on(commands.lobby.join, function (data, fn) {
		try {
			var username = data.username;
			var ftoken = data.token;
			if (manager.hasGame(ftoken)) {
				token = ftoken;
				manager.joinGame(token, username, socket.id, (game, isPlayer) => {
					socket.join(token);

					var gameReturn = game.forClient();
					gameReturn.socketId = socket.id;

					fn(gameReturn);

					if (isPlayer) {
						io.in(token).emit(commands.game.started, game);
						console.log('%s has joined game %s as a player', socket.id, token);
					} else {
						console.log('%s has joined game %s as a spectator', socket.id, token);
						// socket.emit(commands.game.started, game);
					}
				});
			} else {
				// TODO error
				fn({ error: {
					type: 'msg',
					message: 'No game exists with token ' + ftoken,
					token: ftoken
				}});
			}
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.join);
			(console.error || console.log).call(console, e.stack || e);

			fn({ error: {
				type: 'stack',
				stack: e
			}});
		}
	});

	socket.on(commands.lobby.leave, function (dToken) {
		try {
			if (token !== dToken) return;

			manager.getGame(token).removePlayer(socket.id);
			socket.to(token).emit(commands.lobby.disconnected, manager.getGame(token).forClient());
			socket.leave(token);

			console.log('%s leaving game %s', socket.id, token);

			if (manager.getGame(token).players.length === 0) {
				console.log('removing game %s', token);
				manager.removeGame(token);
			}

			token = undefined;
		} catch (e) {
			console.log('Error in \'%s\'', commands.lobby.leave);
			(console.error || console.log).call(console, e.stack || e);
		}
	});

	socket.on(commands.game.click, function (data) {
		try {
			if (token !== data.token) return;

			manager.getGame(token).click(data.sector, data.cell, socket.id);
			io.in(token).emit(commands.game.update, manager.getGame(token).forClient());
		} catch (e) {
			console.log('Error in \'%s\'', commands.game.click);
			(console.error || console.log).call(console, e.stack || e);

			fn({ error: {
				type: 'stack',
				stack: e
			}});
		}
	});
});

server.listen(port, function () {
	console.log('Serve listening on *:%d', port);
});

module.exports = app;
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
		console.log('User Disconnected');
		if (token !== undefined) {
			manager.getGame(token).removePlayer(socket.id);
			io.in(token).emit(commands.lobby.disconnected, manager.getGame(token));
		}
	});
	
	socket.on(commands.lobby.make, function (username, fn) {
		manager.make((game) => {
			game.addPlayer(username, socket.id);
			socket.join(game.token);
			token = game.token;
			fn(game.forClient());
			console.log('%s has made a new game %s', socket.id, token);
		});
	});

	socket.on(commands.lobby.join, function (data, fn) {
		var username = data.username;
		var ftoken = data.token;
		if (manager.hasGame(ftoken)) {
			token = ftoken;
			manager.joinGame(token, username, socket.id, (game) => {
				socket.join(token);
				if (game.players.length == 2) {
					io.in(token).emit(commands.game.started, game);
					console.log('%s has joined game %s as a player', socket.id, token);
				} else {
					console.log('%s has joined game %s as a spectator', socket.id, token);
					// TODO Spectator
				}
			});
		} else {
			// TODO error
		}
	});

	socket.on(commands.lobby.leave, function (dToken) {
		if (token !== dToken) return;
		manager.getGame(token).removePlayer(socket.id);
		socket.to(token).emit(commands.lobby.disconnected, manager.getGame(token));
		socket.leave(token);
		console.log('%s leaving game %s', socket.id, token);
		if (manager.getGame(token).players.length === 0) {
			console.log('removing game %s', token);
			manager.removeGame(token);
		}

		token = undefined;
	});
});

server.listen(port, function () {
	console.log('Serve listening on *:%d', port);
});

module.exports = app;
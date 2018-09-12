'use strict';

const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

var port = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);
var io = socket(server);

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

io.on('connection', function (socket) {
	console.log('a user connected');
});

server.listen(port, function () {
	console.log('listening on *:%d', port);
});

module.exports = app;
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Push from 'push.js';
import { Redirect } from 'react-router-dom';

import Handler from '../../onlineHandler';
import Board from './Board';

export default class OnlineBoard extends Board {
	constructor(props) {
		super(props);
		Handler.changeToken(props.match.params.token);
		Handler.socket.updateGameHandler = this.updateData.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		if (Handler.hasUsername() && Handler.hasToken() && !Handler.waiting) { // && Handler.playing
			Handler.joinGame().then((game) => {
				Handler.socket.updateGameHandler = this.updateData.bind(this);
				// this.forceStateUpdate();
				this.updateData(game);
			}).catch(() => {
				// TODO Unable to join game
			});
		}
	}

	render() {
		if (!Handler.hasUsername() || !Handler.hasToken()) {
			return <Redirect to="/connect" />;
		}
		if (Handler.waiting) {
			return (
				<React.Fragment>
					<span>TODO: Write waiting page</span>
				</React.Fragment>
			);
		}
		return super.render();
	}

	updateData = (game) => {
		if (game.players.length === 2) Handler.waiting = false;
		if (game.players.length !== 2 && !Handler.waiting) {
			this.setState({
				dialog: {
					open: true,
					title: 'Game Over',
					message: 'Your opponent left the game :(',
					agree: 'Okay',
					action: () => Handler.leaveGame()
				}
			});
			return;
		}
		const old = this.state.current;
		if (old !== game.current) {
			const playerId = game.players.findIndex((p) => p.id === Handler.socket.socketId());
			const isMe = playerId === game.current;
			const opponent = game.players[playerId === 0 ? 1 : 0].username;
			if (isMe) {
				let promise;
				if (this.state.win !== -1) {
					promise = Push.create(`${isMe ? `${opponent} has` : 'You have'} won the game!`, {
						icon: '/favicon.ico',
						timeout: 2000,
						link: '?'
					});
				} else {
					promise = Push.create('It\'s your turn!', {
						body: `${opponent} has made their move`,
						icon: '/favicon.ico',
						timeout: 2000,
						link: '?'
					});
				}

				promise.then((notification) => {
					window.focus();
					notification.close();
				});
			}
		}
		this.setState({
			sectors: game.sectors,
			sectorFinal: game.sectorFinal,
			win: game.win,
			current: game.current,
			currentSector: game.currentSector,
			players: game.players
		});
	}

	toolBar() {
		this.funcName = 'toolBar';
		return (
			<React.Fragment>
				<Button
					color="secondary"
					onClick={() => this.setState({
						dialog: {
							open: true,
							title: 'Are you sure you want to leave?',
							message: 'You are currently in a game',
							agree: 'Yes',
							disagree: 'No, continue playing',
							action: () => Handler.leaveGame()
						}
					})}
				>
					Leave Game
				</Button>
			</React.Fragment>
		);
	}

	gameMessage() {
		if (this.state.players === undefined) return super.gameMessage();
		const playerId = this.state.players.findIndex((p) => p.id === Handler.socket.socketId());

		const isMe = playerId === this.state.current;
		const name = this.state.players[this.state.current].username;
		let message = `Its ${isMe ? 'your' : `${name}'s`} turn`;

		let youAre = 'You are ';
		if (playerId === 0) youAre += 'red';
		else if (playerId === 1) youAre += 'blue';
		else youAre += 'spectating';

		if (this.state.win !== -1) message = `${isMe ? `${name} has` : 'You have'} won the game!`;
		return (
			<div className="game-message">
				<Typography variant="subheading" className="youAre">
					{youAre}
				</Typography>
				<Typography variant="display1" component="h1" color="inherit">
					{message}
				</Typography>
			</div>
		);
	}

	clickHandler(e) {
		const location = e.target.dataset.location.split(',');
		const sectorId = Number(location[0]);
		const cellId = Number(location[1]);
		Handler.socket.click(sectorId, cellId).then((data) => this.updateData(data));
	}
}

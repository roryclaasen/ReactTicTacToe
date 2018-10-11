import React from 'react';

import { Redirect } from 'react-router-dom';

import Push from 'push.js';
import copy from 'copy-to-clipboard';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';

import DialogMessage from '../DialogMessage';
import Handler from '../../onlineHandler';
import Board from './Board';

export default class OnlineBoard extends Board {
	constructor(props) {
		super(props);

		Handler.changeToken(props.match.params.token);
		Handler.socket.updateGameHandler = this.updateData.bind(this);

		Push.Permission.request(() => { /* onGranted */ }, () => { /* onDenied */ });

		this.clickHandler = this.clickHandler.bind(this);

		if (Handler.hasUsername() && Handler.hasToken() && !Handler.waiting) { // && Handler.playing
			Handler.joinGame().then((game) => {
				Handler.socket.updateGameHandler = this.updateData.bind(this);
				// this.forceStateUpdate();
				this.updateData(game);
			});
		}
	}

	render() {
		if (!Handler.hasUsername() || !Handler.hasToken()) {
			return <Redirect to="/connect" />;
		}
		if (Handler.waiting) {
			const { dialog, update } = this.state;
			return (
				<React.Fragment>
					<Card>
						<CardContent style={{ textAlign: 'center' }}>
							<Typography gutterBottom variant="display1" component="h1" color="inherit">
								{Handler.username}
							</Typography>
							<Grid container justify="center">
								<Grid item>
									<Typography gutterBottom variant="subheading">
										Waiting for opponent to join
									</Typography>
									<Typography gutterBottom variant="subheading">
										Share the game token bellow with you opponent so they can join
									</Typography>
									<Typography gutterBottom variant="display1">
										{Handler.token}
									</Typography>
									<Typography gutterBottom variant="subheading">
										Or share the url bellow with you opponent so they can join
									</Typography>
									<Tooltip title="Copy To Clipboard">
										<Button
											variant="outlined"
											size="large"
											color="primary"
											onClick={() => copy(window.location.href)}
										>
											{window.location.href}
										</Button>
									</Tooltip>
								</Grid>
							</Grid>
						</CardContent>
						<LinearProgress variant="query" color="secondary" style={{ height: '0.5em', minHeight: '5px' }} />
						<CardActions>
							<Button
								color="primary"
								onClick={() => {
									this.setState({
										update: update + 1,
										dialog: {
											open: true,
											title: 'Leave lobby',
											message: 'Are you sure you want to leave the lobby',
											agree: 'Yes',
											disagree: 'No',
											action: () => {
												Handler.leaveGame();
												this.forceStateUpdate();
											}
										}
									});
								}}
							>
								Leave Lobby
							</Button>
						</CardActions>
					</Card>
					<DialogMessage all={dialog} key={update} />
				</React.Fragment>
			);
		}
		return super.render();
	}

	updateData = (game) => {
		if (game.players.length === 2) Handler.waiting = false;
		else if (!Handler.waiting) {
			const { update } = this.state;
			this.setState({
				update: update + 1,
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
					variant="outlined"
					onClick={() => {
						const { update } = this.state;
						this.setState({
							update: update + 1,
							dialog: {
								open: true,
								title: 'Are you sure you want to leave?',
								message: 'You are currently in a game',
								agree: 'Yes',
								disagree: 'No, continue playing',
								action: () => {
									Handler.leaveGame();
									this.forceStateUpdate();
								}
							}
						});
					}}
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

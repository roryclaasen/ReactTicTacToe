import React, { Component } from 'react';

import ThemeManager from './Theme';
import Welcome from './Welcome';
import Connect from './Connect';
import Board from './Board';
import OnlineBoard from './OnlineBoard';

import SocketClient from './../client';

import copy from 'copy-to-clipboard';

import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// import CodeIcon from '@material-ui/icons/Code';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import '../Stylesheets/App.css';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.board = React.createRef();
		this.state = {
			boardKey: 1,
			playing: false,
			online: false,
			dialog: {
				open: false,
				title: '',
				message: '',
				agree: 'Yes',
				disagree: 'No'
			}
		};
		this.socket = new SocketClient();
		this.socket.updateGameHandler = this.onlineGameUpdate;
	}

	handleDialogClose = (agreed) => {
		if (agreed === true) this.state.dialog.action();
		this.setState({
			dialog: {
				open: false,
				title: this.state.dialog.title,
				message: this.state.dialog.message,
				agree: this.state.dialog.agree,
				disagree: this.state.dialog.disagree,
				action: undefined
			}
		});
	}

	offlineNewGame = () => {
		this.setState({
			dialog: {
				open: true,
				title: 'Are you sure you start a new game?',
				message: 'You will lose all progress',
				agree: 'Yes',
				disagree: 'No, continue playing',
				action: () => {
					this.setState({ boardKey: this.state.boardKey + 1 });
				}
			}
		});
	}

	offlineLeave = () => {
		this.setState({
			dialog: {
				open: true,
				title: 'Are you sure you want to leave?',
				message: 'You are currently in a game',
				agree: 'Yes',
				disagree: 'No, continue playing',
				action: () => {
					this.setState({ boardKey: this.state.boardKey + 1, playing: false });
				}
			}
		});
	}

	offlineJoin = () => {
		this.setState({ online: false, playing: true });
	}

	onlineSetup = () => {
		this.setState({ online: true, playing: false });
	}

	onlineMake = (username, cb) => {
		this.socket.createGame(username, cb);
		// Trigger render to show token
	}

	onlineJoin = (username, token, cb) => {
		this.socket.joinGame(username, token, cb);
	}

	onlineGameUpdate = (game) => {
		if (game.players.length === 2) {
			this.setState({ online: true, playing: true });
			this.board.current.updateData(game);
		} else {
			this.setState({
				dialog: {
					open: true,
					title: 'Game Over',
					message: 'Your opponent left the game :(',
					agree: 'Okay',
					action: () => {
						this.setState({ online: true, playing: false });
						this.socket.leaveGame();
						this.socket.gameData = undefined;
					}
				}
			});
		}
	}

	onlineLeave = () => {
		if (this.state.playing) {
			this.setState({
				dialog: {
					open: true,
					title: 'Are you sure you want to leave?',
					message: 'You are currently in a game',
					agree: 'Yes',
					disagree: 'No, continue playing',
					action: () => {
						this.socket.leaveGame();
						this.setState({ online: true, playing: false });
					}
				}
			});
		} else {
			this.setState({ online: false, playing: false });
		}
	}

	onlineCopyToken = () => copy(this.socket.token);

	render() {
		var currentApp;
		var buttonGroup = [];
		if (this.state.playing) {
			if (this.state.online === false) {
				currentApp = <Board
					ref={this.board}
					key={this.state.boardKey}
				/>;
				buttonGroup.push(
					<Button variant="extendedFab" color="primary" className="btn" aria-label="New Game" onClick={this.offlineNewGame} key="gamenew">
						<AddIcon />
						New Game
		  			</Button>
				);
				buttonGroup.push(
					<Button variant="extendedFab" color="secondary" className="btn" aria-label="Exit" onClick={this.offlineLeave} key="gameexit">
						<CloseIcon />
						Exit
		  			</Button>
				);
			} else {
				currentApp = <OnlineBoard
					ref={this.board}
					click={this.socket.click}
					id={this.socket.socketId}
				/>
				buttonGroup.push(
					<Tooltip title="Copy to clipboard" placement="top" key="gametoken">
						<Button variant="extendedFab" color="primary" className="btn" aria-label="Token" onClick={this.onlineCopyToken}>
							Token: {this.socket.token}
						</Button>
					</Tooltip>
				);
				buttonGroup.push(
					<Button variant="extendedFab" color="secondary" className="btn" aria-label="Exit" onClick={this.onlineLeave} key="gameexit">
						<CloseIcon />
						Leave
		  			</Button>
				);
			}
		} else {
			if (this.state.online) {
				currentApp = <Connect
					cancel={this.onlineLeave}
					make={this.onlineMake}
					join={this.onlineJoin}
				/>;
				if (this.socket.gameData !== undefined) {
					buttonGroup.push(
						<Tooltip title="Copy to clipboard" placement="top" key="gametoken">
							<Button variant="extendedFab" color="primary" className="btn" aria-label="Token" onClick={this.onlineCopyToken}>
								Token: {this.socket.gameData.token}
							</Button>
						</Tooltip>
					);
				}
			} else {
				currentApp = <Welcome
					playOffline={this.offlineJoin}
					playOnline={this.onlineSetup}
				/>;
				// buttonGroup.push(
				// 	<Button variant="fab" color="primary" className="btn" aria-label="Code" href="https://github.com/roryclaasen/ReactTicTacToe" key="source">
				// 		<CodeIcon />
				// 	</Button>
				// );
			}
		}
		return (
			<ThemeManager>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					className="AppContainer"
				>
					<Grid item className="AppItem" xs={10} md={8}>
						{currentApp}
					</Grid>
				</Grid>
				<div className="floatingButtons">
					{buttonGroup}
				</div>
				<Dialog
					open={this.state.dialog.open}
					onClose={this.handleDialogClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{this.state.dialog.title}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{this.state.dialog.message}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						{this.state.dialog.disagree !== undefined &&
							<Button onClick={this.handleDialogClose} color="primary">
								{this.state.dialog.disagree}
							</Button>
						}
						<Button onClick={(e) => this.handleDialogClose(true)} color="primary" autoFocus>
							{this.state.dialog.agree}
						</Button>
					</DialogActions>
				</Dialog>
			</ThemeManager>
		);
	}
}

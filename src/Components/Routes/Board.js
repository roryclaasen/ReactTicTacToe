import React, { Component } from 'react';
// import update from 'immutability-helper';

import { Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as global from '../../globals';

import DialogMessage from '../DialogMessage';
import BoardSector from '../Board/BoardSector';

export default class Board extends Component {
	constructor(props) {
		super(props);
		const sectorList = [];
		for (let i = 0; i < global.NO_SECTORS; i += 1) {
			sectorList[i] = {
				cells: new Array(global.NO_CELLS).fill(-1),
				win: -1
			};
		}
		this.state = {
			update: 0,
			sectors: sectorList,
			sectorFinal: new Array(global.NO_CELLS).fill(-1),
			win: -1,
			current: 0,
			currentSector: -1,
			dialog: {
				open: false,
				title: '',
				message: '',
				agree: 'Yes',
				disagree: 'No'
			},
			toolbarAction: undefined,
			showHelp: false
		};

		this.baseState = this.state;

		this.clickHandler = this.clickHandler.bind(this);
	}

	clickHandler(e) {
		const { win, sectors, sectorFinal, current } = this.state;
		let { currentSector } = this.state;
		if (win !== -1) return;

		const location = e.target.dataset.location.split(',');
		const sectorId = Number(location[0]);
		const cellId = Number(location[1]);

		if (currentSector !== -1 && currentSector !== sectorId) return;
		if (sectors[sectorId].cells[cellId] !== -1) return;
		sectors[sectorId].cells[cellId] = current;

		const sectorWinner = global.CalculateWinner(sectors[sectorId].cells);
		if (sectorWinner !== null) {
			sectors[sectorId].win = sectorWinner;
			sectorFinal[sectorId] = sectorWinner;
		}

		let gameWinner = global.CalculateWinner(sectorFinal);
		if (gameWinner !== null) {
			// console.log(gameWinner, 'has won the game!');
		} else gameWinner = -1;

		currentSector = cellId;

		let full = true;
		for (let i = 0; i < global.NO_CELLS; i += 1) {
			if (sectors[currentSector].cells[i] === -1) {
				full = false;
				break;
			}
		}
		if (full || gameWinner !== -1) currentSector = -1;

		this.setState({
			sectors,
			sectorFinal,
			current: current === 0 ? 1 : 0,
			currentSector,
			win: gameWinner
		});
	}

	gameMessage() {
		const { current, win } = this.state;
		const name = current === 0 ? 'red' : 'blue';
		let message = `It's ${name}'s turn`;
		if (win !== -1) {
			message = `${name} has won the game!`;
		}
		return (
			<Typography variant="display1" component="h1" color="inherit" className="game-message">
				{message}
			</Typography>
		);
	}

	toolBar() {
		return (
			<React.Fragment>
				<Button
					style={{ textDecoration: 'none', marginRight: '1em' }}
					color="primary"
					variant="outlined"
					onClick={() => this.setState({ showHelp: true })
					}
				>
					Rules Of Play
				</Button>
				<Button
					style={{ textDecoration: 'none', marginRight: '1em' }}
					color="secondary"
					variant="outlined"
					onClick={() => {
						const { update } = this.state;
						this.setState({
							update: update + 1,
							dialog: {
								open: true,
								title: 'Are you sure you start a new game?',
								message: 'You will lose all progress',
								agree: 'Yes',
								disagree: 'No, continue playing',
								action: () => {
									const sectorList = [];
									for (let i = 0; i < global.NO_SECTORS; i += 1) {
										sectorList[i] = {
											cells: new Array(global.NO_CELLS).fill(-1),
											win: -1
										};
									}
									this.setState({
										sectors: sectorList,
										sectorFinal: new Array(global.NO_CELLS).fill(-1),
										win: -1,
										current: 0,
										currentSector: -1
									});
								}
							}
						});
					}}
				>
					New Game
				</Button>
				<Button
					color="primary"
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
									this.setState({
										toolbarAction: {
											action: 'redirect',
											to: '/'
										}
									});
								}
							}
						});
					}}
				>
					Main Menu
				</Button>
			</React.Fragment>
		);
	}

	forceStateUpdate() {
		const { update } = this.state;
		this.setState({ update: update + 1 });
	}

	render() {
		const { sectors, currentSector, win, current, sectorFinal, toolbarAction, update, dialog, showHelp } = this.state;
		if (toolbarAction !== undefined) {
			if (toolbarAction.action === 'redirect') return <Redirect to={toolbarAction.to} />;
		}
		const sectorsList = [];
		for (let i = 0; i < global.NO_SECTORS; i += 1) {
			const key = `s${i}`;

			sectorsList.push(
				<BoardSector
					cells={sectors[i].cells}
					sector={i}
					key={key}
					click={this.clickHandler}
					currentSector={currentSector}
				/>
			);
		}
		const rowsList = [];
		for (let r = 0; r < global.NO_SECTORS; r += global.NO_IN_ROW) {
			rowsList.push(
				<div className="game-table-row" key={r}>
					{sectorsList[r + 0]}
					{sectorsList[r + 1]}
					{sectorsList[r + 2]}
				</div>
			);
		}

		let tableClass = `game-table player${current + 1}`;
		if (win !== -1) tableClass = 'game-table finished';
		const message = this.gameMessage();
		const toolbar = this.toolBar();
		return (
			<React.Fragment>
				<Card className="game-container">
					<CardContent>
						{message}
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item className={tableClass}>
								{rowsList}
							</Grid>
							<Grid item className="game-table final">
								<BoardSector
									cells={sectorFinal}
									className="final"
									sector={-1}
								/>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
				<Card className="game-toolbar">
					<CardContent style={{ paddingBottom: '16px' }}>
						{toolbar}
					</CardContent>
				</Card>
				<DialogMessage all={dialog} key={update} />
				<Dialog
					open={showHelp}
					onClose={() => this.setState({ showHelp: false })}
					scroll="paper"
				>
					<DialogTitle>Rules of Play</DialogTitle>
					<DialogContent>
						<DialogContentText component="ol">
							<li>The first player may place an &quot;X&quot; in any cell within any mini-square on the board.</li>
							<li>The selected cell position within this mini-square corresponds to the mini-square position within the greater-square where the second player must then place an &quot;O&quot;.</li>
							<li>Thereafter, the two players take turns placing their mark in any unfilled cell within the mini-square dictated by the cell position marked by the previous player. For the first player, this mini-square will be outlined in red.</li>
							<li>The first tic-tac-toe winner in a mini-square remains the winner in that mini-square for the remainder of the game.</li>
							<li>If a player is sent to a mini-square in which all the cells are filled, the player may next place his mark in any unfilled cell in any other mini-board.</li>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.setState({ showHelp: false })} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		);
	}
}

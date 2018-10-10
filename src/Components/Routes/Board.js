import React, { Component } from 'react';
// import update from 'immutability-helper';

import '../../Stylesheets/Board.css';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

import * as global from '../../globals';

import BoardSector from '../BoardSector';

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
			currentSector: -1
		};

		this.baseState = this.state;

		this.clickHandler = this.clickHandler.bind(this);
	}

	forceStateUpdate() {
		const { update } = this.state;
		this.setState({ update: update + 1 });
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
					style={{ textDecoration: 'none', paddingRight: '1em' }}
					color="secondary"
					onClick={() => {
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
					}}
				>
					New Game
				</Button>
				<Link to="/" style={{ textDecoration: 'none' }}>
					<Button color="primary">
						Main Menu
					</Button>
				</Link>
			</React.Fragment>
		);
	}

	render() {
		const { sectors, currentSector, win, current, sectorFinal } = this.state;
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
			</React.Fragment>
		);
	}
}

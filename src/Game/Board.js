import React, { Component } from 'react';
//import update from 'immutability-helper';
import './Board.css'

const NO_SECTORS = 9;
const NO_CELLS = 9;
const NO_IN_ROW = 3;

export default class Board extends Component {

	constructor(props) {
		super(props);
		this.state = this.emptyState();
		this.clickHandler = this.clickHandler.bind(this);
	}

	emptyState() {
		var sectorList = [];
		for (var i = 0; i < NO_SECTORS; i++) {
			sectorList[i] = {
				cells: new Array(NO_CELLS).fill(-1),
				win: -1
			}
		}

		return {
			sectors: sectorList,
			sectorFinal: new Array(NO_CELLS).fill(-1),
			win: -1,
			current: 0,
			currentSector: -1
		}
	}

	clickHandler(e) {
		var location = e.target.dataset.location.split(',');
		var sectorId = location[0];
		var cellId = location[1];
		var currentSector = this.state.currentSector;

		var sectors = this.state.sectors;
		var sectorFinal = this.state.sectorFinal;

		if (currentSector != -1 && currentSector != sectorId) return;
		if (sectors[sectorId].cells[cellId] !== -1) return;
		sectors[sectorId].cells[cellId] = this.state.current;

		var sectorWinner = this.calculateWinner(sectors[sectorId].cells);
		if (sectorWinner !== null) {
			sectors[sectorId].win = sectorWinner;
			sectorFinal[sectorId] = sectorWinner;
		}

		var gameWinner = this.calculateWinner(sectorFinal);
		if (gameWinner !== null) {
			console.log(gameWinner, 'has won the game!')
			// TODO Player has won the game
		}

		currentSector = cellId;

		var full = true;
		for (var i = 0; i < NO_CELLS; i++) {
			if (sectors[currentSector].cells[i] === -1) {
				full = false;
				break;
			}
		}
		if (full) currentSector = - 1;

		this.setState({
			sectors: sectors,
			sectorFinal: sectorFinal,
			current: this.state.current === 0 ? 1 : 0,
			currentSector: currentSector
		});
	}

	render() {
		var sectors = [];
		for (var i = 0; i < NO_SECTORS; i++) {
			var key = 's' + i;
			sectors.push(<BoardSector
				cells={this.state.sectors[i].cells}
				sector={i}
				key={key}
				click={this.clickHandler}
				currentSector={this.state.currentSector}
			/>);
		}
		var rows = [];
		for (var r = 0; r < NO_SECTORS; r += NO_IN_ROW) {
			rows.push(<div className="game-table-row" key={r}>
				{sectors[r + 0]}
				{sectors[r + 1]}
				{sectors[r + 2]}
			</div>)
		}
		var message = 'Its ' + (this.state.current == 0 ? 'red' : 'blue') + '\'s turn';
		if (this.state.win !== -1) {
			message = (this.state.win == 0 ? 'red' : 'blue') + ' has won the game!';
		}
		// TODO Disable clicking if game has won
		return (
			<div className="game-container">
				<h1 className="game-message">{message}</h1>
				<div className="center">
					<div className="game-table">
						{rows}
					</div>
					<div className="game-table final">
						<BoardSector
							cells={this.state.sectorFinal}
							class="final"
						/>
					</div>
				</div>
			</div>
		);
	}

	calculateWinner(cells) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (cells[a] !== -1 && cells[a] === cells[b] && cells[a] === cells[c]) {
				return cells[a];
			}
		}
		return null;
	}
}

class BoardSector extends Component {

	render() {
		var cells = [];
		for (var i = 0; i < NO_CELLS; i++) {
			var key = this.props.sector + ',' + i;
			var value = this.props.cells[i];
			cells.push(<BoardCell
				value={value}
				location={key}
				key={key}
				onClick={this.props.click}
			/>);
		}
		var rows = [];
		for (var r = 0; r < NO_CELLS; r += NO_IN_ROW) {
			rows.push(<div className="game-sector-row" key={r}>
				{cells[r + 0]}
				{cells[r + 1]}
				{cells[r + 2]}
			</div>)
		}
		var cssClass = 'game-sector';
		if (this.props.class === "final") cssClass += ' final';
		if (this.props.currentSector != -1 && this.props.currentSector != this.props.sector) cssClass += ' disabled';
		return (
			<div className={cssClass}>
				{rows}
			</div>
		);
	}
}

class BoardCell extends Component {
	render() {
		var value = this.props.value;
		var cssClass = 'game-cell ' + (value === -1 ? 'selectable' : (value === 0 ? 'player1' : 'player2'));
		return (
			<div className={cssClass} data-location={this.props.location} onClick={this.props.onClick}></div>
		);
	}
}
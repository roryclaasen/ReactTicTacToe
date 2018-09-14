import React, { Component } from 'react';

import Board from './Board';

export default class OnlinceBoard extends Board {

	constructor(props) {
		super(props);

		this.clickHandler = this.clickHandler.bind(this);
	}

	updateData(game) {
		this.setState({
			sectors: game.sectors,
			sectorFinal: game.sectorFinal,
			win: game.win,
			current: game.current,
			currentSector: game.currentSector,
			players: game.players
		});
	}

	clickHandler(e) {
		if (this.state.win !== -1) return;

		var location = e.target.dataset.location.split(',');
		var sectorId = Number(location[0]);
		var cellId = Number(location[1]);
		var currentSector = this.state.currentSector;

		var sectors = this.state.sectors;

		if (currentSector !== -1 && currentSector !== sectorId) return;
		if (sectors[sectorId].cells[cellId] !== -1) return;

		this.props.click(sectorId, cellId, this.updateData);
	}
}
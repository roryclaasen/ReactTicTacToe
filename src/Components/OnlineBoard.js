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
		var location = e.target.dataset.location.split(',');
		var sectorId = Number(location[0]);
		var cellId = Number(location[1]);
		this.props.click(sectorId, cellId, this.updateData);
	}
}
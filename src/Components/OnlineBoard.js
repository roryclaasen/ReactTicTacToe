import React, { Component } from 'react';

import Board from './Board';

export default class OnlinceBoard extends Board {

	constructor(props) {
		super(props);

		this.clickHandler = this.clickHandler.bind(this);
	}

	updateData(game) {
		console.log(game);
		this.setState({
			sectors: game.sectors,
			sectorFinal: game.final,
			win: game.win,
			current: game.current,
			currentSector: game.currentSector,
			players: game.players
		});
	}

	clickHandler(e) {
		console.log(e);
	}
}
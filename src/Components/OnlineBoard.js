import React, { Component } from 'react';

import Board from './Board';

export default class OnlinceBoard extends Board {

	constructor(props) {
		super(props);

		this.clickHandler = this.clickHandler.bind(this);
	}

	clickHandler(e) {

	}
}
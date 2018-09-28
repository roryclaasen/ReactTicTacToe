import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { NO_CELLS, NO_IN_ROW } from '../globals';

import BoardCell from './BoardCell';

export default class BoardSector extends Component {
	render() {
		const { currentSector, sector, cells, className, click } = this.props;
		const validSector = currentSector === -1 || currentSector === sector;
		const cellsList = [];
		for (let i = 0; i < NO_CELLS; i += 1) {
			const key = `${sector},${i}`;
			const value = cells[i];
			cellsList.push(
				<BoardCell
					value={value}
					valid={validSector && !(className === 'final')}
					location={key}
					key={key}
					onClick={click}
				/>
			);
		}
		const rowsList = [];
		for (let r = 0; r < NO_CELLS; r += NO_IN_ROW) {
			rowsList.push(
				<div className="game-sector-row" key={r}>
					{cellsList[r + 0]}
					{cellsList[r + 1]}
					{cellsList[r + 2]}
				</div>
			);
		}
		let cssClass = 'game-sector';
		if (className === 'final') cssClass += ' final';
		if (!validSector) cssClass += ' disabled';
		return (
			<div className={cssClass}>
				{rowsList}
			</div>
		);
	}
}

BoardSector.propTypes = {
	cells: PropTypes.array,
	sector: PropTypes.number,
	click: PropTypes.func,
	currentSector: PropTypes.number,
	className: PropTypes.string
};

BoardSector.defaultProps = {
	cells: [],
	sector: -1,
	click: undefined,
	currentSector: -1,
	className: ''
};

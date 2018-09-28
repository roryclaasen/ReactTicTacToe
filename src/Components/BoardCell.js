import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BoardCell extends Component {
	render() {
		const { value, valid, location, onClick } = this.props;
		let cssClass = 'game-cell';
		if (value === -1) cssClass += valid ? 'selectable' : '';
		else cssClass += (value === 0 ? 'player1' : 'player2');
		return (
			<div
				className={cssClass}
				data-location={location}
				onClick={onClick}
			/>
		);
	}
}

BoardCell.propTypes = {
	value: PropTypes.number,
	valid: PropTypes.bool,
	location: PropTypes.string,
	onClick: PropTypes.func
};

BoardCell.defaultProps = {
	value: -1,
	valid: true,
	location: '',
	onClick: undefined
};

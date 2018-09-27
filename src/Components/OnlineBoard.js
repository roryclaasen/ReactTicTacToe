import Board from './Board';
import React from 'react';
import Typography from '@material-ui/core/Typography';

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

	gameMessage() {
		if (this.state.players === undefined) return super.gameMessage();
		var playerId = this.state.players.findIndex(p => p.id === this.props.id);

		var isMe = playerId === this.state.current;
		var name = this.state.players[this.state.current].username;
		var message = 'Its ' + (isMe ? 'your' : name + '\'s') + ' turn';

		var youAre = 'You are ';
		if (playerId === 0) youAre += 'red';
		else if (playerId === 1) youAre += 'blue';
		else youAre += 'spectating';

		if (this.state.win !== -1) message = (isMe ? 'You have' : name + ' has') + ' won the game!';
		return (
			<div className="game-message">
				<Typography variant="subheading" className="youAre">
					{youAre}
				</Typography>
				<Typography variant="display1" component="h1" color="inherit">
					{message}
				</Typography>
			</div>
		);
	}

	clickHandler(e) {
		var location = e.target.dataset.location.split(',');
		var sectorId = Number(location[0]);
		var cellId = Number(location[1]);
		this.props.click(sectorId, cellId, this.updateData);
	}
}
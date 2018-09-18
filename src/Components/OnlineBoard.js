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

	gameMessage() {
		if (this.state.players === undefined) return super.gameMessage();
		var playerId = this.state.players.findIndex(p => p.id === this.props.id);
		console.log(playerId, this.state.current, this.state.playerId === this.state.current);
		var isMe = playerId === this.state.current;
		var name = this.state.players[this.state.current].username;
		var message = 'Its ' + (isMe ? 'your' : name + '\'s') + ' turn';
		if (this.state.win !== -1) message = (isMe ? 'You have'  : name + ' has') + ' won the game!';
		return message;
	}

	clickHandler(e) {
		var location = e.target.dataset.location.split(',');
		var sectorId = Number(location[0]);
		var cellId = Number(location[1]);
		this.props.click(sectorId, cellId, this.updateData);
	}
}
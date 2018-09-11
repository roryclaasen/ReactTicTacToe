import React, { Component } from 'react';

import Welcome from './Welcome';
import Board from './Board';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close'

import '../Stylesheets/App.css';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.board = React.createRef();
		this.state = {
			boardKey: 1,
			playing: false,
			online: false
		};
	}

	offlineNewGame = () => {
		this.setState({ boardKey: this.state.boardKey + 1 });
	}

	offlineLeave = () => {
		this.setState({ boardKey: this.state.boardKey + 1, playing: false });
	}

	offlineJoin = () => {
		this.setState({ online:false, playing: true });
	}


	render() {
		var currentApp;
		var buttonGroup = [];
		if (this.state.playing) {
			currentApp = <Board ref={this.board} key={this.state.boardKey} />;
			buttonGroup.push(
				<Button variant="extendedFab" color="primary" aria-label="NewGame" onClick={this.offlineNewGame} key="gamenew">
					<AddIcon />
					New Game
		  		</Button>
			);
			buttonGroup.push(
				<Button variant="extendedFab" color="secondary" aria-label="Exit" onClick={this.offlineLeave} key="gameexit">
					<CloseIcon />
					Exit
		  		</Button>
			);
		}
		else {
			currentApp = <Welcome
				playOffline={this.offlineJoin}
			/>;
		}
		return (
			<div>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					className="AppContainer"
				>
					<Grid item className="AppItem">
						{currentApp}
					</Grid>
				</Grid>
				<div className="floatingButtons">
					{buttonGroup}
				</div>
			</div>
		);
	}
}

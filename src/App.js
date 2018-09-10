import React, { Component } from 'react';
import Board from './Game/Board';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import './Stylesheets/App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.board = React.createRef();
		this.state = {
			boardKey: 1

		};
	}

	newGame = () => {
		this.setState({boardKey: this.state.boardKey+1});
	}

	render() {
		return (
			<div>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
				>
					<Grid item>
						<Board ref={this.board} key={this.state.boardKey}/>
					</Grid>
				</Grid>
				<Button variant="extendedFab" aria-label="NewGame" className="floatingButton newGame" onClick={this.newGame}>
					<AddIcon />
					New Game
      			</Button>
			</div>
		);
	}
}

export default App;

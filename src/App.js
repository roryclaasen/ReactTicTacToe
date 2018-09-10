import React, { Component } from 'react';
import Board from './Game/Board';

import Grid from '@material-ui/core/Grid';

import './Stylesheets/App.css';

class App extends Component {
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
						<Board />
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default App;

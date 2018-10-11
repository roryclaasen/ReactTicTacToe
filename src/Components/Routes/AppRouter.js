import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import ThemeManager from '../Theme';
import Welcome from './Welcome';
import Board from './Board';
import OnlineBoard from './OnlineBoard';
import Connect from './Connect';
import ConnectUsername from './Connect.Username';
import ConnectToken from './Connect.Token';

export default class AppRouter extends Component {
	render() {
		return (
			<ThemeManager>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
				>
					<Grid item xs={10} md={8}>
						<Router>
							<Switch>
								<Route exact path="/" component={Welcome} />
								<Route exact path="/play" component={Board} />
								<Route exact path="/play/:token" component={OnlineBoard} />
								<Route exact path="/connect" component={Connect} />
								<Route exact path="/connect/username" component={ConnectUsername} />
								<Route exact path="/connect/token" component={ConnectToken} />

								<Redirect to="/" />
							</Switch>
						</Router>
					</Grid>
				</Grid>
			</ThemeManager>
		);
	}
}

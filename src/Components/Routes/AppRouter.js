import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import ThemeManager from '../Theme';
import Welcome from './Welcome';
import Board from '../Board';

import '../../Stylesheets/App.css';
import 'izitoast/dist/css/iziToast.min.css';

export default class AppRouter extends Component {
	render() {
		return (
			<ThemeManager>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					className="AppContainer"
				>
					<Grid item className="AppItem" xs={10} md={8}>
						<Router>
							<Switch>
								<Route exact path="/" component={Welcome} />
								<Route exact path="/play" component={Board} />

								<Redirect to="/" />
							</Switch>
						</Router>
					</Grid>
				</Grid>
			</ThemeManager>
		);
	}
}

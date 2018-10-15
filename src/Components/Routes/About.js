import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

export default class About extends Component {
	render() {
		const headingStyle = {
			fontWeight: 'normal'
		};

		return (
			<Card className="welcomeCard">
				<CardContent>
					<Typography variant="display1" component="h1" color="inherit">
						Ultimate Tic Tac Toe
					</Typography>
					<Typography variant="title" component="h3" color="inherit" style={headingStyle}>
						License
					</Typography>
					<Typography component="p">
						This project is licensed under the MIT License - see the <a href="/license">license file</a> for details
					</Typography>
				</CardContent>
				<CardActions>
					<Button color="primary" component={Link} to="/">
						Main Menu
					</Button>
				</CardActions>
			</Card>
		);
	}
}

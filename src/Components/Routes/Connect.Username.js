import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import Handler from '../../onlineHandler';

export default class ConnectUsername extends Component {
	constructor(props) {
		super(props);

		let { username } = Handler;

		if (username === undefined) username = '';

		this.state = {
			username
		};
	}

	usernameChange = (e) => {
		const { value } = e.target;
		this.setState({ username: value });
		Handler.changeUsername(value);
	}

	validUsername() {
		const { username } = this.state;
		return username.length >= 3;
	}

	render() {
		const { username } = this.state;
		return (
			<Card>
				<CardContent>
					<Typography gutterBottom variant="display1" component="h1" color="inherit">
						Play Online
					</Typography>
					<Typography variant="subheading">
						Enter a friendy username to be identified by when playing
					</Typography>
					<TextField
						id="username"
						label="User Name"
						margin="normal"
						variant="outlined"
						value={username}
						style={{ width: '100%' }}
						onChange={this.usernameChange}
						error={!this.validUsername() && username.length > 0}
					/>
				</CardContent>
				<CardActions>
					<Link to="/" style={{ textDecoration: 'none' }}>
						<Button color="primary">
							Main Menu
						</Button>
					</Link>
					<Link
						to="/connect"
						style={{ textDecoration: 'none' }}
						onClick={(e) => {
							if (!this.validUsername()) e.preventDefault();
						}}
					>
						<Button color="primary" disabled={!this.validUsername()}>
							Continue
						</Button>
					</Link>
				</CardActions>
			</Card>
		);
	}
}

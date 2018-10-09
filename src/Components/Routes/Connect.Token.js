import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import { Link, Redirect } from 'react-router-dom';
import Handler from '../OnlineHandler';

export default class ConnectToken extends Component {
	constructor(props) {
		super(props);

		this.state = {
			token: '',
			help: 'Token needs to be 6 characters long'
		};

		if (Handler.token !== undefined) {
			this.setState({ token: Handler.token });
		}
	}

	tokenChange = (e) => {
		const { value } = e.target;
		this.setState({ token: e.target.value });
		Handler.changeToken(value);
	}

	validToken() {
		const { token } = this.state;
		return token.length === 6;
	}

	render() {
		if (Handler.username === undefined) {
			return <Redirect to="/connect" />;
		}
		const { token, help } = this.state;
		return (
			<Card>
				<CardContent>
					<Typography gutterBottom variant="display1" component="h1" color="inherit">
						Play Online - {Handler.username}
					</Typography>
					<Typography gutterBottom component="p">
						To play against another player online you must share the same game token with your opponent.
					</Typography>
					<Typography gutterBottom component="ol">
						<li>Enter a name to be identifed by</li>
						<li>Either click &quot;Create a Game&quot; or enter the game token to start playing</li>
					</Typography>
					<TextField
						id="token"
						label="Game Token"
						margin="normal"
						variant="outlined"
						value={token}
						style={{ width: '100%' }}
						onChange={this.tokenChange}
						type="number"
						helperText={help}
						error={!this.validToken() && token.length > 0}
					/>
				</CardContent>
				<CardActions>
					<Link to="/" style={{ textDecoration: 'none' }}>
						<Button color="primary">
							Main Menu
						</Button>
					</Link>
					<Link to="/connect/username" style={{ textDecoration: 'none' }}>
						<Button color="primary">
							Change Username
						</Button>
					</Link>
					<Button color="primary">
						Create a Game
					</Button>
					<Link
						to="/connect"
						style={{ textDecoration: 'none' }}
						onClick={(e) => {
							if (!this.validToken()) e.preventDefault();
						}}
					>
						<Button color="primary" disabled={!this.validToken()}>
							Join Game
						</Button>
					</Link>
				</CardActions>
			</Card>
		);
	}
}

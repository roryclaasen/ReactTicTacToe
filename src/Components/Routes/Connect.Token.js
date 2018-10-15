import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import Handler from '../../onlineHandler';
import DialogMessage from '../DialogMessage';

export default class ConnectToken extends Component {
	constructor(props) {
		super(props);

		let { token } = Handler;
		if (token === undefined) token = '';

		this.state = {
			update: 0,
			token,
			help: 'Token needs to be 6 characters long',
			dialog: {
				open: false,
				title: '',
				message: '',
				agree: 'Yes',
				disagree: 'No'
			}
		};
	}

	tokenChange = (e) => {
		const { value } = e.target;
		this.setState({ token: e.target.value });
		Handler.changeToken(value);
	}

	createGame = () => Handler.createGame().then(() => {
		const { update } = this.state;
		this.setState({ update: update + 1 });
	});

	joinGame = () => {
		Handler.hasGame().then((exists) => {
			if (exists) {
				Handler.playing = true;
				const { update } = this.state;
				this.setState({ update: update + 1 });
			} else {
				const { update } = this.state;
				this.setState({
					update: update + 1,
					dialog: {
						open: true,
						title: 'Unable to find game',
						message: `No game with token '${Handler.token}' exists`,
						agree: 'Okay',
						disagree: undefined,
						action: undefined
					}
				});
			}
		});
	}

	validToken() {
		const { token } = this.state;
		return token.length === 6;
	}

	render() {
		if (Handler.username === undefined || Handler.playing || Handler.waiting) {
			return <Redirect to="/connect" />;
		}
		const { token, help, dialog, update } = this.state;
		return (
			<React.Fragment>
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
						<Button color="primary" component={Link} to="/">
							Main Menu
						</Button>
						<Button color="primary" component={Link} to="/connect/username">
							Change Username
						</Button>
						<Button color="primary" onClick={this.createGame}>
							Create a Game
						</Button>
						<Button color="primary" onClick={this.joinGame} disabled={!this.validToken()}>
							Join Game
						</Button>
					</CardActions>
				</Card>
				<DialogMessage all={dialog} key={update} />
			</React.Fragment>
		);
	}
}

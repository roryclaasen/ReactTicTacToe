import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import copy from 'copy-to-clipboard';

export default class Connect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			token: '',
			allowTokenInput: true,
			allowNameInput: true,
			disableButtons: false,
			tokenHelp: 'Token needs to be 6 characters long',
			waiting: false
		};
	}

	gameJoin = () => {
		const { join } = this.props;
		const { username, token } = this.state;
		if (!this.validToken()) return;
		this.setState({ allowTokenInput: false, allowNameInput: false });
		join(username, token.toString(), (data) => {
			if (data.error) {
				this.setState({ allowTokenInput: true, allowNameInput: true });
			}
		});
	}

	gameMake = () => {
		const { make } = this.props;
		const { username } = this.state;

		this.setState({ allowTokenInput: false, allowNameInput: false });

		make(username, (data) => {
			if (!data.error) {
				this.setState({
					token: data.token,
					disableButtons: true,
					tokenHelp: 'Share this token with your friend',
					waiting: true
				});
			} else {
				this.setState({ allowTokenInput: true, allowNameInput: true });
			}
		});
	}

	changeUsername = () => {
		// TODO if game made then remove
		this.setState({
			allowTokenInput: true,
			allowNameInput: true,
			token: '',
			tokenHelp: 'Token needs to be 6 characters long',
			disableButtons: false,
			waiting: false
		});
	}

	usernameChange = (e) => this.setState({ username: e.target.value });

	tokenChange = (e) => this.setState({ token: e.target.value });

	validUsername() {
		const { username } = this.state;
		return username.length >= 3;
	}

	validToken() {
		if (!this.validUsername()) return false;
		const { token } = this.state;
		return token.length === 6;
	}

	render() {
		const { username, token, tokenHelp, waiting, allowNameInput, allowTokenInput, disableButtons } = this.state;
		const { cancel } = this.props;
		const width100 = {
			width: '100%'
		};
		const cardStyles = {
			textAlign: 'center'
		};
		let cardContent;
		if (waiting) {
			cardContent = (
				<CardActionArea
					onClick={() => copy(token)}
					style={width100}
				>
					<CardContent style={cardStyles}>
						<Typography gutterBottom variant="display1" component="h1" color="inherit">
							{username}
						</Typography>
						<Grid container justify="center">
							<Grid item>
								<Typography gutterBottom variant="subheading">
									Waiting for opponent to join
								</Typography>
								<Typography gutterBottom variant="subheading">
									Share the game token bellow with you opponent so they can join
								</Typography>
								<Typography gutterBottom variant="display1">
									{token}
								</Typography>
							</Grid>
						</Grid>
						<LinearProgress variant="query" color="secondary" />
					</CardContent>
				</CardActionArea>
			);
		} else {
			cardContent = (
				<CardContent>
					<Typography gutterBottom variant="display1" component="h1" color="inherit">
						Play Online
					</Typography>
					<Typography gutterBottom component="p">
						To play against another player online you must share the same game token with your opponent.
					</Typography>
					<Typography gutterBottom component="ol">
						<li>Enter a name to be identifed by</li>
						<li>Either click &quot;Create a Game&quot; or enter the game token to start playing</li>
					</Typography>
					<Grid container spacing={24}>
						<Grid item md={6}>
							<Typography variant="subheading">
								Enter a friendy username to be identified by
							</Typography>
							<TextField
								id="username"
								label="User Name"
								margin="normal"
								variant="outlined"
								value={username}
								onChange={this.usernameChange}
								style={width100}
								error={!this.validUsername() && username.length > 0}
								disabled={!allowNameInput}
							/>
						</Grid>
						<Grid item md={6}>
							<Typography variant="subheading">
								Enter the game token
							</Typography>
							<TextField
								id="token"
								label="Game Token"
								margin="normal"
								variant="outlined"
								value={token}
								onChange={this.tokenChange}
								style={width100}
								type="number"
								helperText={tokenHelp}
								error={!this.validToken() && token.length > 0}
								disabled={!this.validUsername() || !allowTokenInput}
							/>
						</Grid>
					</Grid>
				</CardContent>
			);
		}
		return (
			<Card className="connectCard">
				{cardContent}
				<CardActions>
					<Button size="small" color="primary" onClick={cancel} disabled={waiting}>
						Main Menu
					</Button>
					<Button size="small" color="primary" onClick={this.changeUsername} disabled={allowNameInput}>
						Change Username
					</Button>
					<Button size="small" color="primary" onClick={this.gameMake} disabled={!this.validUsername() || disableButtons}>
						Create a game
					</Button>
					<Button size="small" color="primary" onClick={this.gameJoin} disabled={!this.validUsername() || disableButtons}>
						Join a game
					</Button>
				</CardActions>
			</Card>
		);
	}
}

Connect.propTypes = {
	join: PropTypes.func,
	make: PropTypes.func,
	cancel: PropTypes.func
};

Connect.defaultProps = {
	join: undefined,
	make: undefined,
	cancel: undefined
};

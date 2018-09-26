import React, { Component } from 'react';

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
		}
	}

	gameJoin = () => {
		if (!this.validToken()) return;
		this.setState({ allowTokenInput: false, allowNameInput: false });
		this.props.join(this.state.username, this.state.token.toString(), (data) => {
			if (data.error) {
				this.setState({ allowTokenInput: true, allowNameInput: true });
			}
		});
	}

	gameMake = () => {
		this.setState({ allowTokenInput: false, allowNameInput: false });

		this.props.make(this.state.username, (data) => {
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
		return this.state.username.length >= 3;
	}

	validToken() {
		if (!this.validUsername()) return false;
		return this.state.token.length === 6;
	}

	render() {
		var width100 = {
			width: '100%'
		}
		var cardStyles = {
			textAlign: 'center'
		}
		var headingStyle = {
			fontWeight: 'normal'
		}
		var cardContent;
		if (this.state.waiting) {
			cardContent = <CardActionArea
				onClick={() => copy(this.state.token)}
				style={width100}
			>
				<CardContent style={cardStyles}>
					<Typography gutterBottom variant="display1" component="h1" color="inherit">
						{this.state.username}
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
								{this.state.token}
							</Typography>
						</Grid>
					</Grid>
					<LinearProgress variant="query" color="secondary" />
				</CardContent>
			</CardActionArea>;
		} else {
			cardContent = <CardContent>
				<Typography gutterBottom variant="display1" component="h1" color="inherit">
					Play Online
				</Typography>
				<Typography gutterBottom component="p">
					To play against another player online you must share the same game token with your opponent.
				</Typography>
				<Typography gutterBottom component="ol">
					<li>Enter a name to be identifed by</li>
					<li>Either click 'Create a Game' or enter the game token to start playing</li>
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
							value={this.state.username}
							onChange={this.usernameChange}
							style={width100}
							error={!this.validUsername() && this.state.username.length > 0}
							disabled={!this.state.allowNameInput}
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
							value={this.state.token}
							onChange={this.tokenChange}
							style={width100}
							type="number"
							helperText={this.state.tokenHelp}
							error={!this.validToken() && this.state.token.length > 0}
							disabled={!this.validUsername() || !this.state.allowTokenInput}
						/>
					</Grid>
				</Grid>
			</CardContent>;
		}
		return (
			<Card className="connectCard">
				{cardContent}
				<CardActions>
					<Button size="small" color="primary" onClick={this.props.cancel} disabled={this.state.waiting}>
						Main Menu
        			</Button>
					<Button size="small" color="primary" onClick={this.changeUsername} disabled={this.state.allowNameInput}>
						Change Username
        			</Button>
					<Button size="small" color="primary" onClick={this.gameMake} disabled={!this.validUsername() || this.state.disableButtons}>
						Create a game
        			</Button>
					<Button size="small" color="primary" onClick={this.gameJoin} disabled={!this.validUsername() || this.state.disableButtons}>
						Join a game
        			</Button>
				</CardActions>
			</Card>
		);
	}
}
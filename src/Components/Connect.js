import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';


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
			this.setState({
				token: data.token,
				disableButtons: true,
				tokenHelp: 'Share this token with your friend',
				waiting: true
			});
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
		var inputStyles = {
			width: '100%'
		}
		var cardStyles = {
			textAlign: 'center'
		}
		var cardContent;
		if (this.state.waiting) {
			cardContent = <CardContent style={cardStyles}>
				<Typography variant="display1" component="h1" color="inherit">
					Play Online
				</Typography>
				<Grid container justify="center">
					<Grid item>
						<Typography variant="display1">
							{this.state.token}
						</Typography>
						<Typography variant="subheading">
							Waiting for opponent to join
						</Typography>
					</Grid>
				</Grid>
				<LinearProgress variant="query" color="secondary" />
			</CardContent>;
		} else {
			cardContent = <CardContent>
				<Typography variant="display1" component="h1" color="inherit">
					Play Online
				</Typography>
				<Typography component="p">
					{/* TODO: Write a help section or instructions of how to use */}
				</Typography>
				<Grid container spacing={24}>
					<Grid item md={6}>
						<Typography variant="subheading">
							Enter a friendy username to be identified by
						</Typography>
						<TextField
							required
							id="username"
							label="User Name"
							margin="normal"
							value={this.state.username}
							onChange={this.usernameChange}
							style={inputStyles}
							error={!this.validUsername() && this.state.username.length > 0}
							disabled={!this.state.allowNameInput}
						/>
					</Grid>
					<Grid item md={6}>
						<Typography variant="subheading">
							Enter the game token
						</Typography>
						<TextField
							required
							id="token"
							label="Game Token"
							margin="normal"
							value={this.state.token}
							onChange={this.tokenChange}
							style={inputStyles}
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
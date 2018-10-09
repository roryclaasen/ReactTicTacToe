import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import '../../Stylesheets/Welcome.css';

export default class Welcome extends Component {
	render() {
		const headingStyle = {
			fontWeight: 'normal'
		};

		const LinkButton = {
			textDecoration: 'none'
		};

		return (
			<Card className="welcomeCard">
				<CardContent>
					<Typography variant="display1" component="h1" color="inherit">
						Ultimate Tic Tac Toe
					</Typography>
					<Typography component="p">
						Tic-tac-toe is a simple, 2-player, strategy game played on a board of 9 cells set out in a 3x3 square.
						The first player places an &quot;X&quot; an any cell.
						The second player places an &quot;0&quot; in any remaining cell.
						The players continue taking turns placing their mark in remaining cells.
						The winner is the first player to place three of his marks in a row, column, or diagonal.
					</Typography>
					<Typography component="p">
						Ultimate Tic-Tac-Toe then takes this a step further and is a 2-player computer game played on a game board comprising nine tic-tac-toe games set out in nine mini-squares within a 3x3 greater-square.
						Thus, there are 81 cells, arranged in nine 3x3 mini-squares within a greater square.
					</Typography>
					<Typography variant="headline" component="h2" color="inherit">
						Rules
					</Typography>
					<Typography variant="title" component="h3" color="inherit" style={headingStyle}>
						Objective:
					</Typography>
					<Typography component="p">
						The objective of this game is to be the first to win three tic-tac-toe games lying in a row, column, or diagonal within the greater-square.
					</Typography>
					<Typography variant="title" component="h3" color="inherit" style={headingStyle}>
						Rules of Play:
					</Typography>
					<Typography component="ol">
						<li>The first player may place an &quot;X&quot; in any cell within any mini-square on the board.</li>
						<li>The selected cell position within this mini-square corresponds to the mini-square position within the greater-square where the second player must then place an &quot;O&quot;.</li>
						<li>Thereafter, the two players take turns placing their mark in any unfilled cell within the mini-square dictated by the cell position marked by the previous player. For the first player, this mini-square will be outlined in red.</li>
						<li>The first tic-tac-toe winner in a mini-square remains the winner in that mini-square for the remainder of the game.</li>
						<li>If a player is sent to a mini-square in which all the cells are filled, the player may next place his mark in any unfilled cell in any other mini-board.</li>
					</Typography>
				</CardContent>
				<CardActions>
					<Link to="/play" style={LinkButton}>
						<Button size="small" color="primary">
							Pass and Play
						</Button>
					</Link>
					<Link to="/connect" style={LinkButton}>
						<Button size="small" color="primary">
							Play Online
						</Button>
					</Link>
				</CardActions>
			</Card>
		);
	}
}

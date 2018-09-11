import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

export default class ThemeManager extends Component {
	constructor(props) {
		super(props);
		this.state = createMuiTheme({
			palette: {
				primary: { main: blue[700] },
				secondary: { main: red[500] },
			},
		});
	}
	render() {
		return (
			<MuiThemeProvider theme={this.state}>
				{this.props.children}
			</MuiThemeProvider>
		);
	}
}
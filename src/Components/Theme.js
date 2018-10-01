import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
		const { children } = this.props;
		return (
			<MuiThemeProvider theme={this.state}>
				{children}
			</MuiThemeProvider>
		);
	}
}

ThemeManager.propTypes = {
	children: PropTypes.array
};

ThemeManager.defaultProps = {
	children: undefined
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default class DialogMessage extends Component {
	constructor(props) {
		super(props);
		const { all } = this.props;
		if (all !== undefined) {
			this.state = all;
		} else {
			const { open, title, message, disagree, agree, action } = this.props;
			this.state = { open, title, message, disagree, agree, action };
		}
	}

	handleDialogClose = (agreed) => {
		const { action } = this.state;
		if (agreed === true) action();
		this.setState({
			open: false,
			action: undefined
		});
	}

	render() {
		const { open, title, message, disagree, agree } = this.state;
		return (
			<Dialog
				open={open}
				onClose={this.handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{message}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{disagree !== undefined && (
						<Button onClick={this.handleDialogClose} color="secondary">
							{disagree}
						</Button>
					)}
					<Button onClick={() => this.handleDialogClose(true)} color="primary" autoFocus>
						{agree}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

DialogMessage.propTypes = {
	all: PropTypes.object,
	open: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string,
	disagree: PropTypes.string,
	agree: PropTypes.string,
	action: PropTypes.func
};

DialogMessage.defaultProps = {
	all: undefined,
	open: false,
	title: '',
	message: '',
	disagree: '',
	agree: '',
	action: undefined
};

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Handler from '../../onlineHandler';

export default class Connect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			direct: undefined
		};
	}

	componentDidMount() {
		if ((Handler.token !== undefined && Handler.username === undefined) || (Handler.token === undefined && Handler.username === undefined)) {
			this.setState({ direct: '/connect/username' });
			return;
		}
		if (Handler.token === undefined && Handler.username !== undefined) {
			this.setState({ direct: '/connect/token' });
			return;
		}
		Handler.hasGame().then((exists) => {
			if (exists) this.setState({ direct: `/play/${Handler.token}` });
			else this.setState({ direct: '/connect/username' });
		});
	}

	render() {
		const { direct } = this.state;
		if (direct === undefined) return <React.Fragment />;
		return <Redirect to={direct} />;
	}
}

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Handler from '../../onlineHandler';

export default class Connect extends Component {
	render() {
		if (Handler.token !== undefined && Handler.username === undefined) return <Redirect to="/connect/username" />;
		if (Handler.token === undefined && Handler.username !== undefined) return <Redirect to="/connect/token" />;
		if (Handler.hasGame()) {
			const gameUrl = `/play/${Handler.token}`;
			return <Redirect to={gameUrl} />;
		}
		return <Redirect to="/connect/username" />;
	}
}

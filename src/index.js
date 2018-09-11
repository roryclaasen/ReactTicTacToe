import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './Components/App';

import SocketClient from './client';

var socket = new SocketClient();

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<App />
	</React.Fragment>,
	document.getElementById('root'));

registerServiceWorker();

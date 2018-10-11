import React from 'react';
import ReactDOM from 'react-dom';

import 'push.js/bin/serviceWorker.min';

import CssBaseline from '@material-ui/core/CssBaseline';

import registerServiceWorker from './registerServiceWorker';
import AppRouter from './Components/Routes/AppRouter';

import './Stylesheets/App.css';
import 'izitoast/dist/css/iziToast.min.css';

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<AppRouter />
	</React.Fragment>,
	document.getElementById('root')
);

registerServiceWorker();

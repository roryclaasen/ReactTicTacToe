import React from 'react';
import ReactDOM from 'react-dom';

import 'push.js/bin/serviceWorker.min';

import CssBaseline from '@material-ui/core/CssBaseline';

import GithubCorner from 'react-github-corner';

import registerServiceWorker from './registerServiceWorker';
import AppRouter from './Components/Routes/AppRouter';

import './Stylesheets/App.css';
import 'izitoast/dist/css/iziToast.min.css';

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<AppRouter />
		<GithubCorner
			href="https://github.com/roryclaasen/ReactTicTacToe"
			bannerColor="#1976d2"
			octoColor="#fff"
			size={100}
			direction="right"
		/>
	</React.Fragment>,
	document.getElementById('root')
);

registerServiceWorker();

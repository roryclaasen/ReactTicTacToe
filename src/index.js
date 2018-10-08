import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'push.js/bin/serviceWorker.min';
import registerServiceWorker from './registerServiceWorker';

import AppRouter from './Components/Routes/AppRouter';

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<AppRouter />
	</React.Fragment>,
	document.getElementById('root')
);

registerServiceWorker();

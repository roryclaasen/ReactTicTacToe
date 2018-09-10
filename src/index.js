import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './App';

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<App />
	</React.Fragment>,
	document.getElementById('root'));

registerServiceWorker();

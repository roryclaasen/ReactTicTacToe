import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'push.js/bin/serviceWorker.min';
import registerServiceWorker from './registerServiceWorker';

import App from './Components/App';

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<App />
	</React.Fragment>,
	document.getElementById('root')
);

registerServiceWorker();

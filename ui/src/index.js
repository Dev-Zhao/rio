import React from 'react';
import ReactDOM from 'react-dom';
import SocketProvider from './contexts/SocketProvider';

import App from './components/App';

// Push to heroku:
// git subtree push --prefix ui/ heroku-client master
// git subtree push --prefix server/ heroku-server master
ReactDOM.render(<SocketProvider><App /></SocketProvider>, document.querySelector('#root'));
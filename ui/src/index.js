import React from 'react';
import ReactDOM from 'react-dom';
import SocketProvider from './contexts/SocketProvider';

import App from './components/App';

ReactDOM.render(<SocketProvider><App /></SocketProvider>, document.querySelector('#root'));
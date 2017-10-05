import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import App from './App';

const store = createStore(
    reducer,
    compose(applyMiddleware(thunk))
);

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>), document.getElementById('root'));



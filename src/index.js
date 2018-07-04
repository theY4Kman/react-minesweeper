import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { compose, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import reducers from './reducers'
import Game from './components/Game'
import './styles/index.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(logger)));

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('root')
);

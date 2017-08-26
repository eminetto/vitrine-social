import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import AppContainer from './containers/App';

import './App.css';
import reducers from './reducers';

import insertCss from 'insert-css';
import css from 're-bulma/build/css';

try {
  if (typeof document !== 'undefined' || document !== null) insertCss(css, { prepend: true });
} catch (e) {
  console.log(e)
}

const store = createStore(
  reducers,
  {},
  applyMiddleware(thunk),
);

const App = () => (
  <Router>
    <Provider store={store}>
      <div className='App'>
        <Route exact path='/' component={AppContainer} />
      </div>
    </Provider>
  </Router>
);

export default App;
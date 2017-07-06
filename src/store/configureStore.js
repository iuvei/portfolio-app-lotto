import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../rootReducer';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

// initialize redux store
import initialState from '../initialState';
// import enUS from '../data/l10n/en-US';
// import zhCN from '../data/l10n/zh-CN';

// const combinedStates = {
//   ...initialState,
//   ...zhCN,
//   ...enUS
// };

// enhance our store for redux dev tools
const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const reactRouterMiddleware = routerMiddleware(browserHistory);

const configureStore = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      reduxImmutableStateInvariant(),
      reactRouterMiddleware
    )
  );

export const history = syncHistoryWithStore(browserHistory, configureStore);

export default configureStore;

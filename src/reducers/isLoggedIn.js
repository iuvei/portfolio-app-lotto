// isLoggedIn

const isLoggedIn = (state = false, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return Object.assign({}, state, { isLoggedIn: true });
    case 'LOGGED_OUT':
      return Object.assign({}, state, { isLoggedIn: false });
  }
  return state;
};

export default isLoggedIn;

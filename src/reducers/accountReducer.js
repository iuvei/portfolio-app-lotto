import * as types from '../actions/actionTypes';

const account = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_USER_SUCCESS:
      return Object.assign({}, state, action.userinfo);
    case types.GET_USER_EVENT.SUCCESS:
      return Object.assign({}, state, action.userevents);
  }
  return state;
};

export default account;

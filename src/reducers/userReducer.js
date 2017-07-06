import * as types from '../actions/actionTypes';
import initialState from '../initialState';

export default function user(state = initialState.user, action){
  switch (action.type){
    case types.USER_LOGGED_IN:
      return Object.assign({}, state, { isLoggedIn: true, info: action._user });
    // case types.POST_USER_FINGERPRINT.SUCCESS:
    //   return {...state, user_fingerprint: action.user_fingerprint };
    default:
      return state;
  }
}

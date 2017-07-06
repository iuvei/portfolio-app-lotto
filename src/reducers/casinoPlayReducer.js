import * as types from '../actions/actionTypes';

export default function user(state = [], action){
  switch (action.type){
    case types.CASINO_PLAY_SUCCESS:
      return Object.assign({}, state, action.casinoPlay);
    default:
      return state;
  }
}

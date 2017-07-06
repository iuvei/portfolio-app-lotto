import * as types from '../actions/actionTypes';
import initialState from '../initialState';

export default function loyalty(state = initialState.loyalty, action){
  switch (action.type){
    case types.FIND_LOYALTY_SUCCESS:
      return Object.assign({}, state, action.loyalty);
    default:
      return state;
  }
}

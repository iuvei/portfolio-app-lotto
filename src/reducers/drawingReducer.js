// LFG reducer
import * as types from '../actions/actionTypes';

export default function (state = [], action) {
  switch (action.type) {
    case types.LOAD_DRAWING_SUCCESS:
      return {...state, drawings: action.drawings };
    default:
      return state;
  }
}

import * as types from '../actions/actionTypes';
import initialState from '../initialState';

export default function ajaxStatusReducer(state = initialState.ajaxStatus, action){
  switch (action.type){
    case types.BEGIN_AJAX_CALL:
      return Object.assign({}, state, { isLoading: 1 });
    case types.END_AJAX_CALL:
      return Object.assign({}, state, { isLoading: 0 });
    default:
      return state;
  }
}

// reducer for off canvas nav
import * as types from '../actions/actionTypes';
import initialState from '../initialState';

export default function (state = initialState.offCanvasNav, action) {
  switch (action.type) {
    case types.TOGGLE_LEFT_NAV:
      return {...state, toggleLeftNavVisible: !action.toggleLeftNavVisible };
    case types.TOGGLE_RIGHT_NAV:
      return {...state, toggleRightNavVisible: !action.toggleRightNavVisible };
    default:
      return state;
  }
}

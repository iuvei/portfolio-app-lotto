// off canvas nav actions
import * as types from './actionTypes';

export function toggleLeftNav(toggleLeftNavVisible){
  return {
    type: types.TOGGLE_LEFT_NAV, toggleLeftNavVisible
  };
}

export function toggleRightNav(toggleRightNavVisible) {
  return {
    type: types.TOGGLE_RIGHT_NAV, toggleRightNavVisible
  };
}

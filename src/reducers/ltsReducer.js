import * as types from '../actions/actionTypes';

export default function (state = [], action) {
  switch (action.type) {
    case types.FETCH_PRODUCT_STATE.SUCCESS:
      return {...state, productState: action.productState };
    case types.POST_PRODUCT_BET.SUCCESS:
      return {...state, productBet: action.productBet };
    default:
      return state;
  }
}

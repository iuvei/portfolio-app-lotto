import * as types from '../actions/actionTypes';
import initialState from '../initialState';

export default function wallet(state = [], action){
  switch (action.type){
    case types.LOAD_TRANSACTION_SUCCESS:
      return Object.assign({}, state, action.transaction);
    case types.CREDIT_WALLET_SUCCESS:
      let creditArray = Object.values(state);
      creditArray.unshift(action.transaction);
      let creditObject = Object.assign({}, creditArray);
      return Object.assign({}, state, creditObject);
    case types.DEBIT_WALLET_SUCCESS:
      let debitArray = Object.values(state);
      debitArray.unshift(action.transaction);
      let debitObject = Object.assign({}, debitArray);
      return Object.assign({}, state, debitObject);
    case types.TRANSFER_WALLET_SUCCESS:
      let transferArray = Object.values(state);
      transferArray.unshift(action.transaction);
      let transferObject = Object.assign({}, transferArray);
      return Object.assign({}, state, transferObject);
    default:
      return state;
  }
}

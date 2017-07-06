import * as types from '../actions/actionTypes';

export default function user(state = [], action){
  switch (action.type){
    case types.CREATE_CASINO_ACCOUNT_SUCCESS:
      return Object.assign([], state, action.casinoAccount);
    case types.UPDATE_CASINO_BALANCE:
      let tx = action.transaction;
      let endingAmount = 0;
      if (tx.sub_type == 'credit'){
        endingAmount = state.balance + tx.amount;
      } else {
        endingAmount = state.balance - tx.amount;
      }
      return Object.assign({}, state, {balance: endingAmount});
    default:
      return state;
  }
}

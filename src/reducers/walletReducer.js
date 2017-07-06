import * as types from '../actions/actionTypes';
import initialState from '../initialState';
import _ from 'lodash';
import update from 'immutability-helper';

export default function wallet(state = initialState.wallet, action){
  switch (action.type){
    case types.FIND_WALLET_SUCCESS:
      return Object.assign({}, state, action.wallet);
    case types.UPDATE_WALLET_BALANCE:
      let walletToUpdate = _.findIndex(state, {_id: "5843d551b75b175c50eacc91"});
      let updatedWallet = update(state, {
        0: {
          'balance': {$set: action.wallet.balance}
        }
      });
      return Object.assign({}, updatedWallet);
    default:
      return state;
  }
}

import * as types from '../actions/actionTypes';
import _ from 'lodash';

export default function externalWallet(state = [], action){
  switch (action.type){
    case types.LOAD_EXTERNAL_WALLET_SUCCESS:
      return Object.assign({}, state, action.externalWallet);
    default:
      return state;

  }
}

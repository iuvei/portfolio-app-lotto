import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';

export function loadExternalWalletSuccess(externalWallet) {
  return {type: types.LOAD_EXTERNAL_WALLET_SUCCESS, externalWallet};
}

export function loadExternalWallet(){
  let waUrl = '/api/wallet/externalwallet';
  return function (dispatch) {
    axios.get(waUrl)
    .then(function (res) {
      let externalWallets = JSON.parse(res.data);
      dispatch(loadExternalWalletSuccess(externalWallets[0]));
    })
    .catch(function (err) {
    });
  };
}

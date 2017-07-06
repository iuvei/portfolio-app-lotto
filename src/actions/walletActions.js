import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import { browserHistory } from 'react-router';
import _ from 'lodash';

export function findWalletSuccess(wallet) {
  return {type: types.FIND_WALLET_SUCCESS, wallet};
}

export function findWallet(token, merchant_id, tagsData){
  let headers = addHeaders(token, merchant_id);
  if (tagsData) {
    headers['x-tags-data'] = tagsData;
  }
  let waUrl = '/api/wallet';
  return function (dispatch) {
    axios.get(waUrl, {
      headers: headers
    })
    .then(function (res) {
      let wallets = JSON.parse(res.data);
      let cashWallet = _.find(wallets, {type: 'cash'});
      dispatch(findWalletSuccess(wallets));
      if (cashWallet.balance == 0){
        browserHistory.push('/my-account');
      }
    })
    .catch(function (err) {
    });
  };
}

function addHeaders(token, merchant_id) {
  return {
    'Authorization': `Bearer ${token}`,
    'x-merchant-id': merchant_id
  };
}

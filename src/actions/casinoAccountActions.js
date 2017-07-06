import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';

export function createCasinoAccountSuccess(casinoAccount) {
  return {type: types.CREATE_CASINO_ACCOUNT_SUCCESS, casinoAccount};
}

export function createCasinoAccount(casinoAccount){
  let casinoUrl = '/api/casinoGames/account';
  return function (dispatch) {
    axios({
      method: 'POST',
      url: casinoUrl,
      data: casinoAccount
    })
    .then(function (res) {
      let account = res.data.response;
      dispatch(createCasinoAccountSuccess(account));
    })
    .catch(function (err) {
    });
  };
}

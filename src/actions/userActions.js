import * as types from './actionTypes';
import { axios, createAuthorizedRequest } from '../utils';

export function userLoggedIn(user){
  let _user = user.idTokenParsed;
  _user.token = user.token;
  _user.merchant_id = user.realm;
  return { type: types.USER_LOGGED_IN, _user };
}

function postUserFingerprintSuccess(){
  return {
    type: types.POST_USER_FINGERPRINT.SUCCESS
  };
}

function postUserFingerprintFailed(){
  return {
    type: types.POST_USER_FINGERPRINT.FAILURE
  };
}

export function postUserFingerprint(params) {
  let url = '/userInfo/fingerprint';
  const request = axios.post(url, params);
  return dispatch => {
    return (
      request
        .then(response => dispatch(postUserFingerprintSuccess()))
        .catch(error => dispatch(postUserFingerprintFailed()))
    );
  };
}

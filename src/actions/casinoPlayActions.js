import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';

export function casinoPlaySuccess(casinoPlay) {
  return {type: types.CASINO_PLAY_SUCCESS, casinoPlay};
}

export function casinoPlay(data){
  let casinoUrl = '/api/casinoGames/account/play';
  // browserHistory.push('/casino-play');
  return function (dispatch) {
    dispatch(beginAjaxCall());
    axios({
      method: 'POST',
      url: casinoUrl,
      data: data
    })
    .then(function (res) {
      dispatch(endAjaxCall());
      let gameInfo = res.data;
      dispatch(casinoPlaySuccess(gameInfo));
    })
    .catch(function (err) {
    });
  };
}

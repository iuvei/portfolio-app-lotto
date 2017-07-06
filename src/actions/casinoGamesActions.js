import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import shuffleArray from 'shuffle-array';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import $ from 'jquery';

export function loadCasinoGamesSuccess(casinoGames) {
  return {type: types.LOAD_CASINO_GAMES_SUCCESS, casinoGames};
}

export function loadVideoSlotGamesSuccess(games) {
  return { type: types.LOAD_VIDEOSLOT_GAMES_SUCCESS, games };
}
export function loadLiveGamesSuccess(games) {
    return { type: types.LOAD_LIVE_GAMES_SUCCESS, games };
}


export function loadCasinoGames(params = {}) {
  let casinoUrl = '/api/casinoGames?';
  return function(dispatch) {
    dispatch(beginAjaxCall());
    axios.get(casinoUrl + $.param(params))
      .then(function(res) {
        dispatch(endAjaxCall());
          let games = JSON.parse(res.data);
          dispatch(loadCasinoGamesSuccess(shuffleArray(games)));
        })
      .catch(function(err) {});
  };
}

export function loadVideSlotGames(params = {}) {
    let casinoUrl = '/api/casinoGames?';
    return function(dispatch) {
        dispatch(beginAjaxCall());
        axios.get(casinoUrl + $.param(params))
            .then(function(res) {
                dispatch(endAjaxCall());
                let games = JSON.parse(res.data);
                dispatch(loadVideoSlotGamesSuccess(shuffleArray(games)));
            })
            .catch(function(err) {});
    };
}

export function loadLiveGames(params = {}) {
    let casinoUrl = '/api/casinoGames?';
    return function(dispatch) {
        dispatch(beginAjaxCall());
        axios.get(casinoUrl + $.param(params))
            .then(function(res) {
                dispatch(endAjaxCall());
                let games = JSON.parse(res.data);
                dispatch(loadLiveGamesSuccess(shuffleArray(games)));
            })
            .catch(function(err) {});
    };
}

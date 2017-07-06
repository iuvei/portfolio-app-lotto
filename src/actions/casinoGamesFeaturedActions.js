import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import $ from 'jquery';

export function loadCasinoGamesFeaturedSuccess(casinoGamesFeatured) {
  return {type: types.LOAD_CASINO_GAMES_FEATURED_SUCCESS, casinoGamesFeatured};
}

export function loadCasinoGamesFeatured(params = {}) {
  let casinoUrl = '/api/casinoGames/featured?';
  return function(dispatch) {
    axios.get(casinoUrl + $.param(params))
      .then(function(res) {
        let games = JSON.parse(res.data);
        dispatch(loadCasinoGamesFeaturedSuccess(games));
      })
      .catch(function(err) {});
  };
}

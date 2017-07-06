import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';

export function loadLocaleSuccess(locale) {
  return {type: types.LOAD_LOCALE_SUCCESS, locale};
}

export function loadLocale(locale){
  let url = '/api/locale/'+locale;
  return function (dispatch) {
    axios.get(url)
    .then(function (res) {
      dispatch(loadLocaleSuccess(res.data));
    })
    .catch(function (err) {
    });
  };
}

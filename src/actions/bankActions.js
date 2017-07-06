import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import shuffleArray from 'shuffle-array';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import $ from 'jquery';

export function loadBankListSuccess(banks) {
  return {type: types.LOAD_BANKS_SUCCESS, banks};
}

export function loadBankList(params = {}) {
  let creditUrl = '/api/bank?method_type=deposit&';
  let debitUrl = '/api/bank?method_type=withdraw&';

  return function(dispatch) {
    dispatch(beginAjaxCall());
    let banks = {};
    axios.get(creditUrl + $.param(params))
    .then(function(res) {
      banks.deposit = JSON.parse(res.data);
      axios.get(debitUrl + $.param(params))
      .then(function(res){
        dispatch(endAjaxCall());
        banks.withdraw = JSON.parse(res.data);
        dispatch(loadBankListSuccess(banks));
      })
      .catch(function(err) {});
    })
    .catch(function(err) {});
  };
}

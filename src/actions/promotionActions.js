import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';

export function loadPromotionSuccess(promotion) {
  return {type: types.LOAD_PROMOTION_SUCCESS, promotion};
}

export function loadPromotion(){
  let url = '/api/promotion/rule';
  return function (dispatch) {
    axios.get(url)
    .then(function (res) {
      dispatch(loadPromotionSuccess(JSON.parse(res.data)));
    })
    .catch(function (err) {
    });
  };
}

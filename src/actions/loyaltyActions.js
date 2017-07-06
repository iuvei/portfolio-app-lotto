import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';

export function findLoyaltySuccess(loyalty) {
  return {type: types.FIND_LOYALTY_SUCCESS, loyalty};
}

export function findLoyalty(userId){
  let loyaltyUrl = '/api/loyalty?status=New&user_id='+userId;
  return function(dispatch){
    axios.get(loyaltyUrl)
    .then(function(res){
      // Get only first active transaction data from loyalty
      let loyaltyTrans = JSON.parse(res.data);
      let trans = loyaltyTrans[0];
      dispatch(findLoyaltySuccess(trans));
    })
    .catch(function(err) {});
  };
}

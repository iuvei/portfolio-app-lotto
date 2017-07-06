// LFG actions
import * as types from './actionTypes';
import { axios, createAuthorizedRequest } from '../utils';
import { browserHistory } from 'react-router';
import { default as showSweetAlert } from 'sweetalert2';

function fetchProductStateSuccess(productState){
  return {
    type: types.FETCH_PRODUCT_STATE.SUCCESS, productState
  };
}

function fetchProductStateFailed(productState){
  return {
    type: types.FETCH_PRODUCT_STATE.FAILURE, productState
  };
}

export function fetchProductState(params) {
  let uri = '/lts/product-state';

  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchProductStateSuccess(response.data)))
        .catch(error => dispatch(fetchProductStateFailed(error)))
    );
  };
}

function postProductBetsSuccess(productBet){
  if (productBet.Result) {
    // let gameId = productBet.Result.TicketPostResult.lotteryId;
    return {
      type: types.POST_PRODUCT_BET.SUCCESS, productBet
    };
  }
}

function postProductBetsFailed(productBetError){
  return {
    type: types.POST_PRODUCT_BET.FAILURE
  };
}

export function postProductBets(params) {
  let uri = '/lts/bet';

  const request = axios.post(uri, params);
  return dispatch => {
    return (
      request
        .then(response => dispatch(postProductBetsSuccess(response.data)))
        .catch(error => dispatch(postProductBetsFailed(error)))
    );
  };
}


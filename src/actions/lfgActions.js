// LFG actions
import * as types from './actionTypes';
import * as lfgAPI from '../apis';
import { axios, createAuthorizedRequest } from '../utils';
import { browserHistory } from 'react-router';
import { default as showSweetAlert } from 'sweetalert2';

const swalConfig = (title, subTitle, type) => {
  return {
    title: title,
    html: subTitle,
    type: type,
    allowOutsideClick: true,
    confirmButtonColor: "#f3a71e"
  };
};

const swalConfirmConfig = (title, subTitle) => {
  return {
    title: title,
    html: subTitle,
    type: "question",
    showCancelButton: true,
    confirmButtonColor: "#f3a71e",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    closeOnConfirm: false,
    closeOnCancel: true
  };
};

function fetchDrawingsSuccess(drawings){
  return {
    type: types.FETCH_DRAWINGS.SUCCESS, drawings
  };
}

function fetchDrawingsFailed(){
  return {
    type: types.FETCH_DRAWINGS.FAILURE
  };
}

export function fetchDrawings(currency, lotteryId, opts) {
  let uri = '';
  if (lotteryId && currency && opts) {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}/${lotteryId}/${currency}/${opts.next}/${opts.last}`;
  } else if (lotteryId && currency && !opts) {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}/${lotteryId}/${currency}`;
  } else if (currency && !lotteryId && !opts) {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}/${currency}`;
  } else {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}`;
  }
  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchDrawingsSuccess(response.data)))
        .catch(error => dispatch(fetchDrawingsFailed()))
    );
  };
}

function fetchDrawingsHistorySuccess(drawingsHistory){
  return {
    type: types.FETCH_DRAWINGS_HISTORY.SUCCESS, drawingsHistory
  };
}

function fetchDrawingsHistoryFailed(){
  return {
    type: types.FETCH_DRAWINGS_HISTORY.FAILURE
  };
}

export function fetchDrawingsHistory(currency, lotteryId, drawDate) {
  let uri = '';
  if (lotteryId && currency && drawDate) {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}/${lotteryId}/${drawDate}/${currency}`;
  } else {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}`;
  }
  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchDrawingsHistorySuccess(response.data)))
        .catch(error => dispatch(fetchDrawingsHistoryFailed()))
    );
  };
}

function fetchDrawingsByDateSuccess(drawingsResult){
  return {
    type: types.FETCH_DRAWINGS_BYDATE.SUCCESS, drawingsResult
  };
}

function fetchDrawingsByDateFailed(){
  return {
    type: types.FETCH_DRAWINGS_BYDATE.FAILURE
  };
}

// to handle fetching of drawIds in LFG
export function fetchDrawingsByDate(currency, lotteryId, drawDate) {
  let uri = '';
  if (lotteryId && currency && drawDate) {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}/${lotteryId}/${drawDate}/${currency}`;
  } else {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}`;
  }
  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchDrawingsByDateSuccess(response.data)))
        .catch(error => dispatch(fetchDrawingsByDateFailed()))
    );
  };
}

function fetchDrawingsByDrawIdSuccess(drawingsResult){
  return {
    type: types.FETCH_DRAWINGS_BY_ID.SUCCESS, drawingsResult
  };
}

function fetchDrawingsByDrawIdFailed(){
  return {
    type: types.FETCH_DRAWINGS_BY_ID.FAILURE
  };
}

// to handle fetching of drawIds in LFG
export function fetchDrawingsByDrawId(currency, drawId) {
  let uri = '';
  if (currency && drawId) {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}/${currency}/${drawId}`;
  } else {
    uri = `${lfgAPI.LFG_DRAWINGS_PATH}`;
  }
  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchDrawingsByDrawIdSuccess(response.data)))
        .catch(error => dispatch(fetchDrawingsByDrawIdFailed()))
    );
  };
}

function fetchLotteriesSuccess(lotteries){
  return {
    type: types.FETCH_LOTTERIES.SUCCESS, lotteries
  };
}

function fetchLotteriesFailed(){
  return {
    type: types.FETCH_LOTTERIES.FAILURE
  };
}

export function fetchLotteries(lotteryId) {
  let uri = (lotteryId) ? `${lfgAPI.LFG_LOTTERIES_PATH}/${lotteryId}` : `${lfgAPI.LFG_LOTTERIES_PATH}`;
  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchLotteriesSuccess(response.data)))
        .catch(error => dispatch(fetchLotteriesFailed()))
    );
  };
}

function fetchPricesSuccess(prices){
  return {
    type: types.FETCH_PRICES.SUCCESS, prices
  };
}

function fetchPricesFailed(pricesError){
  // console.log('fetchPricesFailed:', pricesError);
  return {
    type: types.FETCH_PRICES.FAILURE, pricesError
  };
}

export function fetchPrices(params) {
  let uri = `${lfgAPI.LFG_PRICES_PATH}/${params.currency}`;
  // let uri = `${lfgAPI.LFG_PRICES_PATH}/${params.gameId}`;

  // const request = axios.post(uri, params);
  const request = axios.get(uri);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchPricesSuccess(response.data)))
        .catch(error => dispatch(fetchPricesFailed(error)))
    );
  };
}

function postBetsSuccess(bet){
  // console.log('bet.Result', bet);
  if (bet.Result) {
    // let gameId = bet.Result.TicketPostResult.lotteryId;
    // browserHistory.push('/lfg-summary/'+gameId);
    // showSweetAlert(swalConfig("谢谢您下注", "您的投注已成功处理.", "success"));
    return {
      type: types.POST_BET.SUCCESS, bet
    };
  }
}

function postBetsFailed(betError){
  showSweetAlert(swalConfig("抱歉...", "目前无法下注. 请稍后再试.", "error"));
  return {
    type: types.POST_BET.FAILURE
  };
}

export function postBets(params) {
  let uri = `${lfgAPI.LFG_BET_PATH}`;

  const request = axios.post(uri, params);
  return dispatch => {
    return (
      request
        .then(response => dispatch(postBetsSuccess(response.data)))
        .catch(error => dispatch(postBetsFailed(error)))
    );
  };
}

function postOpenBetSuccess(openbet){
  return {
    type: types.POST_OPENBET.SUCCESS, openbet
  };
}

function postOpenBetFailed(openbetError){
  // console.log('postOpenBetFailed:', openbetError);
  return {
    type: types.POST_OPENBET.FAILURE, openbetError
  };
}

export function postOpenBet(params) {
  let uri = `${lfgAPI.LFG_OPENBET_PATH}`;

  const request = axios.post(uri, params);
  return dispatch => {
    return (
      request
        .then(response => dispatch(postOpenBetSuccess(response.data)))
        .catch(error => dispatch(postOpenBetFailed(error)))
    );
  };
}

function postBetHistorySuccess(betHistory){
  return {
    type: types.POST_BET_HISTORY.SUCCESS, betHistory
  };
}

function postBetHistoryFailed(betHistoryError){
  return {
    type: types.POST_BET_HISTORY.FAILURE, betHistoryError
  };
}

export function postBetHistory(params) {
  let uri = `${lfgAPI.LFG_BET_HISTORY_PATH}`;

  const request = axios.post(uri, params);
  return dispatch => {
    return (
      request
        .then(response => dispatch(postBetHistorySuccess(response.data)))
        .catch(error => dispatch(postBetHistoryFailed(error)))
    );
  };
}

function postFetchLotteryAmtSuccess(fetchLotteryAmt){
  return {
    type: types.POST_FETCH_LOTTERY_AMT.SUCCESS, fetchLotteryAmt
  };
}

function postFetchLotteryAmtFailed(fetchLotteryAmtError){
  return {
    type: types.POST_FETCH_LOTTERY_AMT.FAILURE, fetchLotteryAmtError
  };
}

export function postFetchLotteryAmt(params) {
  let uri = `${lfgAPI.LFG_FETCH_LOTTERY_AMT}`;

  const request = axios.post(uri, params);
  return dispatch => {
    return (
      request
        .then(response => dispatch(postFetchLotteryAmtSuccess(response.data)))
        .catch(error => dispatch(postFetchLotteryAmtFailed(error)))
    );
  };
}

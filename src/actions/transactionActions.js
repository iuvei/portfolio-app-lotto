import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import { default as showSweetAlert } from 'sweetalert2';

const TransLateErrorMessage = (errCode, errMsg) => {
  let translated;
  switch(errCode){
    case 'ASIE_406':
      translated = "信用额度超过";
    break;
    default:
      translated = errMsg;
  }


  return translated;
};

const swalErrorConfig = (msg) => {
  return {
    title : "错误",
    html : msg,
    type: "error"
  };
};

// const swalConfig = (title, currency, amount) => {
//   return {
//     title: title,
//     html: `数量: <b><span style=color:#000>${currency} ${amount}</span></b>`,
//     type: "success",
//     allowOutsideClick: true,
//     confirmButtonColor: "#f3a71e"
//   };
// };

const swalConfig = (title, subTitle, type) => {
  return {
    title: title,
    html: subTitle,
    type: type,
    confirmButtonColor: "#f3a71e"
  };
};

export function loadTransactionSuccess(transaction){
  return { type: types.LOAD_TRANSACTION_SUCCESS, transaction };
}

export function creditWalletSuccess(transaction, localeData) {
  // showSweetAlert("Deposit Success!", transaction);
  // return {type: types.CREDIT_WALLET_SUCCESS, transaction};
  return window.open(transaction, '_blank', 'width=1000,height=800');
}

export function debitWalletSuccess(transaction, localeData) {
  const curr = (transaction.currency == 'CNY' ? '\u00A5' : transaction.currency);
  showSweetAlert(swalConfig(localeData['cashier.prompt.withdrawalSuccessTitle'], `${localeData['cashier.prompt.quantityLabel']}: <b><span style=color:#a5cd28>${curr} ${transaction.amount}</span></b>`, "success"));
  return {type: types.DEBIT_WALLET_SUCCESS, transaction};
}

export function transferWalletSuccess(transaction, localeData) {
  const curr = (transaction.currency == 'CNY' ? '\u00A5' : transaction.currency);
  showSweetAlert(swalConfig("转让成功!", `${localeData['cashier.prompt.quantityLabel']}: <b><span style=color:#a5cd28>${curr} ${transaction.amount}</span></b>`, "success"));
  return {type: types.TRANSFER_WALLET_SUCCESS, transaction};
}

export function updateWalletBalance(transaction, localeData){
  let wallet = {
    _id: transaction.wallet_id,
    balance: transaction.ending
  };
  const txType = transaction.transactionType;
  if (txType == 'deposit') {
    showSweetAlert(swalConfig(localeData['cashier.prompt.depositSuccessTitle'], localeData['cashier.prompt.depositSuccessContent'], "success"));
  }
    // console.log('txType',txType);
  return {type: types.UPDATE_WALLET_BALANCE, wallet};
}

export function updateCasinoBalance(transaction){
  return {type: types.UPDATE_CASINO_BALANCE, transaction};
}

export function loadTransaction(token, merchant_id){
  let headers = addHeaders(token, merchant_id);
  let waUrl = '/api/transaction/50';

  return function (dispatch) {
    axios.get(waUrl, {
      headers: headers
    })
    .then(function (res) {
      let tx = JSON.parse(res.data);
      dispatch(loadTransactionSuccess(tx));
    })
    .catch(function (err) {
    });
  };
}

export function creditWallet(token, paystar_id, merchant_id, data, localeData){
  let headers = addHeaders(token, merchant_id);
  headers['x-paystar-id'] = paystar_id;
  headers['x-secret-key'] = config.paystar.secret_key;
  let waUrl = '/api/wallet/credit';
  return function (dispatch) {
    dispatch(beginAjaxCall());
    axios({
      method: 'POST',
      url: waUrl,
      data: data,
      headers: headers
    })
    .then(function (res) {
      dispatch(endAjaxCall());
      dispatch(creditWalletSuccess(res.data, localeData));
      dispatch(updateWalletBalance(res.data, localeData));
    })
    .catch(function (err) {
    });
  };
}

export function debitWallet(token, paystar_id, merchant_id, data, localeData){
  let headers = addHeaders(token, merchant_id);
  headers['x-paystar-id'] = paystar_id;
  headers['x-secret-key'] = config.paystar.secret_key;
  let waUrl = '/api/wallet/debit';
  return function (dispatch) {
    dispatch(beginAjaxCall());
    axios({
      method: 'POST',
      url: waUrl,
      data: data,
      headers: headers
    })
    .then(function (res) {
      dispatch(endAjaxCall());
      dispatch(debitWalletSuccess(res.data, localeData));
      dispatch(updateWalletBalance(res.data, localeData));
    })
    .catch(function (err) {
    });
  };
}

export function transferWallet(token, merchant_id, data, localeData){
  let headers = addHeaders(token, merchant_id);
  let waUrl = '/api/wallet/transfer';
  return function (dispatch) {
    dispatch(beginAjaxCall());
    axios({
      method: 'POST',
      url: waUrl,
      data: data,
      headers: headers
    })
    .then(function (res) {
      dispatch(endAjaxCall());
      dispatch(transferWalletSuccess(res.data, localeData));
      dispatch(updateCasinoBalance(res.data));
      dispatch(updateWalletBalance(res.data, localeData));
    })
    .catch(function (err) {
      let resErr = err.response.data;
      showSweetAlert(swalErrorConfig(TransLateErrorMessage(resErr.response.body.Code, resErr.response.body.Message)));
    });
  };
}

function addHeaders(token, merchant_id) {
  return {
    'Authorization': `Bearer ${token}`,
    'x-merchant-id': merchant_id
  };
}

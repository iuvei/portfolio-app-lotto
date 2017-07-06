// LFG actions
import * as types from './actionTypes';
import * as lfgAPI from '../apis';
import { axios, createAuthorizedRequest } from '../utils';
import { browserHistory } from 'react-router';
import { default as showSweetAlert } from 'sweetalert2';


function fetchDrawingsSuccess(drawings){
  return {
    type: types.LOAD_DRAWING_SUCCESS, drawings
  };
}

// function fetchDrawingsFailed(){
//   return {
//     type: types.FETCH_DRAWINGS.FAILURE
//   };
// }

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
        // .catch(error => dispatch(fetchDrawingsFailed()))
    );
  };
}


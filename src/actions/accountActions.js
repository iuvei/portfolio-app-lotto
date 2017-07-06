import * as types from './actionTypes';
import * as config from '!json!../../config';
import axios from 'axios';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import { default as showSweetAlert } from 'sweetalert2';

const swalConfig = (title, body) => {
  return {
    title: title,
    html: body,
    type: "success",
    allowOutsideClick: true,
    confirmButtonColor: "#f3a71e"
  };
};

export function updateUserSuccess(userinfo) {
  showSweetAlert(swalConfig("更新成功...", '资讯更新成功!'));
  return {type: types.UPDATE_USER_SUCCESS, userinfo};
}

export function updateUserInfo(data){
  let waUrl = '/api/account';
  return function (dispatch) {
    dispatch(beginAjaxCall());
    axios({
      method: 'POST',
      url: waUrl,
      data: data
    })
    .then(function (res) {
      dispatch(endAjaxCall());
      dispatch(updateUserSuccess(res.data));
    })
    .catch(function (err) {
    });
  };

}


export function getUserEventsSuccess(userevents) {
  return {type: types.GET_USER_EVENT.SUCCESS, userevents};
}

export function getUserEvents(data){
  let eventUrl = '/api/account/events';

  const request = axios({
    method: 'POST',
    url: eventUrl,
    data: data
  });
  return dispatch => {
    return (
      request
        .then(response => dispatch(getUserEventsSuccess(response.data)))
        .catch(function (err) {})
    );
  };

}

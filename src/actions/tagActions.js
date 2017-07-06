import * as types from './actionTypes';
import axios from 'axios';
import { browserHistory } from 'react-router';

function fetchCategoriesSuccess(categories){
  return {
    type: types.FETCH_CATEGORIES.SUCCESS, categories
  };
}

function fetchCategoriesFailed(){
  return {
    type: types.FETCH_CATEGORIES.FAILURE
  };
}

export function fetchCategories(token, merchant_id) {
  let headers = addHeaders(token, merchant_id);
  let url = '/api/tags/categories';

  const request = axios.get(url, {
    headers: headers
  });
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchCategoriesSuccess(response.data)))
        .catch(error => dispatch(fetchCategoriesFailed()))
    );
  };
}

function postTagsSuccess(tag){
  return {
    type: types.POST_TAGS.SUCCESS, tag
  };
}

function postTagsFailed(){
  return {
    type: types.POST_TAGS.FAILURE
  };
}

export function postTags(token, merchant_id, data) {
  let headers = addHeaders(token, merchant_id);
  let url = '/api/tags';

  const request = axios({
    method: 'POST',
    url: url,
    data: data,
    headers: headers
  });
  return dispatch => {
    return (
      request
        .then(response => dispatch(postTagsSuccess(response.data)))
        .catch(error => dispatch(postTagsFailed()))
    );
  };
}

function addHeaders(token, merchant_id) {
  return {
    'Authorization': `Bearer ${token}`,
    'x-merchant-id': merchant_id
  };
}

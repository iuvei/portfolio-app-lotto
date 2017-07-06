// Tags reducer
import * as types from '../actions/actionTypes';

export default function (state = [], action) {
  switch (action.type) {
    case types.FETCH_CATEGORIES.SUCCESS:
      return {...state, categories: action.categories };
    case types.POST_TAGS.SUCCESS:
      return {...state, tag: action.tag };
    default:
      return state;
  }
}

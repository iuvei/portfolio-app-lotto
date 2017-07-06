import * as types from '../actions/actionTypes';

export default function user(state = [], action){
  switch (action.type){
    case types.LOAD_CASINO_GAMES_SUCCESS:
      return Object.assign([], state, action.casinoGames);
    default:
      return state;
  }
}

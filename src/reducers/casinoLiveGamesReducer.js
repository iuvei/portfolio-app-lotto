import * as types from '../actions/actionTypes';

export default function liveGameReducer(state = [], action) {
    switch (action.type) {
        case types.LOAD_LIVE_GAMES_SUCCESS:
            return Object.assign([], state, action.games);
        default:
            return state;
    }
}

import * as types from '../actions/actionTypes';

export default function videoSlotReducer(state = [], action) {
    switch (action.type) {
        case types.LOAD_VIDEOSLOT_GAMES_SUCCESS:
            return Object.assign([], state, action.games);
        default:
            return state;
    }
}

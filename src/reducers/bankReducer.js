import * as types from '../actions/actionTypes';

export default function bankReducer(state = [], action) {
    switch (action.type) {
        case types.LOAD_BANKS_SUCCESS:
            return Object.assign([], state, action.banks);
        default:
            return state;
    }
}

// LFG reducer
import * as types from '../actions/actionTypes';

export default function (state = [], action) {
  switch (action.type) {
    case types.FETCH_DRAWINGS.SUCCESS:
      return {...state, drawings: action.drawings };
    case types.FETCH_DRAWINGS_HISTORY.SUCCESS:
      return {...state, drawingsHistory: action.drawingsHistory };
    case types.FETCH_DRAWINGS_BYDATE.SUCCESS:
      return {...state, drawingsResult: action.drawingsResult };
    case types.FETCH_DRAWINGS_BY_ID.SUCCESS:
      return {...state, drawingsResult: action.drawingsResult };
    case types.FETCH_LOTTERIES.SUCCESS:
      return {...state, lotteries: action.lotteries };
    case types.FETCH_PRICES.SUCCESS:
      return {...state, prices: action.prices };
    case types.POST_BET.SUCCESS:
      return {...state, bet: action.bet };
    case types.POST_OPENBET.SUCCESS:
      return {...state, openbet: action.openbet };
    case types.POST_BET_HISTORY.SUCCESS:
      return {...state, betHistory: action.betHistory };
    case types.POST_FETCH_LOTTERY_AMT.SUCCESS:
      return {...state, fetchLotteryAmt: action.fetchLotteryAmt };
    default:
      return state;
  }
}

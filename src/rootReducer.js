import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import links from './reducers/links';
import language from './reducers/language';
import user from './reducers/userReducer';
import wallet from './reducers/walletReducer';
import bank from './reducers/bankReducer';
import paymentDetail from './reducers/paymentDetailReducer';
import currency from './reducers/currencyReducer';
import transaction from './reducers/transactionReducer';
import casinoGames from './reducers/casinoGamesReducer';
import casinoGamesFeatured from './reducers/casinoGamesFeaturedReducer';
import casinoVideoSlotGames from './reducers/casinoVideoSlotGamesReducer';
import casinoLiveGames from './reducers/casinoLiveGamesReducer';
import casinoAccount from './reducers/casinoAccountReducer';
import casinoPlay from './reducers/casinoPlayReducer';
import lfg from './reducers/lfgReducer';
import ajaxStatus from './reducers/ajaxStatusReducer';
import externalWallet from './reducers/externalWalletReducer';
import offCanvasNav from './reducers/offCanvasNavReducer';
import drawings from './reducers/drawingReducer';
import lotteryData from './reducers/lotteryDataReducer';
import locale from './reducers/localeReducer';
import promotion from './reducers/promotionReducer';
import tags from './reducers/tagsReducer';
import account from './reducers/accountReducer';
import lts from './reducers/ltsReducer';
import loyalty from './reducers/loyaltyReducer';

const rootReducer = combineReducers({
    links,
    user,
    wallet,
    bank,
    paymentDetail,
    currency,
    language,
    transaction,
    casinoGames,
    casinoGamesFeatured,
    casinoVideoSlotGames,
    casinoLiveGames,
    casinoAccount,
    casinoPlay,
    lfg,
    tags,
    account,
    lts,
    ajaxStatus,
    externalWallet,
    offCanvasNav,
    drawings,
    lotteryData,
    locale,
    promotion,
    loyalty,
    routing: routerReducer
});

export default rootReducer;

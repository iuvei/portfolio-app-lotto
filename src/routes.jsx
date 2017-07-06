'use strict';

import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import configureStore, { history } from './store/configureStore';
import translate from './components/utils/translate';

//ui
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// layouts

import App from './components/App';
import HomePage from './components/HomePage';
//import LottoResults from './components/lottoresults/LottoResults';

// account components
import LoginRegister from './components/account/LoginRegister';
import AccountSettings from './components/account/AccountSettings';
import DepositWithdrawal from './components/account/DepositWithdrawal';
import MyAccountPage from './components/account/MyAccount/MyAccountPage';

import MyLottery from './components/account/MyLottery/';
import MyLotteryDetails from './components/account/MyLottery/MyLotteryDetails';

// LFG component
import LFGListing from './components/lfg/LFGListing';
import LFG from './components/lfg/LFG';
import LTS from './components/lfg/LTS';
import LFGCheckoutComplete from './components/lfg/LFGCheckoutComplete';

// RNG component
import RNG from './components/rng/RNG';

// HFG component
import HFG from './components/hfg/HFG';

// Scratchcards
import ScratchcardListing from './components/scratchcards/ScratchcardListing';

// Casino Games
// import CasinoGamesListing from './components/casino-games/CasinoGamesListing';

// Casino Games
// import CasinoPlay from './components/casino-play/CasinoPlay';

// Promotions
import PromotionList from './components/promotion/PromotionList';
import RedeemList from './components/promotion/RedeemList';
import PromotionDetails from './components/promotion/PromotionDetails';

//AboutUs
import AboutUsIndex from './components/aboutus/';

//FAQ
import FAQ from './components/faq/FAQ';

injectTapEventPlugin();

const hashLinkScroll = () => {
  const { hash } = window.location;
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}


export const renderRoutes = (
  <Provider store={configureStore}>
    <Router history={history} onUpdate={hashLinkScroll}>
      <Route path="/" component={App}>
        <IndexRoute component={translate('Home')(HomePage)}></IndexRoute>
        {/*<Route path="/lotto-results" component={LottoResults}></Route>*/}
        <Route path="/rng" component={translate('RNG')(RNG)}></Route>
        <Route path="/hfg" component={translate('HFG')(HFG)}></Route>
        <Route path="/lfg-listing" component={translate('LFG')(LFGListing)}></Route>
        <Route path="/lfg/:gameId" component={translate('LFG')(LFG)}></Route>
	<Route path="/lts/:gameId" component={translate('LFG')(LTS)}></Route>
        <Route path="/lfg-summary/:gameId" component={translate('LFG')(LFGCheckoutComplete)}></Route>
        {/* <Route path="/scratchcards" component={ScratchcardListing}></Route>
        <Route path="/casino-lobby" component={CasinoGamesListing}></Route>
        <Route path="/casino-play" component={CasinoPlay}></Route>*/}
        <Route path="/account-settings" component={translate('AccountSettings')(AccountSettings)}></Route>
        <Route path="/my-lottery" component={translate('MyLottery')(MyLottery)}></Route>
        {/* <Route path="/my-lottery-details/:ticketId/:betDate" component={MyLotteryDetails}></Route> */}
        <Route path="/my-account" component={translate('MyAccount')(MyAccountPage)}></Route>
        <Route path="/my-promotions" component={RedeemList}></Route>
        <Route path="/promotions" component={translate('Promotion')(PromotionList)}></Route>
        <Route path="/promotions/details" component={PromotionDetails}></Route>
        <Route path="/about(/:activeTab)" component={translate('AboutUs')(AboutUsIndex)}></Route>
        <Route path="/faq" component={translate('FAQ')(FAQ)}></Route>
      </Route>
    </Router>
  </Provider>
);

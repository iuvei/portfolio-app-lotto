import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as accountAction from '../actions/accountActions';
import * as userAction from '../actions/userActions';
import * as walletAction from '../actions/walletActions';
import * as transactionAction from '../actions/transactionActions';
import * as casinoGamesAction from '../actions/casinoGamesActions';
import * as casinoAccountAction from '../actions/casinoAccountActions';
import * as casinoPlayAction from '../actions/casinoPlayActions';
import * as lfgAction from '../actions/lfgActions';
import * as externalWalletAction from '../actions/externalWalletActions';
import * as offCanvasNavAction from '../actions/offCanvasNavActions';
import * as localeAction from '../actions/localeActions';
import * as tagAction from '../actions/tagActions';
import * as ltsAction from '../actions/ltsActions';

import Main from './Main';

const mapStateToProps = (state) => {
  return {
    links: state.links,
    user: state.user,
    wallet: state.wallet,
    language: state.language,
    transaction: state.transaction,
    casinoAccount: state.casinoAccount,
    casinoPlay: state.casinoPlay,
    // lfg: state.lfg,
    ajaxStatus: state.ajaxStatus,
    externalWallet: state.externalWallet,
    offCanvasNav: state.offCanvasNav,
    lotteryData: state.lotteryData,
    tags: state.tags
  };
};

const mapDispatchToProps = (dispatch) => ({
  accountAction: bindActionCreators(accountAction, dispatch),
  userAction: bindActionCreators(userAction, dispatch),
  walletAction: bindActionCreators(walletAction, dispatch),
  transactionAction: bindActionCreators(transactionAction, dispatch),
  casinoGamesAction: bindActionCreators(casinoGamesAction, dispatch),
  casinoAccountAction: bindActionCreators(casinoAccountAction, dispatch),
  casinoPlayAction: bindActionCreators(casinoPlayAction, dispatch),
  lfgAction: bindActionCreators(lfgAction, dispatch),
  externalWalletAction: bindActionCreators(externalWalletAction, dispatch),
  offCanvasNavAction: bindActionCreators(offCanvasNavAction, dispatch),
  localeAction: bindActionCreators(localeAction, dispatch),
  tagAction: bindActionCreators(tagAction, dispatch),
  ltsAction: bindActionCreators(ltsAction, dispatch)
});

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;

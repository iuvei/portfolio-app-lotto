import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import * as walletAction from '../../../actions/walletActions';
import * as externalWalletAction from '../../../actions/externalWalletActions';
import AccountStat from './AccountStat';
import Transaction from './Transaction';
import CashierPage from './Cashier';
import * as transactionAction from '../../../actions/transactionActions';
import * as loyaltyAction from '../../../actions/loyaltyActions';
import _ from 'lodash';
import cookie from 'react-cookie';

class MyAccountPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      token: cookie.load('access_token'),
      merchant_id: cookie.load('merchant_id'),
      transaction: this.props.transaction,
      transaction_page: 1,
      transaction_per_page: 10
    };

    this._handlePageClick = this._handlePageClick.bind(this);
    this._loadWalletDetails = this._loadWalletDetails.bind(this);
  }

  _getPaginatedItems(items, page) {
  	let _page = page || 1;
    let per_page = this.state.transaction_per_page;
  	let offset = (_page - 1) * per_page;
    return items.slice(offset, offset + per_page);
  }

  _handlePageClick = (data) => {
    this.setState({
      transaction_page: data.selected + 1
    })
  }
  _loadWalletDetails(){
      const {walletAction, externalWalletAction, loyaltyAction} = this.props;
      walletAction.findWallet(this.state.token, this.state.merchant_id);
      // externalWalletAction.loadExternalWallet();
      let user_id = this.props.wallet[0].user_id;
      loyaltyAction.findLoyalty(user_id);
  }

  componentWillMount() {
    const { token, merchant_id } = this.state;
    if (token == undefined || merchant_id == undefined){
      return browserHistory.push('/');
    }
    this.props.transactionAction.loadTransaction(token, merchant_id);
    this._loadWalletDetails();
  }

  render() {
    let { transaction, localeData } = this.props;
    const trans = Object.keys(transaction).map((key => {
      return transaction[key];
    }))
    let casinoBalance = this.props.casinoAccount.balance;
    let tx = {};
    let page_num = 1;
    if (trans.length != 0){
      page_num = Math.ceil(trans.length / this.state.transaction_per_page);
      tx = this._getPaginatedItems(trans, this.state.transaction_page);
    }
    return(
      <div>
      <header id="heading-title">
          <h1>{localeData['heading.title']}</h1>
      </header>
        <AccountStat wallet={this.props.wallet} casinoBalance={casinoBalance || 0} loyalty={this.props.loyalty} refresh={this._loadWalletDetails} localeData={localeData}/>
        <CashierPage wallet={this.props.wallet} refresh={this._loadWalletDetails} localeData={localeData}/>
        <Transaction transaction={tx} page_num={page_num} onPageClick={this._handlePageClick} localeData={localeData}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    transaction: state.transaction,
    wallet: state.wallet,
    loyalty: state.loyalty
  };
};

const mapDispatchToProps = (dispatch) => ({
  transactionAction: bindActionCreators(transactionAction, dispatch),
  walletAction: bindActionCreators(walletAction, dispatch),
  externalWalletAction: bindActionCreators(externalWalletAction, dispatch),
  loyaltyAction: bindActionCreators(loyaltyAction, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountPage);

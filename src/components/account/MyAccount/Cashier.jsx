'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { _getBreakpoint } from '../../utils/util';
import Icons from '../../icons/Icons';
import * as transactionAction from '../../../actions/transactionActions';
import * as externalWalletAction from '../../../actions/externalWalletActions';
import * as bankActions from '../../../actions/bankActions';
import _ from 'lodash';
import $ from 'jquery';
import config from '../../../../config';
import cookie from 'react-cookie';
import { default as showSweetAlert } from 'sweetalert2';
import { bindActionCreators } from 'redux';

const swalConfig = (title, subTitle, type) => {
  return {
    title: title,
    html: subTitle,
    type: type,
    confirmButtonColor: "#f3a71e"
  };
};

const banksListArr = [
  {
    id: 1,
    abbr: "2",
    wabbr: "2",
    image_file: "bank_ABC.png"
  },
  {
    id: 2,
    abbr: "BJRCB",
    image_file: "bank_BJRCB.png"
  },
  {
    id: 3,
    abbr: "8",
    wabbr: "8",
    image_file: "bank_BOB.png"
  },
  {
    id: 4,
    abbr: "3",
    wabbr: "3",
    image_file: "bank_BOC.png"
  },
  {
    id: 5,
    abbr: "5",
    wabbr: "5",
    image_file: "bank_BOCM.png"
  },
  {
    id: 6,
    abbr: "BOS",
    wabbr: "BOS",
    image_file: "bank_BOS.png"
  },
  {
    id: 7,
    abbr: "4",
    wabbr: "4",
    image_file: "bank_CCB.png"
  },
  {
    id: 8,
    abbr: "6",
    wabbr: "6",
    image_file: "bank_CEB.png"
  },
  {
    id: 9,
    abbr: "9",
    wabbr: "9",
    image_file: "bank_CGB.png"
  },
  {
    id: 10,
    abbr: "11",
    wabbr: "11",
    image_file: "bank_CIB.png"
  },
  {
    id: 11,
    abbr: "17",
    wabbr: "17",
    image_file: "bank_CITIC.png"
  },
  {
    id: 12,
    abbr: "12",
    wabbr: "12",
    image_file: "bank_CMB.png"
  },
  {
    id: 13,
    abbr: "16",
    wabbr: "16",
    image_file: "bank_CMSB.png"
  },
  {
    id: 14,
    abbr: "GDB",
    wabbr: "GDB",
    image_file: "bank_GDB.png"
  },
  {
    id: 15,
    abbr: "GNXS",
    image_file: "bank_GNXS.png"
  },
  {
    id: 16,
    abbr: "GZCB",
    image_file: "bank_GZCB.png"
  },
  {
    id: 17,
    abbr: "HKBEA",
    image_file: "bank_HKBEA.png"
  },
  {
    id: 18,
    abbr: "15",
    wabbr: "15",
    image_file: "bank_HXB.png"
  },
  {
    id: 19,
    abbr: "HCCB",
    wabbr: "HCCB",
    image_file: "bank_HZB.png"
  },
  {
    id: 20,
    abbr: "1",
    wabbr: "1",
    image_file: "bank_ICBC.png"
  },
  {
    id: 21,
    abbr: "SZPAB",
    wabbr: "SZPAB",
    image_file: "bank_PAB.png"
  },
  {
    id: 22,
    abbr: "14",
    wabbr: "14",
    image_file: "bank_PSBC.png"
  },
  {
    id: 23,
    abbr: "13",
    wabbr: "13",
    image_file: "bank_SDB.png"
  },
  {
    id: 24,
    abbr: "SHRCB",
    image_file: "bank_SHRCB.png"
  },
  {
    id: 15,
    abbr: "7",
    wabbr: "7",
    image_file: "bank_SPDB.png"
  },
  {
    id: 26,
    abbr: "10",
    wabbr: "10",
    image_file: "bank_PAB.png"
  }
];

class CashierPage extends Component {
  constructor (props) {
    super(props);

    this.cashWallet = _.find(this.props.wallet, {type: 'cash'});

    let _fName = '', _lName = '';
    let _fNameDisabled = false, _lNameDisabled = false;
    if (this.cashWallet) {
      // console.log(this.cashWallet);
      if (this.cashWallet.withdrawCount > 0) {
        _fName = this.props.user.info.given_name;
        _lName = this.props.user.info.family_name;
        _fNameDisabled = true;
        _lNameDisabled = true;
      }
    }

    this.state = {
      activeTab: '#tab1',
      windowWidth: window.innerWidth,
      token: cookie.load('access_token'),
      merchant_id: cookie.load('merchant_id'),
      paystar_id: config.paystar.id,
      gateway_id: '58ef51c05c677f296a17df03',
      account_id: '58ef528d5c677f296a17df04',
      paymentWithdrawPanel: 0,
      paymentDepositPanel: 0,
      creditAmount: 0,
      debitAmount: 0,
      creditBank: '',
      debitBank: '',
      firstName: _fName, //'',
      lastName: _lName, //'',
      isFNameDisabled: _fNameDisabled,
      isLNameDisabled: _lNameDisabled,
      accountNo: '',
      accountType: '',
      bankState: '',
      bankCity: '',
      bankBranch: '',
      depositEnable: false,
      withdrawalEnable: false
    };

    this.loyaltyWallet = _.find(this.props.wallet, {type: 'loyalty'});
    this._handleResize = this._handleResize.bind(this);
    this._handleChangeDepositIndex = this._handleChangeDepositIndex.bind(this);
    this._handleChangeWithdrawIndex = this._handleChangeWithdrawIndex.bind(this);

    this._handleFirstNameChange = this._handleFirstNameChange.bind(this);
    this._handleLastNameChange = this._handleLastNameChange.bind(this);

    this._handleAccountNoChange = this._handleAccountNoChange.bind(this);
    this._handleAccountTypeChange = this._handleAccountTypeChange.bind(this);
    this._handleBankBranchChange = this._handleBankBranchChange.bind(this);
    this._handleBankStateChange = this._handleBankStateChange.bind(this);
    this._handleBankCityChange = this._handleBankCityChange.bind(this);

    this._handleCreditAmountChange = this._handleCreditAmountChange.bind(this);
    this._handleDebitAmountChange = this._handleDebitAmountChange.bind(this);

    this._creditWallet = this._creditWallet.bind(this);
    this._debitWallet = this._debitWallet.bind(this);

  }

  componentDidMount(props) {
    this.setState({ activeTab: '#tab1' });
    this._loadBankList();
    window.addEventListener('resize', this._handleResize);

    $("#depBankListPreloader").show();
    document.getElementById("depBankListPreloader").classList.add("loading-pulse");
    $("#wdrawBankListPreloader").show();
    document.getElementById("wdrawBankListPreloader").classList.add("loading-pulse");
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bank.deposit !== nextProps.bank.deposit || nextProps.bank.deposit) {
      document.getElementById("depBankListPreloader").classList.remove("loading-pulse");
      $("#depBankListPreloader").hide();
    }
    if (this.props.bank.withdraw !== nextProps.bank.withdraw || nextProps.bank.withdraw) {
      document.getElementById("wdrawBankListPreloader").classList.add("loading-pulse");
      $("#wdrawBankListPreloader").hide();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _loadBankList() {
    this.props.dispatch(bankActions.loadBankList({gateway_id:this.state.gateway_id}));
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _handleTabClick (e) {
    e.preventDefault();

    let currentHrefValue = e.currentTarget.href;
    currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);

    this.setState({ activeTab: currentHrefValue });
  }


  _handleChangeDepositIndex (index) {
    this.setState({paymentDepositPanel: index});
  }
  _handleChangeWithdrawIndex (index) {
    this.setState({paymentWithdrawPanel: index});
  }

  _handleChangeDepositPanel (value, e) {
    this.setState({paymentDepositPanel: value});
  }
  _handleChangeWithdrawPanel (value, e) {
    this.setState({paymentWithdrawPanel: value});
  }

  _handleFirstNameChange (event, e){
    this.setState({firstName: event.target.value});
  }
  _handleLastNameChange (event, e){
    this.setState({lastName: event.target.value});
  }
  _handleCreditAmountChange(event){
    this.setState({creditAmount: event.target.value});
  }
  _handleDebitAmountChange(event){
    this.setState({debitAmount: event.target.value});
  }
  _handleAccountNoChange(event){
    this.setState({accountNo: event.target.value});
  }
  _handleAccountTypeChange(event){
    this.setState({accountType: event.target.value});
  }
  _handleBankBranchChange(event){
    this.setState({bankBranch: event.target.value});
  }
  _handleBankStateChange(event){
    this.setState({bankState: event.target.value});
  }
  _handleBankCityChange(event){
    this.setState({bankCity: event.target.value});
  }

  _showCreditBankList(){
    let banksList = [];
    let banks = this.props.bank;
    if(banks.deposit != null){
      banksListArr.map((bl, i) => {
        if (_.isArray(banks.deposit)) {
          banks.deposit.map((b, j) => {
            if (bl.abbr == b.bank_code) {
              banksList.push(
                <span className="bank-item" key={bl.id + "_credit"}>
                  <label htmlFor={bl.abbr+"_"+(i+1)} onClick={this._handleCreditBankSelectChange.bind(this, 'dep_bank_'+b.bank_code)} >
                    <input type="radio" id={bl.abbr+"_"+(i+1)} ref={'dep_bank_'+b.bank_code} name="bank" value={b.bank_code} onClick={this._handleCreditBankSelectChange.bind(this, 'dep_bank_'+b.bank_code)} />
                    <img className="bank-image" alt={bl.abbr} title={bl.abbr} src={"../../images/"+bl.image_file} />
                  </label>
                </span>
              );
            }
          });
        }
      });
    }
    return banksList;
  }

  _showDebitBankList(){
    let banksList = [];
    let banks = this.props.bank;
    if(banks.withdraw != null){
      banksListArr.map((bl, i) => {
        if (_.isArray(banks.withdraw)) {
          banks.withdraw.map((b, j) => {
            if (bl.wabbr == b.bank_code) {
              banksList.push(
                <span className="bank-item" key={bl.id}>
                  <label htmlFor={bl.wabbr+"_"+(i+1)} onClick={this._handleDebitBankSelectChange.bind(this, 'wdraw_bank_'+b.bank_code)} >
                    <input type="radio" id={bl.wabbr+"_"+(i+1)} ref={'wdraw_bank_'+b.bank_code} name="bank" value={b.bank_code} onClick={this._handleDebitBankSelectChange.bind(this, 'wdraw_bank_'+b.bank_code)} />
                    <img className="bank-image" alt={bl.abbr} title={bl.abbr} src={"../../images/"+bl.image_file} />
                  </label>
                </span>
              );
            }
          });
        }
      });
    }
    return banksList;
  }

  _getAvailableWallets(){
    let wallets = [];
    let _cashWallet = _.find(this.props.wallet, {type: 'cash'});
    let cashWallet;
    if(typeof _cashWallet != 'null' && typeof _cashWallet != 'undefined'){
      cashWallet = {
        id: _cashWallet._id,
        name: _cashWallet.type
      };
    }
    else
      cashWallet = {};

    wallets.push(cashWallet);

    return wallets;
  }

  _creditWallet (){
    const { token, paystar_id, merchant_id, creditAmount, creditBank } = this.state;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { localeData }=this.props;

    if (creditAmount > 10000){
      return showSweetAlert({
          title: localeData['cashier.prompt.depositTitle'],
          text: `${localeData['cashier.prompt.depositWarning1']} ${YUAN.unicode}10,000`,
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (creditAmount < 50){
      return showSweetAlert({
          title: localeData['cashier.prompt.depositTitle'],
          text: `${localeData['cashier.prompt.depositWarning2']} ${YUAN.unicode}50.00`,
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (creditAmount <= 0){
      return showSweetAlert({
          title: localeData['cashier.prompt.depositTitle'],
          text: localeData['cashier.prompt.depositWarning3'],
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentDepositPanel: 0});
        }.bind(this));
    }

    let data = {
      url: {
        callback: config.wallet.callback,
        success: config.lottoland,
        failure: config.lottoland,
        pending: config.lottoland
      },
      item: {
        order_id: "LL" + new Date().getTime(),
        code: creditBank + "Deposit",
        description: creditBank + " Deposit",
        quantity: 1
      },
      customer:{
        user_id: this.props.user.info.sub,
        username: this.props.user.info.preferred_username,
        first_name: this.props.user.info.given_name,
        last_name: this.props.user.info.family_name
      },
      payment: {
        currency: 'CNY',
        description: creditBank + " Deposit",
        channel: 'bank_transfer',
        amount: parseFloat(creditAmount),
        account_id: this.state.account_id,
        wallet_id: this.cashWallet._id,
        bank_code: creditBank
      }
    };
    this.setState({paymentDepositPanel: 2});
    this.props.dispatch(transactionAction.creditWallet(token, paystar_id, merchant_id, data, localeData));
    this.props.refresh();
  }

  _debitWallet (){
    const { token, paystar_id, merchant_id, debitAmount, debitBank } = this.state;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { localeData }=this.props;

    if (debitAmount > 50000){
      return showSweetAlert({
          title: localeData['cashier.prompt.withdrawalTitle'],
          text: `${localeData['cashier.prompt.withdrawalWarning1']} ${YUAN.unicode}50,000`,
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (debitAmount < 50){
      return showSweetAlert({
          title: localeData['cashier.prompt.withdrawalTitle'],
          text: `${localeData['cashier.prompt.withdrawalWarning2']} ${YUAN.unicode}50.00`,
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (debitAmount <= 0){
      return showSweetAlert({
          title: localeData['cashier.prompt.withdrawalTitle'],
          text: localeData['cashier.prompt.withdrawalWarning3'],
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (this.state.firstName.length <= 0) {
      return showSweetAlert({
          title: localeData['cashier.prompt.withdrawalTitle'],
          text: localeData['cashier.prompt.withdrawalWarning4'],
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (this.state.lastName.length <= 0) {
      return showSweetAlert({
          title: localeData['cashier.prompt.withdrawalTitle'],
          text: localeData['cashier.prompt.withdrawalWarning5'],
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    if (this.state.accountType.length <= 0) {
      return showSweetAlert({
          title: "提款交易...",
          text: "请选择帐户类型.",
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#f3a71e"
        }).then(function () {
          this.setState({paymentWithdrawPanel: 0});
        }.bind(this));
    }
    let data = {
      url:{
        failure: config.wallet.decline
      },
      customer: {
        user_id: this.props.user.info.sub,
        first_name: this.state.firstName,
        last_name: this.state.lastName
      },
      item: {
        order_id: "LL" + new Date().getTime()
      },
      payment: {
        currency: 'CNY',
        description: debitBank + ' withrawal',
        channel: 'bank_transfer',
        amount: parseFloat(debitAmount),
        account_id: this.state.account_id,
        wallet_id: this.cashWallet._id
      },
      bank: {
        code: debitBank,
        account_number: this.state.accountNo,
        account_type: this.state.accountType,
        state: this.state.bankState,
        city: this.state.bankCity,
        branch: this.state.bankBranch
      }
    };
    this.setState({paymentWithdrawPanel: 2});
    this.props.dispatch(transactionAction.debitWallet(token, paystar_id, merchant_id, data, localeData));
  }

  _handleCreditBankSelectChange (id, e) {
    if (!this.refs[id].checked) {
      $(this.refs[id]).prop("checked", true);
      this.setState({creditBank: this.refs[id].value});
      this.setState({depositEnable: true});
    }
  }
  _handleDebitBankSelectChange (id, e) {
    if (!this.refs[id].checked) {
      $(this.refs[id]).prop("checked", true);
      this.setState({debitBank: this.refs[id].value});
      this.setState({withdrawalEnable: true});
    }
  }

  render () {
    let tab1, tab2, availableWallets;
    if (this.props) {
      availableWallets = this._getAvailableWallets();
    }
    if (this.state.activeTab === '#tab1'){
      tab1 = 'active';
      tab2 = '';
    } else {
      tab1 = '';
      tab2 = 'active';
    }
    switch (this.state.activeTab) {
      case '#tab1':
        tab1 = 'active';
        tab2 = '';
        break;
      case '#tab2':
        tab1 = '';
        tab2 = 'active';
        break;
    }

    const brkPt = _getBreakpoint(this.state.windowWidth);
    let span3u12u, span4u12u, span6u12u, span8u12u, span9u12u, span3u6u, span4u4u;
    if (brkPt === 'XS' || brkPt === 'S') {
      span3u12u = '12u';
      span4u12u = '12u';
      span6u12u = '12u';
      span8u12u = '12u';
      span9u12u = '12u';
      span3u6u = '6u';
      span4u4u = "4u";
    } else {
      span3u12u = '12u';
      span4u12u = '4u';
      span6u12u = '6u';
      span8u12u = '8u';
      span9u12u = '9u';
      span3u6u = '3u';
      span4u4u = "4u";
    }

    const { ajaxStatus, localeData } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    const showDepositButton = (this.state.depositEnable == true) ? <button className="button special" onClick={this._handleChangeDepositPanel.bind(this, 1)}>{localeData['cashier.nextBtnLabel']}</button> : '';
    const showWithdrawalButton = (this.state.withdrawalEnable == true) ? <button className="button special" onClick={this._handleChangeWithdrawPanel.bind(this, 1)}>{localeData['cashier.nextBtnLabel']}</button> : '';

    let depositPayment = (
      <div className="black-box">
        <div className="box-title">
          <h3>{localeData['cashier.tab1.title']}</h3>
        </div>
        <hr />
        <div className="box-content">
          <div className="">
            <section id="bank-list" className={span8u12u}>
              <div id="depBankListPreloader"></div>
              {this._showCreditBankList()}
            </section>
            <section className={span4u12u+" form-container form-right"}>
              <div className="12u">
                <span className="currency-input">{localeData['input.amount']} {YUAN.unicode}&nbsp;<input type="number" className="form-control select" name="creditAmount" step="0.01" placeholder="0.00" value={this.state.creditAmount} onChange={this._handleCreditAmountChange}/></span>
                <div id="cc-form-action">
                  {showDepositButton}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );

    let withdrawalPayment = (
      <div className="black-box">
        <div className="box-title">
          <h3>{localeData['cashier.tab2.title']}</h3>
        </div>
        <hr />
          <div className="box-content">

            <div className="">
              <section id="bank-list" className={span8u12u}>
                <div id="wdrawBankListPreloader"></div>
                {this._showDebitBankList()}
              </section>
              <section className={span4u12u+" form-container form-right"}>
                <div className="12u">
                  <input type="text" placeholder={localeData['input.firstName']} alt="First Name" disabled={this.state.isFNameDisabled} value={this.state.firstName} onChange={this._handleFirstNameChange} />
                  <input type="text" placeholder={localeData['input.lastName']} alt="Last Name" disabled={this.state.isLNameDisabled} value={this.state.lastName} onChange={this._handleLastNameChange} />

                  <input type="text" placeholder={localeData['input.accountNumber']} alt="Account Number" value={this.state.accountNo} onChange={this._handleAccountNoChange} />
                  <select value={this.state.accountType} onChange={this._handleAccountTypeChange}>
                    <option value="" disabled>{localeData['select.accountType.option1']}</option>
                    <option value="0">{localeData['select.accountType.option2']}</option>
                    <option value="1">{localeData['select.accountType.option3']}</option>
                  </select>
                  <input type="text" placeholder={localeData['input.bankState']} alt="Bank State" value={this.state.bankState} onChange={this._handleBankStateChange} />
                  <input type="text" placeholder={localeData['input.bankCity']} alt="Bank City" value={this.state.bankCity} onChange={this._handleBankCityChange} />
                  <input type="text" placeholder={localeData['input.bankBranch']} alt="Bank Branch" value={this.state.bankBranch} onChange={this._handleBankBranchChange} />
                  <span className="currency-input">{localeData['input.amount']} {YUAN.unicode}&nbsp;<input type="number" className="form-control select" name="debitAmount" step="0.01" placeholder="0.00" value={this.state.debitAmount} onChange={this._handleDebitAmountChange}/></span>
                  <div id="cc-form-action">
                    {showWithdrawalButton}
                  </div>
                </div>
              </section>

            </div>
          </div>

      </div>
    );

    const paymentDepositDetails = (
      <section className="payment-panel" key="paymentDetails">
        <div className="black-box">
          <div className="box-title">
            <h3>{localeData['cashier.filloutPaymentInfo']}</h3>
          </div>
          <hr />
          <div className="box-content">
            <div className="">
              <div id="balance">{localeData['cashier.depositConfirmation'].replace('{amount}', `: ${YUAN.unicode} ${this.state.creditAmount}`)}</div>
              <div id="cc-form-action" className="">
                  <button className={`button special ${ajaxStatus.isLoading ? 'disabled': ''}`} onClick={this._creditWallet}>{localeData['cashier.withdrawalConfirmBtnLabel']}</button>
                  <button className="button" onClick={this._handleChangeDepositPanel.bind(this, 0)}>{localeData['cashier.backBtnLabel']}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

    const paymentWithdrawDetails = (
      <section className="payment-panel" key="paymentDetails">
        <div className="black-box">
          <div className="box-title">
            <h3>{localeData['cashier.filloutPaymentInfo']}</h3>
          </div>
          <hr />
          <div className="box-content">
            <div className="">
              <div id="balance">{localeData['cashier.depositConfirmation'].replace('{amount}', `: ${YUAN.unicode} ${this.state.debitAmount}`)} {/*您即将提取金额 : {YUAN.unicode} {this.state.debitAmount}*/}</div>
              <div id="cc-form-action" className="">
                  <button className={`button special ${ajaxStatus.isLoading ? 'disabled': ''}`} onClick={this._debitWallet}>{localeData['cashier.withdrawalConfirmBtnLabel']}</button>
                  <button className="button" onClick={this._handleChangeWithdrawPanel.bind(this, 0)}>{localeData['cashier.backBtnLabel']}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

    const depositInstructions = (
      <section className="payment-panel" key="instructionDetails">
        <div className="black-box">
          <div className="box-title">
            <h3>{localeData['cashier.instruction.title']}</h3>
          </div>
          <hr />
          <div className="box-content">
            <div id="balance">
              {localeData['cashier.instruction.depositLabel']}
            </div>
            <div id="balance">
              <a name="backDeposit" onClick={this._handleChangeDepositPanel.bind(this, 0)}>{localeData['cashier.instruction.backBtnLabel']}</a>
            </div>
          </div>
        </div>
      </section>
    );

    const withdrawalInstructions = (
      <section className="payment-panel" key="instructionDetails">
        <div className="black-box">
          <div className="box-title">
            <h3>{localeData['cashier.backBtnLabel']}</h3>
          </div>
          <hr />
          <div className="box-content">
            <div id="balance">
              {localeData['cashier.instruction.withdrawalLabel']}
            </div>
            <div id="balance">
              <a name="backWithdrawal" onClick={this._handleChangeWithdrawPanel.bind(this, 0)}>{localeData['cashier.instruction.backBtnLabel']}</a>
            </div>
          </div>
        </div>
      </section>
    );

    return (
        <section id="deposit-withdrawal">
            <section id="tab-section">
              <div className="tabs">
                <ul className="tab-links">
                  <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}>{localeData['cashier.tab1.title']}</a></li>
                  <li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}>{localeData['cashier.tab2.title']}</a></li>
                </ul>

                <div className="tab-content">
                  <div id="tab1" className={`tab ${tab1}`}>
                    <div className="deposit">
                      <div className="row 50% cc-info">
                        <SwipeableViews key="swipableView" index={this.state.paymentDepositPanel} onChangeIndex={this._handleChangeDepositIndex} className={span3u12u+" payment-panels"}>
                          {depositPayment}
                          {paymentDepositDetails}
                          {depositInstructions}
                        </SwipeableViews>
                      </div>
                    </div>
                  </div>

                  <div id="tab2" className={`tab ${tab2}`}>
                    <div className="withdrawal">
                      <div className="row 50% cc-info">
                        <SwipeableViews key="swipableView" index={this.state.paymentWithdrawPanel} onChangeIndex={this._handleChangeWithdrawIndex} className={span3u12u+" payment-panels"}>
                          {withdrawalPayment}
                          {paymentWithdrawDetails}
                          {withdrawalInstructions}
                        </SwipeableViews>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
        </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    wallet: state.wallet,
    bank: state.bank,
    currency: state.currency,
    casinoAccount: state.casinoAccount,
    ajaxStatus: state.ajaxStatus
  };
};


export default connect(mapStateToProps)(CashierPage);

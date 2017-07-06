'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import { _getBreakpoint } from '../utils/util';
import Icons from '../icons/Icons';

export default class DepositWithdrawal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: '#tab1',
      windowWidth: window.innerWidth,
      deposit_selectedAmt: true,
      wallet: Object.assign({}, this.props.wallet)
    };

    this._handleResize = this._handleResize.bind(this);
  }

  componentDidMount() {
    this.setState({ activeTab: '#tab1' });
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
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

  _handleSelectedAmount (e) {
    e.preventDefault();

    switch (e.currentTarget) {
      case this.refs.dep_amt1:
        this.refs.dep_amt1.classList.toggle('selected');
        break;
      case this.refs.dep_amt2:
        this.refs.dep_amt2.classList.toggle('selected');
        break;
      case this.refs.dep_amt3:
        this.refs.dep_amt3.classList.toggle('selected');
        break;
      case this.refs.dep_amt4:
        this.refs.dep_amt4.classList.toggle('selected');
        break;
      case this.refs.wdraw_amt1:
        this.refs.wdraw_amt1.classList.toggle('selected');
        break;
      case this.refs.wdraw_amt2:
        this.refs.wdraw_amt2.classList.toggle('selected');
        break;
      case this.refs.wdraw_amt3:
        this.refs.wdraw_amt3.classList.toggle('selected');
        break;
      case this.refs.wdraw_amt4:
        this.refs.wdraw_amt4.classList.toggle('selected');
        break;
    }
  }

  render () {
    let tab1, tab2;
    if (this.state.activeTab === '#tab1'){
      tab1 = 'active';
      tab2 = '';
    } else {
      tab1 = '';
      tab2 = 'active';
    }

    const brkPt = _getBreakpoint(this.state.windowWidth);
    let span3u12u, span4u12u, span6u12u, span8u12u, span9u12u, span3u6u;
    if (brkPt === 'XS' || brkPt === 'S') {
      span3u12u = '12u';
      span4u12u = '12u';
      span6u12u = '12u';
      span8u12u = '12u';
      span9u12u = '12u';
      span3u6u = '6u';
    } else {
      span3u12u = '3u';
      span4u12u = '4u';
      span6u12u = '6u';
      span8u12u = '8u';
      span9u12u = '9u';
      span3u6u = '3u';
    }

    return (
      <div>
        <header id="heading-title">
          <h1>我的帳戶</h1>
        </header>

        <section id="account-stats">
          <div className="section">
            <div id="games-played" className="gray-box">
              <div className="box-title">
                <h3>免費遊戲次數</h3>
              </div>
              <hr />
              <div className="box-content">
                <div className="align-center"><h2>0 次</h2></div>
              </div>
            </div>
            <div id="proposed-bonus" className="gray-box">
              <div className="box-title">
                <h3>可提出獎金</h3>
              </div>
              <hr />
              <div className="box-content">
                <div className="align-center"><h2>$ 10000</h2></div>
              </div>
            </div>
            <div id="available-balance" className="gray-box">
              <div className="box-title">
                <h3>可用餘額</h3>
              </div>
              <hr />
              <div className="box-content">
                <div className="align-center"><h2>$ {this.state.wallet.balance}</h2></div>
              </div>
            </div>
          </div>
        </section>

        <section id="deposit-withdrawal">
          <div className="section group">
            <div className="12u">
              <section id="tab-section">
                <div className="tabs">
                  <ul className="tab-links">
                    <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}>儲值</a></li>
                    <li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}>取款</a></li>
                  </ul>
                  <div className="tab-content">
                    <div id="tab1" className={`tab ${tab1}`}>
                      <div className="deposit">
                        <div className="row 25%">
                          <div className={span3u6u}>
                            <div ref="dep_amt1" className="amount-box" onClick={this._handleSelectedAmount.bind(this)}><h2>$ 100</h2></div>
                          </div>
                          <div className={span3u6u}>
                            <div ref="dep_amt2" className="amount-box" onClick={this._handleSelectedAmount.bind(this)}><h2>$ 500</h2></div>
                          </div>
                          <div className={span3u6u}>
                            <div ref="dep_amt3" className="amount-box" onClick={this._handleSelectedAmount.bind(this)}><h2>$ 1000</h2></div>
                          </div>
                          <div className={span3u6u}>
                            <div ref="dep_amt4" className="amount-box" onClick={this._handleSelectedAmount.bind(this)}><span className="amount-input"><h2>$&nbsp;</h2><input type="text" id="depositAmount" placeholder="0.00" /></span></div>
                          </div>
                        </div>
                        <div className="row 50% cc-info">
                          <section className={span3u12u}>
                            <div className="black-box">
                              <div className="box-title">
                                <h3>選擇付款方式</h3>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="VISA" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">VISA</span>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="MASTERCARD" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">MasterCard</span>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="ALIPAY" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">支付宝</span>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="WECHATPAY" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">微信支付</span>
                              </div>
                            </div>
                          </section>
                          <section className={span9u12u}>
                            <div className="black-box">
                              <div className="box-title">
                                <h3>填寫付款資訊</h3>
                              </div>
                              <hr />
                              <div className="box-content">
                                <div className="row 50%">
                                  <section id="cc-form" className={span6u12u}>
                                    <div className="row 25%">
                                      <section className={span8u12u}>
                                        <span className="input-label">持卡人姓名</span>
                                        <input type="text" name="cc-name" id="cc-name" placeholder="Cardholder Name" />
                                      </section>
                                      <section className={span4u12u}>
                                        <span className="input-label">卡片到期日</span>
                                        <input type="text" name="cc-ed-mm" id="cc-ed-mm" placeholder="" className="small" />&nbsp;/&nbsp;
                                        <input type="text" name="cc-ed-yy" id="cc-ed-yy" placeholder="" className="small" />
                                      </section>
                                    </div>
                                    <div className="row 25%">
                                      <section className={span8u12u}>
                                        <span className="input-label">卡片號碼</span>
                                        <input type="text" name="cc-number" id="cc-number" placeholder="Card Number" />
                                      </section>
                                      <section className={span4u12u}>
                                        <span className="input-label">CVV&nbsp;&nbsp;<span className="icon fa-info-circle"></span></span>
                                        <input type="text" name="cc-cvv" id="cc-cvv" placeholder="" />
                                      </section>
                                    </div>
                                  </section>
                                </div>
                                <div className="row">
                                  <div id="cc-form-action" className={span3u12u}>
                                    <div id="balance">金額 : $500</div>
                                    <div id="confirm-button">
                                      <button className="button special">確認取款</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>

                    <div id="tab2" className={`tab ${tab2}`}>
                      <div className="withdrawal">
                        <div className="row 25%">
                          <section className={span3u6u}>
                            <div className="amount-box" ref="wdraw_amt1" onClick={this._handleSelectedAmount.bind(this)}><h2>$ 100</h2></div>
                          </section>
                          <section className={span3u6u}>
                            <div className="amount-box" ref="wdraw_amt2" onClick={this._handleSelectedAmount.bind(this)}><h2>$ 500</h2></div>
                          </section>
                          <section className={span3u6u}>
                            <div className="amount-box" ref="wdraw_amt3" onClick={this._handleSelectedAmount.bind(this)}><h2>$ 1000</h2></div>
                          </section>
                          <section className={span3u6u}>
                            <div className="amount-box" ref="wdraw_amt4" onClick={this._handleSelectedAmount.bind(this)}><span className="amount-input"><h2>$&nbsp;</h2><input type="text" id="depositAmount" placeholder="0.00" /></span></div>
                          </section>
                        </div>
                        <div className="row 50% cc-info">
                          <section className={span3u12u}>
                            <div className="black-box">
                              <div className="box-title">
                                <h3>選擇付款方式</h3>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="SKRILL" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">Skrill</span>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="BANK" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">銀行匯款</span>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="ALIPAY" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">支付宝</span>
                              </div>
                              <hr />
                              <div className="box-content cc-options">
                                <Icons iconType="WECHATPAY" fill="#fff" className="icon svg-icon medium" />
                                <span className="cc-label">微信支付</span>
                              </div>
                            </div>
                          </section>
                          <section className={span9u12u}>
                            <div className="black-box">
                              <div className="box-title">
                                <h3>填寫付款資訊</h3>
                              </div>
                              <hr />
                              <div className="box-content">
                                <div className="row 50%">
                                  <section id="bank-form" className={span8u12u}>
                                    <div className="row 25%">
                                      <section className={span4u12u}>
                                        <span className="input-label">銀行持卡人完整姓名</span>
                                        <input type="text" name="bank-account-name" id="bank-account-name" placeholder="Bank Account Name" />
                                      </section>
                                      <section className={span4u12u}>
                                        <span className="input-label">分行名稱</span>
                                        <input type="text" name="bank-branch" id="bank-branch" placeholder="Branch Name" />
                                      </section>
                                      <section className={span4u12u}>
                                        <span className="input-label">銀行帳戶號碼</span>
                                        <input type="text" name="bank-account-number" id="bank-account-number" placeholder="Bank Account No."/>
                                      </section>
                                    </div>
                                    <div className="row 25%">
                                      <section className={span4u12u}>
                                        <span className="input-label">銀行名稱</span>
                                        <input type="text" name="bank-name" id="bank-name" placeholder="Bank Name"/>
                                      </section>
                                      <section className={span4u12u}>
                                        <span className="input-label">銀行地址</span>
                                        <input type="text" name="bank-address" id="bank-address" placeholder="Bank Address" />
                                      </section>
                                      <section className={span4u12u}>
                                        <span className="input-label">登錄密碼</span>
                                        <input type="password" name="login-password" id="login-password" />
                                      </section>
                                    </div>
                                  </section>
                                </div>
                                <div className="row">
                                  <div id="cc-form-action" className={span3u12u}>
                                    <div id="balance">金額 : $500</div>
                                    <div id="confirm-button">
                                      <button className="button special">確認付款</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="transactions-history">
          <div className="section group">
            <div id="games-played" className="gray-box">
              <div className="box-title">
                <h3>交易紀錄</h3>
                <span className="pull-right"><a href="#"><Icons iconType="ARROW_UP" fill="#b5d264" className="icon svg-icon medium" /></a></span>
              </div>
              <hr />
              <div className="box-content">
                <div className="transactions-table">
                  <table>
                    <thead>
                      <tr>
                        <th>交易日期</th><th>交易內容</th><th>交易方式</th><th>交易金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><a href="#">2016/n/n xx:xx</a></td><td>玩了 2 張 EuroJackpot</td><td>花費</td><td>-$ nnn 元</td>
                      </tr>
                      <tr>
                        <td><a href="#">2016/n/n xx:xx</a></td><td>玩了 2 張 EuroJackpot</td><td>花費</td><td>-$ nnn 元</td>
                      </tr>
                      <tr>
                        <td><a href="#">2016/n/n xx:xx</a></td><td>玩了 2 張 EuroJackpot</td><td>花費</td><td>-$ nnn 元</td>
                      </tr>
                      <tr>
                        <td><a href="#">2016/n/n xx:xx</a></td><td>玩了 2 張 EuroJackpot</td><td>花費</td><td>-$ nnn 元</td>
                      </tr>
                      <tr>
                        <td><a href="#">2016/n/n xx:xx</a></td><td>玩了 2 張 EuroJackpot</td><td>花費</td><td>-$ nnn 元</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="pull-right"><a href="#">更舊的紀錄</a></div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    )
  }
}

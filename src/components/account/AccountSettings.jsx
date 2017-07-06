'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as accountAction from '../../actions/accountActions';

import { _getBreakpoint } from '../utils/util';

class AccountSettings extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: '#tab1',
      windowWidth: window.innerWidth,
      user: Object.assign({}, this.props.user.info)
    };

    this._handleResize = this._handleResize.bind(this);
    this._updateUserState = this._updateUserState.bind(this);
    this._updateInfo = this._updateInfo.bind(this);
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

  _updateUserState(event){
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    this.setState({user: user});
  }

  _handleTabClick (e) {
    e.preventDefault();

    let currentHrefValue = e.currentTarget.href;
    currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);

    this.setState({ activeTab: currentHrefValue });
  }

  _updateInfo () {
    let data = {
      user_id: this.state.user.sub,
      // family_name: this.state.user.family_name,
      // given_name: this.state.user.given_name,
      email: this.state.user.email,
      merchant_id: this.state.user.merchant_id
    }
    this.props.accountAction.updateUserInfo(data);
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
    let span3u12u,span4u12u, span6uHide, span9u12u, span3u6u_btn;
    if (brkPt === 'XS' || brkPt === 'S') {
      span3u12u = '12u';
      span4u12u ='12u';
      span6uHide = 'hide-on-mobile';
      span9u12u = '12u';
      span3u6u_btn = '6u';
    } else {
      span3u12u = '3u';
      span4u12u ='4u';
      span6uHide = '6u';
      span9u12u = '9u';
      span3u6u_btn = '3u';
    }

    const { ajaxStatus, localeData } = this.props;

    return (
      <div>
        <header id="heading-title">
          <h1>{localeData['heading.title']}</h1>
        </header>

        <section id="account-settings">
          <div className="section group">
            <div className="12u">
              <section id="tab-section">
                <div className="tabs">
                  <ul className="tab-links">
                    <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}>{localeData['acctSetting.tab1.title']}</a></li>
                    {/*<li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}>{localeData['acctSetting.tab2.title']}</a></li>*/}
                  </ul>
                  <div className="tab-content">
                    <div id="tab1" className={`tab ${tab1}`}>
                      <div className="profile">
                        <form method="post" action="#">
                          <div className="row 50%">

                            <section className={span4u12u}>
                              <span className="input-label">{localeData['tab1.username']}</span> <br />
                              <div style={{height:'.7em'}}>{this.state.user.preferred_username}</div><br />
                              {/*<input type="text" name="username" id="username" value={this.state.user.preferred_username} readOnly/>*/} {/* Username */}

                              <span className="input-label">{localeData['tab1.email']}</span>
                              <input type="email" name="email" id="email" value={this.state.user.email} onChange={this._updateUserState}/> {/* Email Address */}
                           
                              </section>

                            <section className={span4u12u}>
                              <span className="input-label">{localeData['tab1.firstName']}</span>
                              <div style={{height:'.7em'}}>{this.state.user.given_name}</div><br />
                              {/*<input type="text" name="given_name" id="firstname" value={this.state.user.given_name} onChange={this._updateUserState}/>*/} {/* First Name */}

                              <span className="input-label">生日日期</span>
                              <div style={{height:'.7em'}}>&nbsp;</div><br />
                              {/*<input type="text" id="birth-date" name="birth-date"  placeholder="生日日期"  onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'"/>*/}
                            
                            </section>

                            <section className={span4u12u}>
                              <span className="input-label">{localeData['tab1.lastName']}</span>
                              <div style={{height:'.7em'}}>{this.state.user.family_name}</div><br />
                              {/*<input type="text" name="family_name" id="lastname" value={this.state.user.family_name} onChange={this._updateUserState}/>*/} {/* Last Name */}
                               {/* <span className="input-label">詳細地址</span>
                                                            <input type="text" name="fulladdress" id="fulladdress" />*/} {/* Full Address */}

                             {/* <span className="input-label">鄉鎮市</span>
                                                            <input type="text" name="city" id="city" />*/} {/* City */}
                              <span>&nbsp;</span>
                              <div>&nbsp;</div>
                              <input type="button" value={localeData['tab2.saveBtnLabel']} className={`fit green ${ajaxStatus.isLoading ? 'disabled': ''}`}  onClick={this._updateInfo}/>
                            </section>

                           {/* <section className={span3u12u}>*/}
                             {/* <span className="input-label">省份</span>
                                                           <input type="text" name="province" id="province" /> */}{/* Province */}

                              {/*<span className="input-label">郵遞區號</span>
                                                            <input type="text" name="postalcode" id="postalcode" /> */}{/* Postal Code */}
                              
                           {/* </section>*/}

                            {/*  <span className="input-label">性別</span>
                              <div className="select-wrapper">
                                <select name="gender" id="gender">
                                  <option value="">Select Gender</option>
                                  <option value="male">男</option>
                                  <option value="female">女</option>
                                </select>
                              </div>
                              <span className="input-label">生日</span>
                              <input type="text" name="birthdate" id="birthdate" placeholder="Birth Date" />
                            <section className={span3u12u}>
                              <span className="input-label">國籍</span>
                              <input type="text" name="nationality" id="nationality" placeholder="Nationality"/>
                              <span className="input-label">省份</span>
                              <div className="select-wrapper">
                                <select name="province" id="province">
                                  <option value="">Select Province</option>
                                  <option value="">湖南省</option>
                                </select>
                              </div>
                              <span className="input-label">鄉鎮市</span>
                              <div className="select-wrapper">
                                <select name="city" id="city">
                                  <option value="">Select Town/City</option>
                                  <option value="">XX 市</option>
                                </select>
                              </div>
                              <span className="input-label">詳細地址</span>
                              <input type="text" name="fulladdress" id="fulladdress" placeholder="Full Address" />
                              <span className="input-label">郵遞區號</span>
                              <input type="text" name="zipcode" id="zipcode" placeholder="Zip Code" />
                            </section>
                            <section className={span3u12u}>

                              <span className="input-label">備用 Email</span>
                              <input type="email" name="altemail" id="altemail" placeholder="Alternate Email Address" />
                              <span className="input-label">手機號碼</span>
                              <input type="text" name="mobilenumber" id="mobilenumber" placeholder="Mobile Number" />
                            </section>
                            <section className={span3u12u}>
                              <span className="input-label">會員編號</span>
                              <input type="text" name="accountnumber" id="accountnumber" placeholder="Account Number" />
                              <span className="input-label">密碼</span>
                              <input type="password" name="accountpassword" id="accountpassword" placeholder="Password" />
                            </section> */}
                          </div>

                        </form>
                      </div>
                    </div>

                    {/*<div id="tab2" className={`tab ${tab2}`}>
                                          <div className="settings">
                                            <form method="post" action="#">
                                              <div className="row 50%">
                                                <section className={span3u12u}>帳號狀態 xxxxx ...</section>
                                                <section className={span3u12u}>
                                                  <h4>Email 通知設定 :</h4>
                                                  <p>Email 完整通知 <br/> 將收到所有來自 Lottoland 的通知信件 , 包含廣告 、 投注品項之開獎結果 ...</p>
                                                </section>
                                                <section className={span3u12u}>
                                                  <h4>投注限額設定 :</h4>
                                                  <p>無投注限額</p>
                                                </section>
                                                <section className={span3u12u}>
                                                </section>
                                              </div>
                                              <div className="row 50%">
                                                <section className={span3u6u_btn}>
                                                  <input type="button" value="刪除帳號" className="fit red" />
                                                </section>
                                                <section className={span6uHide}>&nbsp;</section>
                                                <section className={span3u6u_btn}>
                                                  <input type="submit" value="變更" className="fit green" />
                                                </section>
                                              </div>
                                            </form>
                                          </div>
                                        </div>*/}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  accountAction: bindActionCreators(accountAction, dispatch)
});

export default connect(null,mapDispatchToProps)(AccountSettings);

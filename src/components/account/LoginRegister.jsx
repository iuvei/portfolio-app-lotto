'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import { populateCountries } from '../utils/countries';
// import ReactPickadate from '../utils/ReactPickadate.react';

export default class LoginRegister extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: '#tab1',
      login: {
        email: 'User1@company.com',
        password: 'User1'
      }
    };
  }

  componentDidMount() {
    this.setState({ activeTab: '#tab1' });

    const country = document.getElementById("country");
    populateCountries(country);
  }

  _handleTabClick (e) {
    e.preventDefault();

    let currentHrefValue = e.currentTarget.href;
    currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);

    this.setState({ activeTab: currentHrefValue });
  }

  _handleEmailChange(e) {
    this.setState({
      login: {
        email: this.refs.email.value,
        password: this.refs.password.value
      }
    });
  }

  _handleLoginSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.value;
    let password = this.refs.password.value;
    let name = email.substr(0, email.indexOf('@'));
    console.log("username:",email);
    console.log("name:",name);

    const { userInfo } = this.props;

    //set username to sessionStorage
    // if (!userInfo.name) {
    //   this.props.setUserName(name);
    // }

    this.props.closeModal();

    alert(`Hello, ${name}!\nWelcome to LottoLand Asia!`);

    // let { isLoggedIn } = this.props;
    // isLoggedIn = true;
    this.props.login(name);
    // Update header, show logged-in user name in the top corner
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

    return (
      <div>
        <section id="tab-section">
          <div className="tabs">

            <ul className="tab-links login">
              <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}>登入</a></li>
              <li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}>注册</a></li>
            </ul>

            <div className="tab-content">
              <div id="tab1" className={`tab ${tab1}`}>
                <div id="loginForm">
                  <form method="post" action="#" onSubmit={this._handleLoginSubmit.bind(this)}>
                    <span className="input-label">Email / 帳號</span>
                    <input type="email" name="email" ref="email" placeholder="Your Email Address" value={this.state.login.email} onChange={this._handleEmailChange.bind(this)} />
                    <span className="input-label">密碼</span>
                    <input type="password" name="password" ref="password" placeholder="Your Password" value={this.state.login.password} onChange={this._handleEmailChange.bind(this)} />
                    <span className="align-right"><a href="#">忘記密碼 ?</a></span>
                    <input type="submit" value="登入" className="fit special" />
                  </form>
                </div>
              </div>

              <div id="tab2" className={`tab ${tab2}`}>
                <div id="registerForm">
                  <form method="post" action="#">
                    <span className="input-label">Email / 帳號</span>
                    <input type="email" name="email" id="email" placeholder="Your Email Address" />
                    <span className="input-label">登入密碼</span>
                    <input type="password" name="password" id="password" placeholder="Your Password" />
                    <span className="input-label">姓氏</span>
                    <input type="text" name="lastName" id="lastName" placeholder="" />
                    <span className="input-label">名字</span>
                    <input type="text" name="firstName" id="firstName" placeholder="" />
                    <span className="input-label">性別</span>
                    <div className="select-wrapper">
                      <select name="gender" id="gender">
                        <option value="">Select Gender</option>
                        <option value="male">男</option>
                        <option value="female">女</option>
                      </select>
                    </div>
                    <span className="input-label">生日</span>
                    <input type="text" name="birthdate" id="birthdate" className="datepicker" placeholder="" value="" />
                    {/*<ReactPickadate value={""}/>*/}
                    <span className="input-label">國籍</span>
                    <div className="select-wrapper">
                      <select name="country" id="country"></select>
                    </div>
                    <input type="submit" value="登入" className="special" />
                  </form>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    )
  }
}

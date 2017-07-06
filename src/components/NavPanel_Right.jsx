'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';

import Icons from './icons/Icons';

const rightNavLinks = [
  {
    id: "my-account",
    url: "/my-account",
    text: "存款 / 提款",
    iconType: 'DEPOSIT_WITHDRAWAL'
  },
  {
    id: "account-settings",
    url: "/account-settings",
    text: "會員資料",
    iconType: 'ACCOUNT'
  },
  {
    id: "my-lottery",
    url: "/my-lottery",
    text: "我的彩券",
    iconType: 'MY_LOTTERY'
  }
  // {
  //   id: "promotions",
  //   url: "/promotions",
  //   text: "促销",
  //   iconType: 'PROMOTIONS'
  // }
];

export default class NavPanel_Right extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isRightNavVisible: props.isRightNavVisible
    };

    this._toggleRightNavPanel = this._toggleRightNavPanel.bind(this);
    this._logOutUser = this._logOutUser.bind(this);
  }

  _toggleRightNavPanel (event) {
    // event.preventDefault();

    // this.setState({ isRightNavVisible: false });
    // this.props.toggleRightNavMenu(false);
    const { offCanvasNav, offCanvasNavAction } = this.props;
    offCanvasNavAction.toggleRightNav(offCanvasNav.toggleRightNavVisible);
  }

  _logOutUser() {
    // const { userInfo } = this.props;

    // this.props.logout('');
    const { offCanvasNav, offCanvasNavAction } = this.props;
    offCanvasNavAction.toggleRightNav(offCanvasNav.toggleRightNavVisible);
    // this.setState({ isRightNavVisible: false });
    // this.props.toggleRightNavMenu(false);

    // console.log("User "+userInfo.name+" successfully logged out.");
    cookie.remove('access_token');
    cookie.remove('merchant_id');
    cookie.remove('id_token');
    this.props.keycloak.logout();

  }

  render () {
    let links = [];
    rightNavLinks.map((link, i) => {
      links.push(
        <Link key={link.id} className="link depth-0" to={link.url} onClick={this._toggleRightNavPanel}><span className="indent-0"></span><Icons iconType={link.iconType} fill="#ccc" className="icon svg-icon" /><span className="linkText">{link.text}</span></Link>
      );
    });
    let liveChatLink = "";
    if (document.getElementById("lhc_status_container")) {
      liveChatLink = document.getElementById("lhc_status_container").innerHTML;
      links.push(<span key="live-chat" id="live-chat-link" dangerouslySetInnerHTML={{__html: liveChatLink}}></span>);
    }
    links.push(
      <Link key="logout" className="link depth-0" to="/" onClick={this._logOutUser}><span className="indent-0"></span><Icons iconType="LOGOUT" fill="#ccc" className="icon svg-icon" /><span className="linkText">登出</span></Link>
    );

    const { user, wallet } = this.props;
    let balance = 0;
    let cashWallet = _.find(wallet, {type: 'cash'});
    if (!_.isEmpty(cashWallet)){
      balance = cashWallet.balance.toLocaleString();
    }
    let acctBalance = '';
    if (user.isLoggedIn) { // user is logged-in
      acctBalance = (<div className="accountBalance">账户余额: <strong>¥{balance}</strong></div>);
    }

    return (
      <div id="navPanel-right">
        {acctBalance}
        <nav>
          {links}
        </nav>
      </div>
    )
  }
}

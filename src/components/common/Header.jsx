'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';

import LoginRegister from '../account/LoginRegister';
import Icons from '../icons/Icons';

import lottoLandLogo from '../../../public/images/ll-logo.svg'; //logo_lottoland.png
import _ from 'lodash';
import cookie from 'react-cookie';
import config from '../../../config';
import translate from '../utils/translate';

class Header extends Component {
  constructor (props) {
    super(props);

    // this.state = {
    //   modalIsOpen: false
    // };

    this._loginUser = this._loginUser.bind(this);
    // this._closeModal = this._closeModal.bind(this);
    this._logout = this._logout.bind(this);
    this._accountManagement = this._accountManagement.bind(this);
  }

  _loginUser(e) {
    e.preventDefault();

    // console.log(window.location.pathname);

    this.props.keycloak.login({ redirectUri: config.lottoland+window.location.pathname });
    // this.setState({modalIsOpen: true});
  }

  _afterOpenModal() {}

  // _closeModal() {
  //   this.setState({modalIsOpen: false});
  // }

  _logout() {
    cookie.remove('access_token');
    cookie.remove('merchant_id');
    cookie.remove('id_token');
    this.props.keycloak.logout({ redirectUri: window.location.origin });
  }

  _accountManagement() {
    this.props.keycloak.accountManagement();
  }

  render () {
    const { links, user, wallet, localeData } = this.props;
    let balance = 0;
    let cashWallet = _.find(wallet, {type: 'cash'});
    if (!_.isEmpty(cashWallet)){
      balance = cashWallet.balance.toLocaleString();
    }
    let loginHTML = '';
    if (user.isLoggedIn) { // user is logged-in
      loginHTML = (
          <li key={links.length+1} className="">
            <Link key="LOGIN" to="/my-account" className="green caret"><Icons iconType="" fill="#fff" className="svg-icon" />{localeData['accountBalance']}: ¥{balance}</Link>
            <ul>
              <li><Link to="/my-account">{localeData['acctMenu.myAccount']}</Link></li> {/* deposit/withdrawal */}
              <li><Link to="/account-settings">{localeData['acctMenu.accountSettings']}</Link></li> {/* acct info */}
              <li><Link to="/my-lottery">{localeData['acctMenu.myLottery']}</Link></li> {/* my lotteries */}
              {/*<li><Link to="/my-promotions">{localeData['acctMenu.myPromotions']}</Link></li>*/} {/* my promotions */}
              <li><Link to="/" onClick={this._logout}>{localeData['acctMenu.logout']}</Link></li> {/* logout */}
            </ul>
          </li>
        );
    } else {
      loginHTML = (
          <li key={links.length+1} className="">
            <Link key="LOGIN" to="/" className="green" onClick={this._loginUser}>登入 / 注册</Link>
          </li>
        );
    }

    return (
      <header id="header">
        <h1 id="logo"><Link to="/"><img src={lottoLandLogo} /></Link></h1>
        { /* <span className="slogan">Slogan Here</span> */ }
        <nav id="nav">
          <ul>
          {links.map((link, i) => (
            <li key={link.id} className={link.special || "nav-special"} >
              <Link key={link.key} to={link.url} className={link.hasSubMenu && "caret"}>{(link.key == "LFG") ? localeData['navLink.LFG'] :(link.key == "HFG") ? localeData['navLink.HFG'] : (link.key == "RNG") ? localeData['navLink.RNG'] : (link.key == "FAQ") ? localeData['navLink.FAQ'] : link.text}</Link>
              { link.hasSubMenu &&
                <ul>
                  {link.subMenu.map((sm, j) => (
                    <li key={sm.id}>
                      <Link key={sm.key} to={sm.url} >{sm.text}</Link>
                    </li>
                  ))}
                </ul>
              }
            </li>
            )
          )}
          {loginHTML}
          </ul>
        </nav>

        {/*<Modal
          ref="modalCS"
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this._afterOpenModal}
          onRequestClose={this._closeModal}
          className="modal-container login"
          overlayClassName="modal-overlay" >

            <div className="modal-header">
              <span className="close" onClick={this._closeModal}>×</span>
              <h3></h3>
            </div>
            <div className="modal-body">
              <LoginRegister closeModal={this._closeModal} {...this.props} />
            </div>

        </Modal>*/}
      </header>
    )
  }
}

Header.propTypes = {
  strings: React.PropTypes.object,
  localeData: React.PropTypes.object,
}

export default translate('Links')(Header);
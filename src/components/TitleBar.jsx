'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';
import Icons from './icons/Icons';
import LoginRegister from './account/LoginRegister';

import lottoLandLogo from '../../public/images/ll-logo.svg';
import config from '../../config';

export default class TitleBar extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLeftNavVisible: props.isLeftNavVisible,
      isRightNavVisible: props.isRightNavVisible
      // modalIsOpen: false
    };

    // this._showModalLogin = this._showModalLogin.bind(this);
    // this._closeModal = this._closeModal.bind(this);
    this._loginUser = this._loginUser.bind(this);
  }

  // _showModalLogin(e) {
  //   e.preventDefault();

  //   this.setState({modalIsOpen: true});
  // }

  // _closeModal() {
  //   this.setState({modalIsOpen: false});
  // }

  _loginUser(e) {
    e.preventDefault();

    this.props.keycloak.login({ redirectUri: config.lottoland+window.location.pathname });
  }

  // _logOutUser() {
    // const { userInfo } = this.props;
    // if (userInfo.name) {
      // delete sessionStorage.username;

      // this.props.logout('');
      // alert("You have successfully logged out.");
    // }
  // }

  _toggleLeftNavPanel (e) {
    e.preventDefault();

    // let newIsLeftNavVisible = !offCanvasNav.toggleLeftNavVisible;
    // this.setState({ isLeftNavVisible: newIsLeftNavVisible });
    // this.props.toggleLeftNavMenu(newIsLeftNavVisible);

    const { offCanvasNav, offCanvasNavAction } = this.props;
    offCanvasNavAction.toggleLeftNav(offCanvasNav.toggleLeftNavVisible);
  }

  _toggleRightNavPanel (e) {
    e.preventDefault();

    // let newIsRightNavVisible = !this.state.isRightNavVisible;
    // this.setState({ isRightNavVisible: newIsRightNavVisible });
    // this.props.toggleRightNavMenu(newIsRightNavVisible);

    const { offCanvasNav, offCanvasNavAction } = this.props;
    offCanvasNavAction.toggleRightNav(offCanvasNav.toggleRightNavVisible);
  }

  render () {
    const { links, user } = this.props;
    let loginLink = '';
    if (links[5]) {
      loginLink = <Link to={links[5].url} className="top-right-link">{links[5].text.substring(0, links[5].text.indexOf('/'))}</Link>;
    }
    if (user.isLoggedIn) { // user is logged-in
      // loginLink = <Link to="/" className="top-right-link" onClick={this._logOutUser}><Icons iconType="LOGIN" fill="#fff" className="svg-icon" /></Link>;
      loginLink = <a href="#navPanel-right" className="top-right-link" onClick={this._toggleRightNavPanel.bind(this)} ><Icons iconType="LOGIN" fill="#fff" className="icon svg-icon medium" /></a>
    } else {
      loginLink = <Link to="/" className="top-right-link" onClick={this._loginUser}>登入</Link>;
    }

    return (
      <div>
        <div id="titleBar">
          <a href="#navPanel-left" className="toggle" onClick={this._toggleLeftNavPanel.bind(this)} ></a>
          <span className="title"><Link to="/"><img src={lottoLandLogo} /></Link></span>
          {loginLink}
        </div>

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
      </div>
    )
  }
}

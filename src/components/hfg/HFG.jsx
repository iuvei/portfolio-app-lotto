'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Config from 'Config';

import HowToPlayHFG from './HowToPlayHFG';
import {requestFullScreen,cancelFullScreen,toggleFull,_getBreakpoint} from '../utils/util';
import Icons from '../icons/Icons';

const _hfgDesktopURL = Config.hfgDesktopURL+'StartGame.html';
const _hfgMobileURL = Config.hfgMobileURL+'StartGame.html';

export default class HFG extends Component {
  constructor(){
    super();

    this.state = {
      windowWidth: window.innerWidth,
      hfgUser: 'User1',
      hfgLang: 'zh-CN',
      isFullScreen: false
    };

    this._handleResize = this._handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _showFullScreen(e) {
    toggleFull(this.refs.hfgSection);

    this.setState({ isFullScreen: true });
  }
  _hideFullScreen(e) {
    cancelFullScreen(document);
    this.setState({ isFullScreen: false });
  }

  render() {

    let fsLink;
    if (this.state.isFullScreen) {
      fsLink = (<a id="link-fullscreen" href="#" onClick={this._hideFullScreen.bind(this)}><Icons iconType="FULLSCREENEXIT" fill="#fff" className="icon svg-icon" /> Hide Fullscreen</a>);
    } else {
      fsLink = (<a id="link-fullscreen" href="#" onClick={this._showFullScreen.bind(this)}><Icons iconType="FULLSCREEN" fill="#fff" className="icon svg-icon" /> Show Fullscreen</a>);
    }

    let prompt, fsStyle, hfgURLStr, _hfgURL;
    const { user, localeData } = this.props;

    const brkPt = _getBreakpoint(this.state.windowWidth);
    if (brkPt === 'XS' || brkPt === 'S') {
      _hfgURL = _hfgMobileURL;
    } else {
      _hfgURL = _hfgDesktopURL;
    }
    // console.log('_hfgURL:',_hfgURL);

    let hfgSectionClassName = 'game-container';
    
    if (user.isLoggedIn && user.info.name) {
      prompt = '';
      let token = '&token=' + user.info.token;
      hfgURLStr = _hfgURL + '?Account=' + (user.info.name || this.state.hfgUser) + '&lan=' + this.state.hfgLang + token;
      // console.log(hfgURLStr);
    } else {
      prompt = <p className="needToLogin">请登录玩游戏.</p>;
      hfgURLStr = '';
      fsLink = '';
      hfgSectionClassName = 'game-container hfg-not-logged';
    }

    return (
      <div className="hfg">
        <section className={hfgSectionClassName} ref="hfgSection">
          {prompt}
          <iframe ref="hfgame" className="iframe-hfg" src={hfgURLStr} frameBorder="0" allowFullScreen scrolling="yes" />

          {/*<div id="fixed-sticky-fullscreen">
              {fsLink}
            </div>*/}
          <div className="background" />
        </section>

        <header id="heading-title">
          <h1>{localeData['htp.title']}</h1>
          <div className="how-to-play">
            <HowToPlayHFG {...this.props} />
          </div>
        </header>
      </div>
    );
  }
}

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Config from 'Config';

import HowToPlayRNG from './HowToPlayRNG';
import {requestFullScreen,cancelFullScreen,toggleFull,_getBreakpoint} from '../utils/util';
import Icons from '../icons/Icons';

const _rngDesktopURL = Config.rngDesktopURL+'StartGame.html';
const _rngMobileURL = Config.rngMobileURL+'StartGame.html';

export default class RNG extends Component {
  constructor(){
    super();

    this.state = {
      windowWidth: window.innerWidth,
      rngUser: 'User1',
      rngLang: 'zh-CN',
      isFullScreen: false
    };

    this._handleResize = this._handleResize.bind(this);
  }

  componentDidMount() {
    //set RNG params here
    // let rngURLStr;
    // if (this.state.loggedIn && sessionStorage.username) {
    //   rngURLStr = _rngURL + '?Account=' + (sessionStorage.username || this.state.rngUser) + '&lan=' + this.state.rngLang;
    //   this.refs.rngame.src = rngURLStr;
    // } else {
    //   this.refs.rngame.src = '';
    // }
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    // e.preventDefault();
    // console.log(window.innerWidth);
    this.setState({windowWidth: window.innerWidth});
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log("componentDidUpdate called");
  //   console.log("this.refs.rngame.src=",this.refs.rngame.src);
    // let rngURLStr;
    // if (this.state.loggedIn && sessionStorage.username) {
    //   rngURLStr = _rngURL + '?Account=' + (sessionStorage.username || this.state.rngUser) + '&lan=' + this.state.rngLang;
    //   this.refs.rngame.src = rngURLStr;
    // } else {
    //   this.refs.rngame.src = '';
    // }
  // }

  _showFullScreen(e) {
    toggleFull(this.refs.rngSection);

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

    let prompt, fsStyle, rngURLStr, _rngURL;
    const { user, localeData } = this.props;

    const brkPt = _getBreakpoint(this.state.windowWidth);
    if (brkPt === 'XS' || brkPt === 'S') {
      _rngURL = _rngMobileURL;
    } else {
      _rngURL = _rngDesktopURL;
    }
    // console.log('_rngURL:',_rngURL);

    let rngSectionClassName = 'game-container';

    if (user.isLoggedIn && user.info.name) {
      prompt = '';
      let token = '&token=' + user.info.token;
      rngURLStr = _rngURL + '?Account=' + (user.info.name || this.state.rngUser) + '&lan=' + this.state.rngLang + token;
    } else {
      prompt = <p className="needToLogin">请登录玩游戏.</p>;
      rngURLStr = '';
      fsLink = '';
      rngSectionClassName = 'game-container rng-not-logged';
    }


    return (
      <div className="rng">
        <section className={rngSectionClassName} ref="rngSection">
          {prompt}
          <iframe ref="rngame" className="iframe-rng" src={rngURLStr} frameBorder="0" allowFullScreen scrolling="yes" />

          {/*<div id="fixed-sticky-fullscreen">
            {fsLink}
          </div>*/}
          <div className="background" />
        </section>

        <header id="heading-title">
          <h1>{localeData['htp.title']}</h1>
          <div className="how-to-play">
            <HowToPlayRNG {...this.props} />
          </div>
        </header>
      </div>
    );
  }
}

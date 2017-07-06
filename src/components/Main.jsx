'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Body from './Body';
import Header from './common/Header';
import Footer from './common/Footer';

import FerrisWheelPreloader from './utils/FerrisWheelPreloader';

import TitleBar from './TitleBar';
import NavPanel_Left from './NavPanel_Left';
import NavPanel_Right from './NavPanel_Right';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../../keycloak.json'
import cookie from 'react-cookie';
import config from '../../config';
// import { FormattedMessage } from 'react-intl';
import io from 'socket.io-client';
const socket = io(config.lottoland);

import FingerPrintJS from 'fingerprintjs2';

class Main extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLeftNavPanelVisible: false,
      isRightNavPanelVisible: false
    };
  }

  _listenToTransaction(user_id){
    socket.on('transactions', (msg) => {
      let _msg = JSON.parse(msg);
      let tx = {
        wallet_id: _msg.wallet_id,
        ending: _msg.balance,
        transactionType: _msg.transactionType
      }
      this.props.transactionAction.updateWalletBalance(tx);
    });

    // console.log('emit join');
    socket.emit('join', {user_id: user_id});
  }

  _initializeKeycloak(){
    this.keycloak = Keycloak(keycloakConfig);
    let token = cookie.load('access_token') || '';
    let idToken = cookie.load('id_token') || '';
    let refreshToken = cookie.load('refresh_token') || '';
    let params = {};
    if (config.isPublic){
      params = {
        'onLoad': "", //"check-sso",
        checkLoginIframe: false,
        token,
        idToken,
        refreshToken
      }
    } else {
      params = {
        'onLoad': "login-required"
      }
    }
    this.keycloak.init(params)
      .success((function(authenticated){
      this._removeLoading();
      if (authenticated) {
        const { userAction, walletAction, externalWalletAction, tagAction, accountAction } = this.props;
        const userId = this.keycloak.idTokenParsed.sub;
        const userName = this.keycloak.idTokenParsed.preferred_username;

        this._listenToTransaction(userId);
        this._saveCredsToCookie(this.keycloak);
        userAction.userLoggedIn(this.keycloak);
        // walletAction.findWallet(this.keycloak.token, this.keycloak.realm);
        // externalWalletAction.loadExternalWallet();

        const product = this.keycloak.idTokenParsed.product;
        const affiliateId = this.keycloak.idTokenParsed.affiliateId;
        const myAffiliateCookie = this.keycloak.idTokenParsed.myAffiliateCookie;
        const campaign = this.keycloak.idTokenParsed.campaign;
        const bonusCode = this.keycloak.idTokenParsed.bonusCode;
        const registeredAt = this.keycloak.idTokenParsed.registeredAt;

        const kcToken = this.keycloak.token;
        const kcRealm = this.keycloak.realm;

        if (!product && !affiliateId && !myAffiliateCookie && !campaign && !bonusCode && !registeredAt) {
          walletAction.findWallet(kcToken, kcRealm);
        }

        let data = {
          user_id: userId,
          merchant_id: kcRealm
        };
        accountAction.getUserEvents(data)
          .then((res1) => {
            let userEvents = res1.userevents;
            let logins = _.filter(userEvents, { 'type': "LOGIN", "details": {"redirect_uri": window.location.origin+"/"} });
            let register = _.filter(userEvents, { 'type': "REGISTER" });

            if (register.length > 0 && logins.length <= 1) {
              // first login from registration
              tagAction.fetchCategories(kcToken, kcRealm)
                .then((res2) => {
                  let categoriesData = res2.categories.data;

                  let tagsArray = [];
                  categoriesData.map((cat, idx) => {
                    let tagsData = {};
                    if (cat.type == "product") {
                      if (product) {
                        tagsData = {
                          text: product,
                          categoryId: cat._id,
                          color: "#69a507",
                          source: "lottoland88"
                        };
                        tagsArray.push(tagsData);
                      }
                    } else if (cat.type == "affiliateId") {
                      if (affiliateId) {
                        tagsData = {
                          text: affiliateId,
                          categoryId: cat._id,
                          color: "#69a507",
                          source: "lottoland88"
                        };
                        tagsArray.push(tagsData);
                      }
                    } else if (cat.type == "myAffiliateCookie") {
                      if (myAffiliateCookie) {
                        tagsData = {
                          text: myAffiliateCookie,
                          categoryId: cat._id,
                          color: "#69a507",
                          source: "lottoland88"
                        };
                        tagsArray.push(tagsData);
                      }
                    } else if (cat.type == "campaign") {
                      if (campaign) {
                        tagsData = {
                          text: campaign,
                          categoryId: cat._id,
                          color: "#69a507",
                          source: "lottoland88"
                        };
                        tagsArray.push(tagsData);
                      }
                    } else if (cat.type == "bonusCode") {
                      if (bonusCode){
                        tagsData = {
                          text: bonusCode,
                          categoryId: cat._id,
                          color: "#69a507",
                          source: "lottoland88"
                        };
                        tagsArray.push(tagsData);
                      }
                    } else if (cat.type == "registeredAt") {
                      if (registeredAt) {
                        tagsData = {
                          text: registeredAt,
                          categoryId: cat._id,
                          color: "#69a507",
                          source: "lottoland88"
                        };
                        tagsArray.push(tagsData);
                      }
                    }
                  });

                  if (tagsArray.length > 0) {
                    walletAction.findWallet(kcToken, kcRealm, JSON.stringify(tagsArray));
                    // tagAction.postTags(kcToken, kcRealm, tagsArray)
                    //   .then((res3) => {
                    //     console.log(res3.type);
                    //   });
                  }
                });
            } else {
              walletAction.findWallet(kcToken, kcRealm);
            }

          });


        // let casinoUser = {
        //   user_id: userId,
        //   username: userName
        // }
        // this.props.casinoAccountAction.createCasinoAccount(casinoUser);

        new FingerPrintJS().get(function(result, components){
          // console.log(result); //a hash, representing your device fingerprint
          // console.log(components); // an array of FP components
          let dateNow = new Date();
          // console.log('dateNow', dateNow);

          let fpData = {
            user_id: userId,
            device_id: result,
            login_date: dateNow,
          };
          components.map((fp, i) => {
            if (fp.key == "user_agent") {
              fpData[fp.key] = fp.value;
            } else if (fp.key == "language") {
              fpData[fp.key] = fp.value;
            } else if (fp.key == "color_depth") {
              fpData[fp.key] = fp.value;
            } else if (fp.key == "pixel_ratio") {
              fpData[fp.key] = fp.value;
            } else if (fp.key == "resolution") {
              fpData[fp.key] = fp.value;
            } else if (fp.key == "available_resolution") {
              fpData[fp.key] = fp.value;
            } else if (fp.key == "timezone_offset") {
              fpData[fp.key] = fp.value;
            }
          });

          userAction.postUserFingerprint(fpData);
        });
      } else {
        cookie.remove('access_token');
        cookie.remove('merchant_id');
        cookie.remove('id_token');
        cookie.remove('refresh_token');
      }
    }).bind(this));
  }

  _removeLoading() {
    window.setTimeout(function() {
      document.getElementById("homepage-overlay").style.display = 'none';
      // document.body.classList.remove('loading');
      document.getElementById("page-wrapper").style.opacity = 1;
    }, 1000);
  }

  _saveCredsToCookie(keycloak){
    cookie.save('access_token', keycloak.token);
    cookie.save('merchant_id', keycloak.realm);
    cookie.save('id_token', keycloak.idToken);
    cookie.save('refresh_token', keycloak.refreshToken);
  }

  componentWillMount(){
    this._initializeKeycloak();
    this.props.localeAction.loadLocale('58a82d87a5527676b47c8742');
  }

  componentDidMount() {
    if (!this.keycloak.loginRequired) {
      // this._integrateLiveHelperChat(this.props.user);
    }
  }

  _integrateLiveHelperChat(user) {
    let username = (user.isLoggedIn) ? user.info.preferred_username : '';
    let email = (user.isLoggedIn) ? user.info.email : '';

    let prefillForm = (user.isLoggedIn) ? '&prefill%5BEmail%5D='+encodeURIComponent(email)+'&prefill%5BUsername%5D='+encodeURIComponent(username) : '';

    var LHCChatOptions = {};
    // LHCChatOptions.attr_prefill = new Array();
    // LHCChatOptions.attr_prefill.push({'name':'Username','value':username});
    // LHCChatOptions.attr_prefill.push({'name':'Email','value':email});
    // LHCChatOptions.attr_prefill_admin = new Array();
    // LHCChatOptions.attr_prefill_admin.push({'index':'0','value':username});
    // LHCChatOptions.attr_prefill_admin.push({'index':'1','value':email});

    LHCChatOptions.opt = {widget_height:340,widget_width:300,popup_height:520,popup_width:500,domain:'lottoland88.com'};

    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      var referrer = (document.referrer) ? encodeURIComponent(document.referrer.substr(document.referrer.indexOf('://')+1)) : '';
      // var referrer = (document.referrer) ? encodeURIComponent('//www.lottoland88.com/') : '';
      // console.log('referrer',document.referrer.substr(document.referrer.indexOf('://')+1));
      var location = (document.location) ? encodeURIComponent(window.location.href.substring(window.location.protocol.length)) : '';
      // var location = (document.location) ? encodeURIComponent('//www.lottoland88.com/') : '';
      // console.log('location',window.location.href.substring(window.location.protocol.length));
      po.src = 'https://chat.lottoland88.com/index.php/chn/chat/getstatus/(click)/internal/(position)/bottom_right/(ma)/br/(top)/350/(units)/pixels/(leaveamessage)/true/(department)/2/(theme)/1?r='+referrer+'&l='+location+prefillForm;
      // console.log(po.src);

      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.keycloak.loginRequired) {
      if (prevProps.user !== this.props.user) {
        // console.log('componentDidUpdate:prevProps',prevProps.user);
        // console.log('componentDidUpdate:thisProps',this.props.user);

        // this._integrateLiveHelperChat(this.props.user);
      }
    }
  }

  _handleToggleLeftNavMenu(isNPVisible) {
    this.setState({ isLeftNavPanelVisible: isNPVisible });
  }

  _handleToggleRightNavMenu(isNPVisible) {
    this.setState({ isRightNavPanelVisible: isNPVisible });
  }

  _handleToggleNavMenu(e) {
    e.preventDefault();

    const { offCanvasNav, offCanvasNavAction } = this.props;

    if (offCanvasNav.toggleLeftNavVisible) {
      offCanvasNavAction.toggleLeftNav(offCanvasNav.toggleLeftNavVisible);
    }

    if (offCanvasNav.toggleRightNavVisible) {
      offCanvasNavAction.toggleRightNav(offCanvasNav.toggleRightNavVisible);
    }
  }

  getChildContext() {
    return {
      currentLanguage: this.props.language.current
    };
  }

  render() {
    const currentLocation = this.props.location.pathname;

    return (
      <Body {...this.props}>
        <div ref="main">
          <div id="homepage-overlay"><FerrisWheelPreloader/></div>
          <div id="page-wrapper" onClick={this._handleToggleNavMenu.bind(this)}>
            <Header links={this.props.links} isLoggedIn={this.props.isLoggedIn} {...this.props} keycloak={this.keycloak}/>
            {React.cloneElement(this.props.children, {
              ...this.props,
              keycloak: this.keycloak
            })}
            {currentLocation==`/login-register` ? null : <Footer {...this.props} links={this.props.links} />}
          </div>
          <TitleBar {...this.props} keycloak={this.keycloak} />
          <NavPanel_Left links={this.props.links} {...this.props} />
          <NavPanel_Right links={this.props.links} {...this.props} keycloak={this.keycloak} />
        </div>
      </Body>
    );
  }

}

Main.propTypes = {
  children: React.PropTypes.object.isRequired,
};

Main.childContextTypes = {
  currentLanguage: React.PropTypes.string.isRequired
};

export default Main;

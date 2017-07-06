'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import translate from '../utils/translate';

import lottoLandLogo from '../../../public/images/ll-logo.svg'; //logo_lottoland.png

// license images
// import _18logo from '../../../public/images/footer_18_logo.png';
// import eulogo from '../../../public/images/footer_eu_logo.png';
// import gambleawarelogo from '../../../public/images/footer_gambleaware_logo.png';
// import gamblingcommlogo from '../../../public/images/footer_gambling-commission_logo.png';
// import gamcarelogo from '../../../public/images/footer_gamcare_icon.png';
// import gbgalogo from '../../../public/images/footer_gbga_logo.png';
// import gibraltargovlogo from '../../../public/images/footer_gibraltar-gov_logo.png';

// powered-by images
// import visalogo from '../../../public/images/footer_visa_logo.png';
// import mastercardlogo from '../../../public/images/footer_mastercard_logo.png';
// import nettellerlogo from '../../../public/images/footer_neteller_logo.png';
// import skrilllogo from '../../../public/images/footer_skrill_logo.png';
// import unionpaylogo from '../../../public/images/footer_unionpay_logo.png';
// import golddeluxelogo from '../../../public/images/footer_gold_deluxe.png';
// import playtechlogo from '../../../public/images/footer_playtech_logo.png';
// import netentlogo from '../../../public/images/footer_netent_logotype.png';
// import microgaminglogo from '../../../public/images/footer_microgaminglogogrey.png';
// import pariplaylogo from '../../../public/images/footer_pariplayLogo_small.png';
// import allstarInteractiveLogo from '../../../public/images/asi_logo.svg';


// awards images
// import trustplaycertified from '../../../public/images/footer_trustplay_certified_icon.png';
// import trustplaygold from '../../../public/images/footer_trustplay_gold_icon.png';
// import trustplaysilver from '../../../public/images/footer_trustplay_silver_icon.png';
// import trustplaybronze from '../../../public/images/footer_trustplay_bronze_icon.png';
// import trustplayexcellence from '../../../public/images/footer_trustplay_excellence_icon.png';
// import egralternative from '../../../public/images/footer_egr_alternative_operator_icon.png';
// import egrrising from '../../../public/images/footer_egr_rising_star_icon.png';
// import egrinnovative from '../../../public/images/footer_egr_innovative_start_up_icon.png';

class Footer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currLang: props.language.current
    };

    this._changeCurrentLang = this._changeCurrentLang.bind(this);
  }

  _changeCurrentLang(e) {
    e.preventDefault();

    // console.log(this.props);
    if (e.target.value.length > 0) {
      let strCurrLang = e.target.value.toString();

      this.setState({currLang: strCurrLang});

      // this.props.changeLanguage(strCurrLang);
      this.props.localeAction.loadLocale(strCurrLang);
    }
  }

  getChildContext() {
    return {
      currentLanguage: this.state.currLang
    };
  }

  render () {
    let styles = {
      visa: { height: 25 },
      mastercard: { height: 30 },
      netteller: { height: 25 },
      skrill: { height: 25 },
      unionpay: { height: 30 },
      asi: { height: 60, maxHeight: 70 },
      golddeluxe: { height: 45, maxHeight: 50 },
      paystar: { height: 40, maxHeight: 50 }
    };

    const { links, localeData, translations } = this.props;

    let linksList = links.map((link, i) => {
      return <li key={link.id}><Link to={link.url}>{(link.key == "LFG") ? translations.Links['navLink.LFG'] :(link.key == "HFG") ? translations.Links['navLink.HFG'] : (link.key == "RNG") ? translations.Links['navLink.RNG'] : (link.key == "FAQ") ? translations.Links['navLink.FAQ'] : link.text}</Link></li>
    });

    return (
      <footer id="footer">
        <div id="top-footer" className="container">
          <header className="major">
            <div id="logo-and-slogan" className="row 100%">
              <section className="12u">
                <h2 className="logo"><Link to="/"><img src={lottoLandLogo} /></Link></h2>
              </section>
              {/* <section className="6u">
                <h3 className="slogan">Slogan Here</h3>
              </section> */}
            </div>
          </header>
          <div id="licenses" className="row 100%">
            <section className="cols">
              <span className="license-images"><img src={"/images/footer_18_logo.png"} /></span>
            </section>
            <section className="cols">
              <span className="license-images"><a href="https://www.gibraltar.gov.gi/remotegambling"><img src={"/images/footer_gibraltar-gov_logo.png"} /></a></span>
            </section>
            <section className="cols">
              <span className="license-images"><img src={"/images/footer_eu_logo.png"} /></span>
            </section>
            <section className="cols">
              <span className="license-images"><a href="http://gbga.gi/our-members/lottoland/"><img src={"/images/footer_gbga_logo.png"} /></a></span>
            </section>
            {/*<section className="cols">
              <span className="license-images"><a href="http://www.gambleaware.co.uk/"><img src={gambleawarelogo} /></a></span>
            </section>
            <section className="cols">
              <span className="license-images"><a href="https://secure.gamblingcommission.gov.uk/gccustomweb/PublicRegister/PRSearch.aspx?ExternalAccountId=38991"><img src={gamblingcommlogo} /></a></span>
            </section>
            <section className="cols">
              <span className="license-images"><a href="http://www.gamcare.org.uk/"><img src={gamcarelogo} /></a></span>
            </section>*/}
          </div>
        </div>
        <div id="mid-footer" className="container">
          <div className="row 150%">
            {/*<section className="footer-group cols">&nbsp;</section>*/}
            <section className="footer-group cols">
              <div className="footer-title"><h4>Lottoland</h4></div>
              <div className="footer-content">
                <ul>
                  {linksList}
                </ul>
              </div>
            </section>
            <section className="footer-group cols">
              <div className="footer-title"><h4>关于</h4></div>
              <div className="footer-content">
                <ul>
                  <li><Link to="/about">{translations.Links['footerLink.aboutUs']}</Link></li>{/* About Us */}
                  <li><Link to="/about/privacy-policy">{translations.Links['footerLink.privacyPolicy']}</Link></li>{/* Privacy Policy */}
                  <li><Link to="/about/terms-and-conditions">{translations.Links['footerLink.termsAndCondition']}</Link></li>{/* Terms and Conditions */}
                  <li><Link to="/about/player-protection">{translations.Links['footerLink.playerProtection']}</Link></li>{/* Player Protection */}
                  <li><Link to="/about/payouts">{translations.Links['footerLink.payouts']}</Link></li>{/* Payouts */}
                  {/*<li><a href="javascript:void()">{translations.Links['footerLink.contactUs']}</a></li>*/}{/* Contact Us */}
                </ul>
              </div>
            </section>
            <section className="footer-group cols">
              {/*<div className="footer-title"><h4>社交平台</h4></div>
              <div className="footer-content">
                <a href="javascript:void()" alt="WeChat"><span className="icon alt social sea-green fa-weixin"></span></a>&nbsp;
                <a href="javascript:void()" alt="Weibo"><span className="icon alt social yellow fa-weibo"></span></a>
              </div>*/}
              <div>
                <div className="footer-title"><h4>{localeData['locale.Label']}</h4></div>
                <div className="select-wrapper">
                  <select name="language" id="lang" onChange={this._changeCurrentLang} value={this.state.currLang}>
                    <option value="">{localeData['locale.select.option1']}</option>
                    <option value="58a82d7ea5527676b47c8741">{localeData['locale.select.option2']}</option>
                    <option value="58a82d87a5527676b47c8742">{localeData['locale.select.option3']}</option>
                  </select>
                </div>
              </div>
            </section>
            <section className="footer-group cols big">
              <div className="powered-by">
                {/*<span className="powered-by-images"><img src={visalogo} style={styles.visa} /></span>
                <span className="powered-by-images"><img src={mastercardlogo} style={styles.mastercard} /></span>
                <span className="powered-by-images"><img src={nettellerlogo} style={styles.netteller} /></span>
                <span className="powered-by-images"><img src={skrilllogo} style={styles.skrill} /></span>
                <span className="powered-by-images"><img src={unionpaylogo} style={styles.unionpay} /></span>
                <span className="powered-by-images"><img src={"/images/footer_gold_deluxe.png"} style={styles.golddeluxe} /></span>
                <span className="powered-by-images"><img src={"/images/footer_playtech_logo.png"} /></span>
                <span className="powered-by-images"><img src={"/images/footer_netent_logotype.png"} /></span>
                <span className="powered-by-images"><img src={"/images/footer_microgaminglogogrey.png"} /></span>
                <span className="powered-by-images"><img src={pariplaylogo} /></span> */}
                <span className="powered-by-images"><img src={"/images/asi_logo.svg"} style={styles.asi} /></span>
              </div>
            </section>
          </div>
        </div>
        <div id="bottom-footer" className="container">
          {<div id="awards" className="row 150% ">
            {/*<section className="cols">
                          <span className="awards-images"><img src={trustplaycertified} /></span>
                        </section>
                        <section className="cols">
                          <span className="awards-images"><img src={trustplaygold} /></span>
                        </section>
                        <section className="cols">
                          <span className="awards-images"><img src={trustplaysilver} /></span>
                        </section>
                        <section className="cols">
                          <span className="awards-images"><img src={trustplaybronze} /></span>
                        </section>
                        <section className="cols">
                          <span className="awards-images"><img src={trustplayexcellence} /></span>
                        </section>*/}
            <section className="cols">
              <span className="awards-images"><img src={"/images/footer_egr_alternative_operator_icon.png"} /></span>
            </section>
            <section className="cols">
              <span className="awards-images"><img src={"/images/footer_egr_rising_star_icon.png"} /></span>
            </section>
            <section className="cols">
              <span className="awards-images"><img src={"/images/footer_egr_innovative_start_up_icon.png"} /></span>
            </section>
          </div>}
          <div className="footer-text">
            {/*<p>This website is operated by Lottoland. Lottoland passes on Customer’s Bets to EU Lotto, which is acting as a bookmaker. When placing Bets, Lottoland acts in the name and on behalf of the Customer.</p>
            <p>Lottoland is not an official lottery operator and does not buy any lottery tickets on your behalf. Instead, Lottoland allows you to make bets on different lotteries. If you win any bets, then you get paid directly by Lottoland and not the official lottery operator. Lottoland pays you the same prize money — including the Jackpot amount — that any operator pay for their lottery draws.</p>
            <p>EU Lotto Ltd is licensed and regulated by the Gambling Commission for customers in Great Britain (Licence: 000-038991-R-319408-002). It is also licensed by the Government of Gibraltar and regulated by the Gibraltar Gambling Commissioner (RGL 085 & 066). Lottery Online • 1st Lotto Bet is free • Lottoland UK </p>*/}
           {/* <p>本网站由Lottoland运营。作为博彩运营商，Lottoland把玩家的乐透投注转到EU Lotto。同时，Lottoland以玩家的名义进行投注。EU Lotto Ltd. 的执照受直布罗陀政府颁发，受直布罗陀博彩委员会 监管。 © 2013 Lottoland Limited - 23 Ocean Village Promenade, 直布罗陀 (EU)在Lottoland.com上购买Lotto赢得百万！</p>*/}
          <p>{localeData['copywright']}</p>
          </div>
        </div>

        {/*<ul className="icons">
          <li><Link to="/"  className="icon alt fa-twitter"><span className="label">Twitter</span></Link></li>
          <li><Link to="/"  className="icon alt fa-facebook"><span className="label">Facebook</span></Link></li>
          <li><Link to="/"  className="icon alt fa-linkedin"><span className="label">LinkedIn</span></Link></li>
          <li><Link to="/"  className="icon alt fa-instagram"><span className="label">Instagram</span></Link></li>
          <li><Link to="/"  className="icon alt fa-github"><span className="label">GitHub</span></Link></li>
          <li><Link to="/"  className="icon alt fa-envelope"><span className="label">Email</span></Link></li>
        </ul>
        <ul className="copyright">
          <li>&copy; 2016 LottoLand Asia</li>
        </ul>*/}
      </footer>
    )
  }
}

Footer.propTypes = {
  strings: React.PropTypes.object,
  localeData: React.PropTypes.object,
  translations: React.PropTypes.object
}

Footer.childContextTypes = {
  currentLanguage: React.PropTypes.string.isRequired
};

// export default Footer;
export default translate('Footer')(Footer);

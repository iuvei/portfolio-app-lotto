'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

// import CountdownTimer from '../utils/CountdownTimer';
import { connect } from 'react-redux';
import ClockTimer from '../utils/ClockTimer';
import { _getBreakpoint, abbreviateNumber  } from '../utils/util';
import { bindActionCreators } from 'redux';

// import biggestHeading from '../../../public/images/biggest.png';
// import euroJackpot from '../../../public/images/lotto_eurojackpot.png';

// import banner01 from '../../../public/images/01.jpg';
// import banner02 from '../../../public/images/02.jpg';
// import banner03 from '../../../public/images/03.jpg';

import _ from 'lodash';
import moment from 'moment-timezone';
import Slider from 'react-slick';


class Banner extends Component {
  constructor (props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
      SliderSettings : {
        dots: false,
        fade: true,
        infinite: true,
        speed: 1000,
        arrows : false,
        autoplay : true,
        autoplaySpeed : 10000,
        focusOnSelect: false,
        swipe : false
      }
    };

    this._handleResize = this._handleResize.bind(this);
    this._renderNextSlide = this._renderNextSlide.bind(this)
  }
  componentWillMount(){

  }
  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
    // let self = this;
    // const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    // let images = this.state.images;
    // this.props.drawingActions.fetchDrawings(YUAN.abbr)
    //   .then((res) => {
    //     let d = _.find(res.drawings, { 'lotteryId': "euroJackpot"});
    //     let closingDate = moment.utc(d.closingDate).format('MM/DD HH:mm');
    //       self.setState({
    //         drawingData: {
    //           closingDate : d.closingDate,
    //           jackpot : abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN'),

    //         }
    //       });
    //   });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _drawHTMLforDesktop () {
    const { drawingsData, lotteryData, localeData, translations } = this.props;
    const locale = Object.keys(translations) ? translations.LFG : {
      "timer.daysLeft":"",
      "timer.hoursLeft":"",
      "timer.minutesLeft":"",
      "timer.secondsLeft":"",
      "timer.title":""
    }
    let jackpotAmt = 0, closingDate = moment().add(1, 'M'), lottoName = '', lottoLink = '';
    if (_.isArray(drawingsData)) {
      drawingsData.map((d,j) => {
        lotteryData.map((l, j) => {

          if (l.id === d.lotteryId && d.lotteryId === 'megaMillions') {
            jackpotAmt = abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN')
            closingDate = moment(d.closingDate).tz('Asia/Shanghai').format();
            lottoName = l.name;
            lottoLink = l.lfg_url;
          }

          // if (d.lotteryId === 'euroJackpot') {
          // }

        });
      });
    }

    return (
      <div className="section group">
        {/*<div id="head">
                  <img src={"/images/biggest.png"} />
                </div>*/}
          <div className="logo"><img src={"/images/lotto_megamillions_.png"} /></div>
       <div id="banner-box" className="col span_1_of_2">
          <div className="section group">
            <div id="banner-box-1" className="col span_7_of_12">
              <div className="gray-box">
                <div className="box-title">
                  <h3>{localeData["banner.nextDraw"]}</h3>
                </div>
                <div id="countdown" className="box-content align-center">
                  <div id="heading">
                    <div className="prize">
                      <h5>{lottoName}</h5>
                      <h1>{jackpotAmt}</h1>
                    </div>
                  </div>
                  <div id="countdown-clock" className="countdown-clock"></div>
                  <ClockTimer endDate={new Date(closingDate)} localeData={locale}/>
                 {/* <a href="#" className="button special">立刻下注 !</a>*/}
                 <Link to={lottoLink} className="button special">{localeData['betNowButtonLabel']}</Link>
                </div>
              </div>
            </div>
            {/*<div id="banner-box-2" className="col span_5_of_12">
                          <div id="draw-news" className="gray-box">
                            <div className="box-content align-left">
                              <h5>labrada424:</h5>
                              <p><span className="highlight">PowerBall</span> 兌中 3000 元</p>
                            </div>
                            <hr />
                            <div className="box-content align-left">
                              <h5>sjkdkhfie56:</h5>
                              <p><span className="highlight">RaidthePiggyBank</span> 刮到 12000 元</p>
                            </div>
                            <hr />
                            <div className="box-content align-left">
                              <h5>dfeijdf78:</h5>
                              <p>玩 <span className="highlight">KENO</span> 贏了 700 元</p>
                            </div>
                          </div>
                        </div>*/}
          </div>
        </div>
      </div>
    );
  }

  _drawHTMLforMobile () {
    const { drawingsData, lotteryData, localeData, translations } = this.props;
    const locale = Object.keys(translations) ? translations.LFG : {
      "timer.daysLeft":"",
      "timer.hoursLeft":"",
      "timer.minutesLeft":"",
      "timer.secondsLeft":"",
      "timer.title":""
    }
    let jackpotAmt = 0, closingDate = moment().add(1, 'M'), lottoName = '', lottoLink = '';
    if (_.isArray(drawingsData)) {
      drawingsData.map((d,j) => {
        lotteryData.map((l, j) => {

          if (l.id === d.lotteryId && d.lotteryId === 'megaMillions') {
            jackpotAmt = abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN')
            closingDate = moment(d.closingDate).tz('Asia/Shanghai').format();
            lottoName = l.name;
            lottoLink = l.lfg_url;
          }

        });
      });
    }

    return (
      <div className="section group mobile-banner">
        {/*<div id="head">
                  <img src={biggestHeading} />
                </div>*/}
        {/*<div id="banner-box">
          <div className="section group">
            <div id="banner-box-1">
              <div className="gray-box">
                <div className="box-title">
                  <h3>即将开奖 !</h3>
                </div>
                <hr />

              </div>
            </div>
          </div>
        </div>
        <div id="banner-box-2">
          <div id="draw-news" className="gray-box">
            <div className="box-content">
              <h5>labrada424:</h5>
              <p><span className="highlight">PowerBall</span> 兌中 3000 元</p>
            </div>
          </div>
        </div> */}
        <div className="logo"><img src={"/images/lotto_megamillions.png"} /></div>
       <div id="banner-box" className="col span_1_of_2">
          <div className="section group">
            <div id="banner-box-1" className="col span_3_of_12">
              <div className="gray-box">
                <div className="box-title">
                  <h3>{localeData["banner.nextDraw"]}</h3>
                </div>
                <div id="countdown" className="box-content align-center">
                  <div id="heading">
                    <div className="prize">
                      <h5>{lottoName}</h5>
                      <h1>{jackpotAmt}</h1>
                    </div>
                  </div>
                  <div id="countdown-clock" className="countdown-clock"></div>
                  <ClockTimer endDate={new Date(closingDate)} localeData={locale}/>
                 {/* <a href="#" className="button special">立刻下注 !</a>*/}
                 <Link to={lottoLink} className="button special">{localeData['betNowButtonLabel']}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderNextSlide() {
    console.log("window.location.pathname", window.location.pathname);
    if (window.location.pathname == "/") {
      setTimeout(() => {
        this.refs.slider.innerSlider.slickNext()
      }, 2000);
    }
  }

  render () {
    const brkPt = _getBreakpoint(this.state.windowWidth);
    let html;
    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile();
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    //   html = this._drawHTMLforDesktop();
    } else {
      html = this._drawHTMLforDesktop();
    }
    const { SliderSettings } =  this.state
    return (
      <header id="banner">
        <Slider ref='slider' {...SliderSettings}>
          <div onMouseOut={this._renderNextSlide}>
            <img className="banner-img banner-main" src='/images/banner/home/banner_01.jpg' />
             {(brkPt === 'XS' || brkPt === 'S') ? null : <img className="banner-text" src='/images/banner/home/banner_01_txt_biggest.png' /> }
            <div className="content">
              {html}
            </div>
          </div>
          <div onMouseOut={this._renderNextSlide}>
            <Link to="/hfg">
              <img className="banner-img" src='/images/banner/home/banner_02.jpg' /><img className="banner-text" src='/images/banner/home/banner_02_txt_biggest.png' />
            </Link>
          </div>
          <div onMouseOut={this._renderNextSlide}>
            <Link to="/rng">
              <img className="banner-img" src='/images/banner/home/banner_03.jpg' /><img className="banner-text" src='/images/banner/home/banner_03_txt_biggest.png' />
            </Link>
          </div>
          <div onMouseOut={this._renderNextSlide}>
            <a href="https://sso.lottoland88.com/auth/realms/lla/protocol/openid-connect/auth?client_id=lottoland-website&redirect_uri=https%3A%2F%2Fsecure.lottoland88.com%2F&state=25222963-749d-4732-82b5-2112cc09a140&nonce=ae9e436e-8bba-4c24-8cf7-de3e6c1f19a0&response_mode=fragment&response_type=code&scope=openid">
              <img className="banner-img" src='/images/banner/home/banner_04.jpg' /><img className="banner-text" src='/images/banner/home/banner_04_txt_biggest.png' />
            </a>
          </div>
          <div onMouseOut={this._renderNextSlide}>
            <Link  to="/lfg-listing">
              <img className="banner-img" src='/images/banner/home/banner_05.jpg' /><img className="banner-text" src='/images/banner/home/banner_05_txt_biggest.png' />
            </Link>
          </div>
         {/* <figure></figure>
          <figure></figure>
          <figure></figure>
          <figure></figure>
          <figure></figure>*/}

        </Slider>

      </header>
    )
  }
}

Banner.propTypes = {
  drawingsData: React.PropTypes.array,
  localeData : React.PropTypes.object,
  translations : React.PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lfg: state.lfg,
    lotteryData: state.lotteryData,
    translations : state.locale
  };
};

export default connect(mapStateToProps)(Banner);

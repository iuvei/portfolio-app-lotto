'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import { _getBreakpoint, abbreviateNumber } from '../utils/util';

import * as lfgAction from '../../actions/lfgActions';
import { bindActionCreators } from 'redux';

class SecondRow extends Component {
  constructor (props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth
    };

    this._handleResize = this._handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
    // document.getElementById("lotto-list").classList.add("loading-pulse");

    // const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    // this.props.lfgAction.fetchDrawings(YUAN.abbr)
    //   .then((res) => {
    //     // let d = res.drawings;
    //     console.log("drawings",res.drawings);
    //     this.setState({
    //       drawingsData: res.drawings
    //     });
    //     document.getElementById("lotto-list").classList.remove("loading-pulse");
    //   });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _drawHTMLforDesktop () {
    const { drawingsData, lotteryData, localeData } = this.props;
    // const { lfg } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    let lotteries = [];

    if (_.isArray(drawingsData)) {
      drawingsData.map((d,j) => {
        lotteryData.map((l, i) => {
        // let lottoArr = _.sortBy(drawingsData, this.state.sortBy);

          if (l.id == d.lotteryId && l.in_play) {

            let btnText = (l.in_play) ? (<Link to={l.lfg_url} className="button special small">{localeData['betNowButtonLabel']}</Link>) : '';
            let jackpotAmt = (l.in_play) ? `${YUAN.unicode} ${abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN')}` : 'Coming soon';
            let closingDate = (l.in_play) ? moment(d.closingDate).tz('Asia/Shanghai').format('MM/DD HH:mm') : '';

            lotteries.push(
              <section key={i} className="2u 4u(xsmall)">
                <img src={l.src} />
                <h5 className="hide-on-mobile">{l.name}</h5>
                <h5><strong>{jackpotAmt}</strong></h5>
                <h6 className="hide-on-mobile">{closingDate}</h6>
                {btnText}
              </section>
            );

          }
        });
      });
    }

    return (
      <div className="section">
        <div id="low-fg" className="gray-box">
          <div className="box-title">
            <h3>{localeData['gameBoxes.game2.title']}</h3>
            <span className="box-subtitle">{localeData['gameBoxes.game2.subtitle']}</span>
          </div>
          <hr />
          <div className="box-content">
            <div id="six-col-box" className="box alt">
              <div id="lotto-list" className="row uniform">
                {lotteries}
              </div>
            </div>
          </div>
          <div className="box-link">
            <Link to="/lfg-listing">{localeData['gameBoxes.game2.link']} &#187;</Link>
          </div>
        </div>
        {/* <div id="high-fg" className="gray-box">
          <div className="box-title">
            <h3>刮刮乐 !</h3>
            <span className="box-subtitle">即刮即中 !</span>
          </div>
          <hr />
          <div className="box-content">
            <div id="two-col-row-box" className="box alt">
              <div className="row uniform">
                <section className="6u">
                  <img src={scratchcard04} />
                </section>
                <section className="6u">
                  <img src={scratchcard11} />
                </section>
              </div>
              <div className="row uniform">
                <section className="6u">
                  <img src={scratchcard12} />
                </section>
                <section className="6u">
                  <img src={scratchcard02} />
                </section>
              </div>
            </div>
          </div>
          <div className="box-link">
            <a href="#">刮刮乐 &#187;</a>
          </div>
        </div> */}
      </div>
    );
  }

  _drawHTMLforMobile () {
    const { drawingsData, lotteryData, localeData } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    let lotteries = [];

    if (_.isArray(drawingsData)) {
      drawingsData.map((d,j) => {
        lotteryData.map((l, i) => {

          if (l.id == d.lotteryId && l.in_play) {

            let imageLink = (l.in_play) ? (<Link to={l.lfg_url} className=""><img src={l.src} /></Link>) : '';
            let jackpotAmt = (l.in_play) ? `${YUAN.unicode} ${abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN')}` : 'Coming soon';
            let closingDate = (l.in_play) ? moment(d.closingDate).tz('Asia/Shanghai').format('MM/DD HH:mm') : '';

            lotteries.push(
              <section key={i} className="2u 4u(xsmall)">
                {imageLink}
                <h6 className="">{closingDate}</h6>
                <h5><strong>{jackpotAmt}</strong></h5>
              </section>
            );

          }
        });
      });
    }

    return (
      <div className="section">
        <div id="low-fg" className="gray-box">
          <div className="box-title">
            <h3>{localeData['gameBoxes.game2.title']}</h3>
            <span className="box-subtitle">{localeData['gameBoxes.game2.subtitle']}</span>
          </div>
          <hr />
          <div className="box-content">
            <div id="three-col-box" className="box alt">
              <div id="lotto-list" className="row uniform">
              {lotteries}
              </div>
            </div>
          </div>
          <div className="box-link">
            <Link to="/lfg-listing">{localeData['gameBoxes.game2.link']} &#187;</Link>
          </div>
        </div>
      </div>
    );
  }

  render () {
    const brkPt = _getBreakpoint(this.state.windowWidth);
    let html;
    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile();
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    } else {
      html = this._drawHTMLforDesktop();
      // html = '';
    }

    return (
      <section id="two">
        {html}
      </section>
    )
  }
}

SecondRow.propTypes = {
  drawingsData: React.PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lfg: state.lfg,
    lotteryData: state.lotteryData
  };
};

const mapDispatchToProps = (dispatch) => ({
  lfgAction: bindActionCreators(lfgAction, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SecondRow);

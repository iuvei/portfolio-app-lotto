'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import translate from '../utils/translate';

import { abbreviateNumber } from '../utils/util';

// import euroJackpot from '../../../public/images/lotto_eurojackpot.png';
// import euroMillions from '../../../public/images/lotto_euromillions.png';
// import powerBall from '../../../public/images/lotto_powerball.png';
// import megaMillions from '../../../public/images/lotto_megamillions.png';
// import germanKeno from '../../../public/images/lotto_germankeno.png';
// import keNow from '../../../public/images/lotto_kenow.png';
// import hkMark6 from '../../../public/images/lotto_hkmark6.png';

// import ozLotto from '../../../public/images/lotto_ozlotto.png';
// import cash4Life from '../../../public/images/lotto_cash4life.png';
// import austrianLottery from '../../../public/images/lotto_austrian-lottery.png';
// import elGordoPrimitiva from '../../../public/images/lotto_elgordoprimitiva.png';
// import frenchLotto from '../../../public/images/lotto_frenchlotto.png';
// import german6Aus46 from '../../../public/images/lotto_german6aus49.png';
// import irishLotto from '../../../public/images/lotto_irishlotto.png';
// import megaSena from '../../../public/images/lotto_megasena.png';
// import monWedOz from '../../../public/images/lotto_monwedoz.png';
// import multiMulti from '../../../public/images/lotto_multimulti.png';
// import ozPowerball from '../../../public/images/lotto_ozpowerball.png';
// import polishLotto from '../../../public/images/lotto_polishlotto.png';
// import polishMiniLotto from '../../../public/images/lotto_polishminilotto.png';
// import saturdayOz from '../../../public/images/lotto_saturdayoz.png';
// import summerGordo from '../../../public/images/lotto_summergordo.png';
// import superEnaLotto from '../../../public/images/lotto_superenalotto.png';
// import swedishLotto from '../../../public/images/lotto_swedishlotto.png';
// import ukLotto from '../../../public/images/lotto_uklotto.png';

class LFGListing extends Component {
  constructor (props) {
    super(props);

    moment.locale('zh-cn');

    this.state = {
      sortBy: '',
      drawingsData: []
    };

    this._sortLotteries = this._sortLotteries.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    document.getElementById("lfg-listing").classList.add("loading-pulse-black");

    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    this.props.lfgAction.fetchDrawings(YUAN.abbr)
      .then((res) => {
        // let d = res.drawings;
        this.setState({
          drawingsData: res.drawings
        });
        // setTimeout(() => { document.getElementById("lfg-overlay").style.display = 'none'; }, 1000);
        document.getElementById("lfg-listing").classList.remove("loading-pulse-black");
      });
  }

  _sortLotteries(e) {
    e.preventDefault();

    if (e.target.value.length > 0) {
      let strCurrSort = e.target.value.toString();

      this.setState({sortBy: strCurrSort});
    }
  }

  render () {
    const { lotteryData, localeData } = this.props;
    const { drawingsData } = this.state;

    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);


    let lotteries = [];

    let sortedDrawings = [];

    if (this.state.sortBy === 'jackpots[0].marketingJackpot'){
      sortedDrawings = _.sortBy(drawingsData, this.state.sortBy).reverse();
    } else {
      sortedDrawings = _.sortBy(drawingsData, this.state.sortBy);
    }

    sortedDrawings.map((d,j) => {
      // console.log("sorted by "+this.state.sortBy,lottoArr);
      lotteryData.map((l, i) => {

        if (l.id == d.lotteryId && l.in_play) {

          let btnText = (l.in_play) ? (<Link to={l.lfg_url} className="button special small">立刻下注 !</Link>) : '';
          let jackpotAmt = (l.in_play) ? `頭彩 ${YUAN.unicode} ${abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN')}` : '即將上市';
          let closingDate = (l.in_play) ? moment(d.closingDate).tz('Asia/Shanghai').format('LL') : '';
          // console.log(moment.utc(d.closingDate).format('MM/DD HH:mm'), moment(d.closingDate).format('MM/DD HH:mm'));

          lotteries.push(
            <div key={l.id}>
              <div key={i} className="gray-box">
                <div className="box-content">
                  <img src={l.src} />
                  <div className="lotto-info">
                    <h4>{l.name}</h4>
                    <h3>{jackpotAmt}</h3>
                    <span><h4>{closingDate}</h4>{btnText}</span>
                  </div>
                </div>
              </div>
            </div>
          );

        }
      });
    });
    _.sortBy(lotteryData, "name").map((l, i) => {

      if (!l.in_play) {

        lotteries.push(
          <div key={l.id}>
            <div key={i} className="gray-box">
              <div className="box-content">
                <img src={l.src} />
                <div className="lotto-info">
                  <h4>{l.name}</h4>
                  <h3>即將上市</h3>
                </div>
              </div>
            </div>
          </div>
        );

      }
      // else if (l.in_play == 'demo') {
      //   lotteries.push(
      //     <div key={l.id}>
      //       <div key={i} className="gray-box">
      //         <div className="box-content">
      //           <img src={l.src} />
      //           <div className="lotto-info">
      //             <h4>{l.name}</h4>
      //             <h3>即將上市</h3>
      //             <span><Link to={l.lfg_url} className="button special small">立刻下注 !</Link></span>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   );

      // }
    });

    return (
      <div className="lfg-wrapper">
        {/*<div id="lfg-overlay"><span className="loading"></span></div>*/}

        <header id="heading-title">
          <h1>{localeData['heading.title']}</h1>
          <span className="box-subtitle">{localeData['heading.subtitle']}</span>
          <span className="sort-by">
            <span className="labelForSelect">{localeData['heading.sortLabel']} :</span>
            <span className="select-wrapper small">
              <select name="sortLotteries" id="sortLotteries" onChange={this._sortLotteries} value={this.state.sortBy}>
                <option value="">{localeData['sortByValue1']}</option>
                <option value="lotteryId">{localeData['sortByValue2']}</option>
                <option value="jackpots[0].marketingJackpot">{localeData['sortByValue3']}</option>
                <option value="closingDate">{localeData['sortByValue4']}</option>
              </select>
            </span>
          </span>
        </header>

        <section id="lfg-listing">
          <div className="section">
            {lotteries}
          </div>
        </section>
      </div>
    )
  }
}

LFGListing.propTypes = {
  strings: React.PropTypes.object,
  translations: React.PropTypes.object,
  localeData : React.PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lotteryData: state.lotteryData
  };
};

export default connect(mapStateToProps)(LFGListing);
//export default translate('LFG')(connect(mapStateToProps)(LFGListing));

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import moment from 'moment';
import _ from 'lodash';
import { _getBreakpoint, abbreviateNumber } from '../utils/util';
import translate from '../utils/translate';

// import * as lfgAction from '../../actions/lfgActions';
import { bindActionCreators } from 'redux';

class LFGCheckoutComplete extends Component {

  constructor(props){
    super(props);
    window.scrollTo(0, 0);

    const lottery = _.find(props.lotteryData, function(obj) { return obj.id.toUpperCase() == props.params.gameId.toUpperCase(); });
    console.log('checkout_summary', lottery.id);
    let lottoId = (lottery.id == 'chinaWelfare') ? 'euroJackpot' : lottery.id;

    this.state = {
      windowWidth: window.innerWidth,
      gameId: lottoId,
      drawingsInfo: {
        drawId: '',
        closingDate: '',
        jackpotAmt: 0,
        state: ''
      },
      lotteryInfo: {
        set1PickLimit: 0,
        set2PickLimit: 0,
        drawingTypes: [],
        jackpot: 0
      },
      drawingsData: []
    };

    this._handleResize = this._handleResize.bind(this);
  }

  componentWillMount(props) {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', function () {
      history.pushState(null, null, location.href);
    });

    // const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    // this.props.lfgAction.fetchDrawings(YUAN.abbr)
    //   .then((res) => {
    //     let d = res.drawings;
    //     this.setState({
    //       drawingsData: res.drawings
    //     });
    //   });
  }

  componentDidMount(props) {
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  render() {
    const { localeData } = this.props;
    // const { drawingsData } = this.state;
    // const { lotteryData, currency } = this.props;
    // const YUAN = _.find(currency, ['name', 'Yuan']);
    // const brkPt = _getBreakpoint(this.state.windowWidth);

    // let lotteries = [];
    // lotteryData.map((l, i) => {
    //   // let lottoArr = _.sortBy(drawingsData, this.state.sortBy);
    //   drawingsData.map((d,j) => {

    //     if (l.id == d.lotteryId) {

    //       let btnText = (l.in_play) ? (<Link to={l.lfg_url} className="button special small">立刻下注 !</Link>) : '';
    //       let jackpotAmt = (l.in_play) ? `${YUAN.unicode} ${abbreviateNumber(d.jackpots[0].marketingJackpot, 'zh-CN')}` : 'Coming soon';
    //       let closingDate = (l.in_play) ? moment(d.closingDate).format('MM/DD HH:mm') : '';
    //       let imageLink = (l.in_play) ? (<Link to={l.lfg_url} className=""><img src={l.src} /></Link>) : '';

    //       if (brkPt === 'XS' || brkPt === 'S') {
    //         lotteries.push(
    //           <section key={i} className="2u 4u(xsmall)">
    //             {imageLink}
    //             <h6 className="">{closingDate}</h6>
    //             <h5><strong>{jackpotAmt}</strong></h5>
    //           </section>
    //         );
    //       } else {
    //         lotteries.push(
    //           <section key={i} className="2u align-center">
    //             <Link to={l.lfg_url} ><img src={l.src} /></Link>
    //             <h4>{l.name}</h4>
    //             <h5><strong>{jackpotAmt}</strong></h5>
    //             <h6>{closingDate}</h6>
    //             {btnText}
    //           </section>
    //         );
    //       }

    //     }
    //   });
    // });

    return(
      <div>
        <header id="heading-title">
          <h1>{localeData['heading.title']}</h1>
        </header>
        <div id="checkout-complete">
          <div className="checkout-summary">
            <h2>{/*localeData['summary.h2']*/} 祝您好运！您可以在“<Link to="/my-lottery" className="green">我的彩券</Link>”中查看详细信息。</h2>
            {/*<h4>等待乐透开奖时，何不试试其他有趣的游戏？</h4>*/}
          </div>
          {/*<div className="other-lotteries">
            {lotteries}
          </div>*/}
        </div>
      </div>
    );
  }
}

LFGCheckoutComplete.propTypes = {
  strings: React.PropTypes.object,
  translations: React.PropTypes.object,
  localeData : React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lotteryData: state.lotteryData
    // bet: state.bet,
    // paymentDetail: state.paymentDetail,
    // wallet: state.wallet
  };
};

// const mapDispatchToProps = (dispatch) => ({
//   lfgAction: bindActionCreators(lfgAction, dispatch)
// });

export default connect(mapStateToProps)(LFGCheckoutComplete);
//export default translate('LFG')(connect(mapStateToProps)(LFGCheckoutComplete));

'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as lfgAction from '../../actions/lfgActions';
import moment from 'moment-timezone';
import _ from 'lodash';
import $ from 'jquery';
import { getDayString, abbreviateNumber } from '../utils/util';

class RecentHistory extends Component {
  constructor (props) {
    super(props);

    this.state = {
      gameId: props.gameId,
      drawId: '',
      drawingsHistoryData: [],
      currentDrawHistory: []
    };

    this._handleHistoryDateChange = this._handleHistoryDateChange.bind(this);
  }


  componentDidMount() {
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { lfgAction } = this.props;

    lfgAction.fetchDrawings(YUAN.abbr, this.state.gameId, { next: 0, last: 10 })
      .then((res) => {

        if (res.drawings.length > 0) {
          // console.log(_.sortBy(res.drawings,"drawingDate"));

          let currentDraw = res.drawings[0];
          for (let idx = 0; idx < res.drawings.length; idx++) {
            let draw = res.drawings[idx];
            if (draw.state == 'RESULTS_PENDING') {
            } else if (draw.state == 'CLOSED') {
              currentDraw = draw;
              break;
            }
          }

          this.setState({
            drawingsHistoryData: res.drawings,
            currentDrawHistory: currentDraw,
            drawId: currentDraw.id
          });

        }

        // document.getElementById("historyPreloader").classList.remove("loading-pulse");
        // $("#historyWrapper").show();
        // $("#historyWrapper").hide();
        // document.getElementById("historyPreloader").classList.add("loading-pulse");

      });
  }


  _handleHistoryDateChange(e) {
    const currentDraw = _.find(this.state.drawingsHistoryData, ['id', e.target.value]);

    // console.log('selected draw', currentDraw);
    this.setState({
      currentDrawHistory: currentDraw,
      drawId: currentDraw.id
    });
  }


  render () {
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { lotteryData, localeData } = this.props;
    const { gameId, currentDrawHistory, drawingsHistoryData } = this.state;

    let drawDateOpts = [];
    if (_.isArray(drawingsHistoryData)){
      drawingsHistoryData.map((dhObj, i) => {
        if (dhObj.state == 'CLOSED') {
          let dtStr = moment(dhObj.drawingDate).tz('Asia/Shanghai').format('YYYY/MM/DD');
          drawDateOpts.push(<option key={"opt"+(i+1)} value={dhObj.id}>{dtStr}</option>);
        }
      });
    }

    let lotteryName = '';
    let prizeTier = [];
    lotteryData.map((l, i) => {
      if (l.id == gameId) {
        lotteryName = l.name;
        prizeTier = l.prizeTier;
      }
    });

    let numbers, addlNumbers, multiplier, drawNumbers = [], drawOddsTable = [], additionalColumns, additionalPrizes;
    if (!_.isEmpty(currentDrawHistory)) {
      // currentDrawHistory.map((history, i) => {
        let gameSpecialNum = "";
        switch (gameId) {
          case "euroMillions":
            gameSpecialNum = "num-star icon";
            break;
          case "powerBall":
            gameSpecialNum = "num-ball red";
            multiplier = currentDrawHistory.additionalResults.map((m, idx) => {
              if (m.name === 'multiplier') {
                return (<span key={"multiplier"+(idx+1)} className="num-ball purple">{"x"+m.numbers[0]}</span>);
              }
            });
            // additionalColumns = (<th>N 人中獎</th><th>威力倍数</th>);
            break;
          case "megaMillions":
            gameSpecialNum = "num-ball purple";
            multiplier = currentDrawHistory.additionalResults.map((m, idx) => {
              if (m.name === 'multiplier') {
                return (<span key={"multiplier"+(idx+1)} className="num-ball red">{"x"+m.numbers[0]}</span>);
              }
            });
            // additionalColumns = (<th>N 人中獎</th><th>百万倍数</th>);
            break;
          default:
            gameSpecialNum = "num-ball dark";
        }
        numbers = currentDrawHistory.numbers.map((n, k) => {
          return (<span key={"nums"+(k+1)} className="num-ball">{n}</span>);
        });
        if (currentDrawHistory.additionalNumbers) {
          addlNumbers = currentDrawHistory.additionalNumbers.map((an, l) => {
            let num2 = an; //(gameId === 'euroMillions') ? <p>{an}</p> :
            return (<span key={"addlNums"+(l+1)} className={gameSpecialNum}>{num2}</span>);
          });
        }

        drawNumbers.push(
          <section key={"N_0"} className="numbers">
            {numbers}
            <i className="fa fa-plus" aria-hidden="true"></i>
            {addlNumbers}
            {multiplier}
          </section>
        );

        currentDrawHistory.odds.map((odd, idx) => {
          odd.ranks.map((rank, m) => {
            prizeTier.map((pt, n) => {
              if (rank.rank == pt.rank) {
                // if (gameId === "powerBall" || gameId === "megaMillions") {
                //   additionalPrizes = (<td>{rank.additionalLottoWinners} 人中獎</td><td>{YUAN.unicode} {abbreviateNumber((rank.additionalPrize / 100), 'zh-CN')}</td>);
                // }

                //中 5 個一般號 , 中 2 個特別號
                drawOddsTable.push(
                  <tr key={m+1}>
                    <td>{rank.rank}</td><td>{pt.tierText}</td><td>{rank.lottoWinners} 人中獎</td><td>{YUAN.unicode} {abbreviateNumber((rank.prize / 100), 'zh-CN')}</td>{(gameId === "powerBall" || gameId === "megaMillions") &&
                      <td>{rank.additionalLottoWinners} 人中獎</td>
                      }
                    {(gameId === "powerBall" || gameId === "megaMillions") &&
                      <td>{YUAN.unicode} {abbreviateNumber((rank.additionalPrize / 100), 'zh-CN')}</td>
                    }
                  </tr>
                );
              }
            });
          });
        });
      // });
    }

    return (
      <div className="box alt">
        <div className="row uniform">
          <section id="history-form">
            <div className="select-wrapper">
              <select name="history-date" id="history-date" ref="history-date" value={this.state.drawId} onChange={this._handleHistoryDateChange}>
                {drawDateOpts}
              </select>
            </div>
            <h1>{localeData['drawHistory.resultNumbers'].replace('{lotteryName}', lotteryName)}</h1>
          </section>
          <div id="historyPreloader"></div>
          <div id="historyWrapper">
            {drawNumbers}
            <section className="history-table">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>{localeData['drawHistory.table.col1Title']} {/*頭獎*/}</th>
		    <th>{localeData['drawHistory.table.col2Title']} {/*中 N 個一般號 , 中 N 個特別號*/}</th>
		    <th>{localeData['drawHistory.table.col3Title']} {/*N 人中獎*/}</th>
		    <th>{localeData['drawHistory.table.col4Title']} {/*獎金*/}</th>
		    {(gameId === "powerBall" || gameId === "megaMillions") &&
                      <th>{localeData['drawHistory.table.col3Title']} /*N 人中獎*/</th>
                    }
                    {(gameId === "powerBall") &&
                      <th style={{color: '#3154ca'}}>威力倍数</th>
                    }
                    {(gameId === "megaMillions") &&
                      <th style={{color: '#ea3433'}}>百万倍数</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {drawOddsTable}
                </tbody>
              </table>
            </section>
          </div>
          {/*<section>
            <div className="history-info">
              <h3>The EuroJackpot number for 01.07.2016</h3>
              <p>The 224th draw for the EuroJackpot was held on 01.07.2016, as usual at 9pm in Helsinki.</p>
            </div>
            <div className="history-info">
              <h3>EuroJackpot number for 01.07.2016</h3>
              <p>The balls used for the draw are made of synthetic polymer, softer than ping-pong balls. The results are broadcast after the draw, with the draw-machines independently checked by the VTT Technical Research Center of Finland. Lottoland published the draw results immediately after the draww on 01.07.2016. You can easily check your tickets here at Lottoland, or purchase your ticket for the next draw.</p>
            </div>
          </section>*/}
        </div>
      </div>
    );
  }
}

RecentHistory.propTypes = {
  gameId: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lotteryData: state.lotteryData
  };
};

const mapDispatchToProps = (dispatch) => ({
  lfgAction: bindActionCreators(lfgAction, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentHistory);

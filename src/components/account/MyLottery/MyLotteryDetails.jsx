'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';
import { getDayString, abbreviateNumber } from '../../utils/util';

class MyLotteryDetails extends Component {
  constructor (props) {
    super(props);
    window.scrollTo(0, 0);

    let ticket = props.params.ticketId.split(',');
    let betDate = moment(props.params.betDate).format('YYYY-MM-DDTHH:mm:ss');

    this.state = {
      ticketId: ticket[0],
      lineId: ticket[1],
      betDate: betDate,
      nextDates: this._getNextDates(betDate),
      ticketsData: [],
      ticketsHistoryData: [],
      drawingsHistoryData: []
    };
  }

  componentDidMount() {
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { user, lfgAction } = this.props;
    if (user.isLoggedIn) {
      // format should be 2016-01-01T00:00:00
      let beginTime = moment('2016-01-01T00:00:00').format('YYYY-MM-DDTHH:mm:ss');
      let endTime = moment().format('YYYY-MM-DDTHH:mm:ss');
      // console.log(beginTime, endTime);
      lfgAction.postBetHistory({ accessToken: user.info.token, accountId: user.info.sub, beginTime: beginTime, endTime: endTime })
        .then((res1) => {
          this.setState({ ticketsHistoryData: res1.betHistory.TicketRecords });

          lfgAction.postOpenBet({ accessToken: user.info.token, accountId: user.info.sub })
            .then((res2) => {
              this.setState({ ticketsData: res2.openbet.TicketRecords });

            });
          // setTimeout(() => {
          //   $(".lottery-tickets").removeClass("loading-pulse");
          //   $("#ticketsTable").show();
          // }, 1000);

          let drawDate = '', lotteryId;
          res1.betHistory.TicketRecords.map((tix, i) => {
            if (moment(tix.RecordTime).format('YYYY-MM-DDTHH:mm:ss') === this.state.betDate) {
              //console.log(tix.ResponseBody.lifespan.drawingType);
              drawDate = moment(this._getDrawDate(tix.ResponseBody.lifespan.drawingType)).format("YYYY-MM-DD");
              //console.log(drawDate);
              lotteryId = tix.ResponseBody.lotteryId;
            }
          });

          lfgAction.fetchDrawingsHistory(YUAN.abbr, lotteryId, drawDate)
            .then((res3) => {
              // console.log('drawings history', res3);
              this.setState({
                drawingsHistoryData: res3.drawingsHistory
              });

              // document.getElementById("historyPreloader").classList.remove("loading-pulse");
            });


        });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // $("span.drawNumbersPreloader").addClass("loading-pulse");
    $("span.drawNumbersPreloader").show();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.drawingsHistoryData.length > 0) {
      // $("span.drawNumbersPreloader").removeClass("loading-pulse");
      $("span.drawNumbersPreloader").hide();
    }
  }

  _getNextDates(d) {
    let theDay = new Date(d), day = theDay.getDay();
    let weekdays=new Array(7);

    for(let i=0; i < weekdays.length; i++) {
      let month = theDay.getMonth() + 1;
      let year = theDay.getFullYear();
      let dayNum, dayObj;

      dayNum = theDay.getDate() - day + i; //(day === 0 ? -6 : i);
      if (dayNum <= theDay.getDate()) {
        dayNum += 7;
      }
      //console.log(i, dayNum);
      dayObj = new Date(new Date().setDate(dayNum));
      //console.log("dayObj ", dayObj.getDate());

      if (dayObj.getDate() < theDay.getDate()) {
        if (month === 12) {
          month = 1;
        }
        year += 1;
      }
      //console.log(dayObj.getFullYear() + "/" + (dayObj.getMonth() + 1) + "/" + dayObj.getDate());
      weekdays[i] = new Date(year + "/" + month + "/" + dayObj.getDate());
    }

    return weekdays;
  }

  _getDrawDate(drawingType) {
    const { nextDates } = this.state;

    if (drawingType.length > 0 && (drawingType.length < 3)) {
      let dayStr = getDayString(drawingType);
      let res = '';

      nextDates.map(function(dt, idx) {
        let dayName = dt.toString().split(' ')[0];
        if (dayStr.toUpperCase() === dayName.toUpperCase()) {
          res = dt;
        }
      });

      return res;
    } else {
      return;
    }
  }

  render () {
    const { lotteryData } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { ticketId, lineId, ticketsData, ticketsHistoryData, drawingsHistoryData } = this.state;

    let alltickets = _.concat(ticketsData, ticketsHistoryData);

    // let tix = _.find(alltickets, ['ResponseBody.ticketId', ticketId]);

    let ticketListing = [];
    alltickets.map((tix, h) => {
      lotteryData.map((lotto, i) => {

        if (lotto.id == tix.ResponseBody.lotteryId) {
          if (ticketId == tix.ResponseBody.ticketId) {

            let betDate = moment(tix.RecordTime).format('YYYY/MM/DD HH:mm');
            let winnings = tix.Winnings;

            let numbers, addlNumbers, drawNumbers = [], lineNumbers = [];
            let gameSpecialNum = "", withExtraGame = "";
            switch (tix.ResponseBody.lotteryId) {
              case "euroMillions":
                gameSpecialNum = "num-star icon";
                break;
              case "powerBall":
                gameSpecialNum = "num-ball red";
                break;
              case "megaMillions":
                gameSpecialNum = "num-ball purple";
                break;
              default:
                gameSpecialNum = "num-ball dark";
            }

            if (_.isArray(tix.ResponseBody.options)) {
              tix.ResponseBody.options.map((option) => {
                if (option === "megaplier") {
                  withExtraGame = "(with MegaPlier)";
                } else if (option === "powerPlay") {
                  withExtraGame = "(with PowerPlay)";
                }
              });
            }

            tix.ResponseBody.lines.map((line, j) => {
              if (lineId == line.id) {
                let numbers = line.numbers.map((n, k) => {
                  return (<span key={"nums"+(k+1)} className="num-ball">{n}</span>);
                });
                let addlNumbers = line.additionalNumbers.map((an, l) => {
                  let num2 = an; //(tix.ResponseBody.lotteryId === 'euroMillions') ? <p>{an}</p> :
                  return (<span key={"addlNums"+(l+1)} className={gameSpecialNum}>{num2}</span>);
                });
                lineNumbers.push(
                  <tbody key={"tbody"+(j+1)}>
                    <tr>
                      <td>{/* bet number */}
                        <div className="numbers">
                          {numbers}
                          <i className="fa fa-plus" aria-hidden="true"></i>
                          {addlNumbers}
                          &nbsp;&nbsp;{withExtraGame}
                        </div>
                      </td>
                      <td colSpan="3" className="align-left">{lotto.name}</td>
                    </tr>
                  </tbody>
                );
              }
            });

            if (_.isArray(drawingsHistoryData)) {
              drawingsHistoryData.map((history, i) => {
                numbers = history.numbers.map((n, k) => {
                  return (<span key={"nums"+(k+1)} className="num-ball">{n}</span>);
                });
                addlNumbers = history.additionalNumbers.map((an, l) => {
                  return (<span key={"addlNums"+(l+1)} className={gameSpecialNum}>{an}</span>);
                });

                drawNumbers.push(
                  <section key={"N_"+(i+1)} className="numbers">
                    {numbers}
                    <i className="fa fa-plus" aria-hidden="true"></i>
                    {addlNumbers}
                  </section>
                );
              });
            }


            ticketListing.push(
              <table id="ticketDetailsTable" key={"table_"+(tix.ResponseBody.ticketId)}>
                {lineNumbers}
                <tbody>
                  <tr>
                    <td>{/* bet date */}
                      {betDate}
                    </td>
                    <td>{/* bet status */}
                      {(winnings > 0) ? '中獎' : '未中獎'}
                    </td>
                    <td>{/* bonus */}
                      {YUAN.unicode} {winnings}
                    </td>
                    <td>
                      <span className="drawNumbersPreloader loading-pulse">&nbsp;</span>
                      {drawNumbers}
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          }
        }

      });
    });

    return (
      <div>
        <section id="my-lottery-details">
          <div className="section group">
            <div className="12u" id="detailsTableWrapper">
              {ticketListing}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lotteryData: state.lotteryData
  };
};

export default connect(mapStateToProps)(MyLotteryDetails);

'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import $ from 'jquery';
import ReactPaginate from 'react-paginate';
import cookie from 'react-cookie';
import { getDayString, abbreviateNumber, combinations } from '../../utils/util';

class MyLottery extends Component {
  constructor (props) {
    super(props);

    this.state = {
      token: cookie.load('access_token'),
      activeTab: '#tab1',
      ticketsData: [],
      ticketsHistoryData: [],
      tickets_page: 1,
      tickets_per_page: 10,
      ticketDrawingsData: [],
      bhCtr: 0,
      obCtr: 0,
      innerCtr: 0,
      lotteriesData: []
    };

    this._handlePageClick = this._handlePageClick.bind(this);
    // this._toggleRow = this._toggleRow.bind(this);
    this._getDrawingsById = this._getDrawingsById.bind(this);
  }

  componentWillMount() {
    const { token } = this.state;
    if (token == undefined){
      return browserHistory.push('/');
    }
  }

  componentDidMount() {
    this.setState({ activeTab: '#tab1' });

    $(".lottery-tickets").addClass("loading-pulse");
    $("#ticketsTable").hide();

    const { user, lfgAction } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    if (user.isLoggedIn) {
      // console.log('token expired',this.props.keycloak.isTokenExpired());

      lfgAction.fetchLotteries()
      .then((res) => {

        this.setState({ lotteriesData: res.lotteries });

        // show tickets history for last 30 days
        // format should be 2016-01-01T00:00:00
        let beginTime = moment().subtract(30,'days').format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment().tz('Asia/Shanghai').format('YYYY-MM-DDTHH:mm:ss');
        lfgAction.postBetHistory({ accessToken: user.info.token, accountId: user.info.sub, beginTime: beginTime, endTime: endTime })
          .then((res1) => {
            this.setState({ ticketsHistoryData: res1.betHistory.TicketRecords });

            this._getDrawingsById(res1.betHistory.TicketRecords, 'bethistory');

            lfgAction.postOpenBet({ accessToken: user.info.token, accountId: user.info.sub })
              .then((res2) => {
                this.setState({ ticketsData: res2.openbet.TicketRecords });

                this._getDrawingsById(res2.openbet.TicketRecords, 'openbets');

              });
              setTimeout(() => {
                $(".lottery-tickets").removeClass("loading-pulse");
                $("#ticketsTable").show();
              }, 1000);
          })
          .catch((err1) => {
            if (err1.statusCode === 500) {
              if (this.props.keycloak.isTokenExpired()) {
                cookie.remove('access_token');
                cookie.remove('merchant_id');
                cookie.remove('id_token');
                this.props.keycloak.logout();
              }
            }
          });
      });
    }
  }

  _getDrawingsById (ticketRecords, idfr) {
    let ctr;
    if (idfr == 'bethistory') {
      ctr = this.state.bhCtr;
    } else if (idfr == 'openbets') {
      ctr = this.state.obCtr;
    }
    const { lfgAction } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    if (ticketRecords.length > 0) {
      if (ctr === ticketRecords.length-1) {
        if (idfr == 'bethistory') {
          this.setState({ bhCtr: 0 });
        } else if (idfr == 'openbets') {
          this.setState({ obCtr: 0 });
        }
      }

      let tix = ticketRecords[ctr];

      let innerCtr = this.state.innerCtr;
      let self = this;
      if (tix.ResponseBody.lifespan.participations) {
        innerGetDrawings(tix, idfr);
      } else {
        let drawingArray = this.state.ticketDrawingsData;
        let drawIdExists = _.find(drawingArray, ['id', tix.ResponseBody.firstDraw]);
        if (_.isEmpty(drawIdExists)) {
          lfgAction.fetchDrawingsByDrawId(YUAN.abbr, tix.ResponseBody.firstDraw)
            .then((res) => {
              drawingArray.push(res.drawingsResult);

              this.setState({ ticketDrawingsData: drawingArray });

              ctr++;
              if (ctr < ticketRecords.length) {
                if (idfr == 'bethistory') {
                  this.setState({ bhCtr: ctr });
                } else if (idfr == 'openbets') {
                  this.setState({ obCtr: ctr });
                }
                this._getDrawingsById(ticketRecords,idfr);
              }
            });
        } else {
          ctr++;
          if (ctr < ticketRecords.length) {
            if (idfr == 'bethistory') {
              this.setState({ bhCtr: ctr });
            } else if (idfr == 'openbets') {
              this.setState({ obCtr: ctr });
            }
            this._getDrawingsById(ticketRecords,idfr);
          }
        }
      }

      function innerGetDrawings(t, idr, e) {
        let participations = t.ResponseBody.lifespan.participations;

        if (innerCtr == participations.length-1) {
          // innerCtr = 0;
          self.setState({ innerCtr: 0 });
        }

        let part = participations[innerCtr];

        let drawingArray = self.state.ticketDrawingsData;
        let drawIdExists = _.find(drawingArray, ['id', part.drawingId]);
        if (_.isEmpty(drawIdExists)) {
          lfgAction.fetchDrawingsByDrawId(YUAN.abbr, part.drawingId)
            .then((res) => {
              drawingArray.push(res.drawingsResult);

              self.setState({ ticketDrawingsData: drawingArray });

              innerCtr++;
              if (innerCtr < participations.length) {
                self.setState({ innerCtr: innerCtr });
                innerGetDrawings(t, idr);
              } else {
                self.setState({ innerCtr: 0 });
                ctr++;
                if (ctr < ticketRecords.length) {
                  if (idfr == 'bethistory') {
                    self.setState({ bhCtr: ctr });
                  } else if (idfr == 'openbets') {
                    self.setState({ obCtr: ctr });
                  }
                  self._getDrawingsById(ticketRecords,idfr);
                }
              }

            });
        } else {
          innerCtr++;
          if (innerCtr < participations.length) {
            self.setState({ innerCtr: innerCtr });
            innerGetDrawings(t, idr);
          } else {
            self.setState({ innerCtr: 0 });
            ctr++;
            if (ctr < ticketRecords.length) {
              if (idfr == 'bethistory') {
                self.setState({ bhCtr: ctr });
              } else if (idfr == 'openbets') {
                self.setState({ obCtr: ctr });
              }
              self._getDrawingsById(ticketRecords,idfr);
            }
          }
        }
      }

      // let drawingArray = this.state.ticketDrawingsData;
      // let drawIdExists = _.find(drawingArray, ['id', tix.ResponseBody.firstDraw]);
      // if (_.isEmpty(drawIdExists)) {
      //   lfgAction.fetchDrawingsByDrawId(YUAN.abbr, tix.ResponseBody.firstDraw)
      //     .then((res) => {
      //       drawingArray.push(res.drawingsResult);

      //       this.setState({ ticketDrawingsData: drawingArray });

      //       ctr++;
      //       if (ctr < ticketRecords.length) {
      //         if (idfr == 'bethistory') {
      //           this.setState({ bhCtr: ctr });
      //         } else if (idfr == 'openbets') {
      //           this.setState({ obCtr: ctr });
      //         }
      //         this._getDrawingsById(ticketRecords,idfr);
      //       }
      //     });
      // } else {
      //   ctr++;
      //   if (ctr < ticketRecords.length) {
      //     if (idfr == 'bethistory') {
      //       this.setState({ bhCtr: ctr });
      //     } else if (idfr == 'openbets') {
      //       this.setState({ obCtr: ctr });
      //     }
      //     this._getDrawingsById(ticketRecords,idfr);
      //   }
      // }

    }
  }

  _handleTabClick (e) {
    e.preventDefault();

    let currentHrefValue = e.currentTarget.href;
    currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);

    this.setState({ activeTab: currentHrefValue });
  }

  _getPaginatedItems(items, page) {
    let _page = page || 1;
    let per_page = this.state.tickets_per_page;
    let offset = (_page - 1) * per_page;
    return items.slice(offset, offset + per_page);
  }

  _handlePageClick(data) {
    this.setState({
      tickets_page: data.selected + 1
    })
  }

  _toggleRow(ticketId, e) {
    e.preventDefault();

    $(this.refs["anchor"+ticketId]).toggleClass('rotate90');
    $(this.refs[ticketId]).toggleClass('showHiddenRow');
  }


  render () {
    let tab1, tab2;
    if (this.state.activeTab === '#tab1'){
      tab1 = 'active';
      tab2 = '';
    } else {
      tab1 = '';
      tab2 = 'active';
    }

    const { lotteryData, localeData } = this.props;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { ticketsData, ticketsHistoryData, ticketDrawingsData, lotteriesData } = this.state;

    let alltickets = _.sortBy(_.concat(ticketsData, ticketsHistoryData), "RecordTime").reverse();
    // let alltickets = _.sortBy(ticketsData.concat(ticketsHistoryData), "RecordTime").reverse();
    // let alltickets = _.sortBy(ticketsHistoryData, "RecordTime").reverse();

    let paginatedTickets = [];
    let page_num = 1;
    if (alltickets.length != 0){
      page_num = Math.ceil(alltickets.length / this.state.tickets_per_page);
      paginatedTickets = this._getPaginatedItems(alltickets, this.state.tickets_page);
    }

    let ticketListing = [];
    paginatedTickets.map((tix, h) => {
      lotteryData.map((lotto, i) => {

        if (lotto.id == tix.ResponseBody.lotteryId) {

          let betDate = moment(tix.RecordTime).tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm');
          // let betCount = (tix.ResponseBody.lines.length > 1) ? tix.ResponseBody.lines.length : '單次下注';

          let winnings = tix.Winnings;
          let status;
          // if (tix.DrawResult) {
            if (parseInt(tix.DrawResult, 10) === 2) {
              status = '未中奖'; // Not winning
            } else if (parseInt(tix.DrawResult, 10) === 1) {
              status = '赢了'; // Won
            } else {
              if (tix.ResponseBody.lifespan.duration > 1) {
                status = '部分开奖'; //Part of the lottery
              } else {
                status = '未开奖'; //Not open
              }
            }
          // } //'未开奖';
          let betDuration = (tix.ResponseBody.lifespan.duration > 1) ? `${tix.ResponseBody.lifespan.duration}周` : '单次下注';

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
                withExtraGame = "(使用 百万倍数)";
              } else if (option === "powerPlay") {
                withExtraGame = "(使用 威力倍数)";
              }
            });
          }

          let gameData = _.find(this.props.lotteryData, ['id', lotto.id]);
          let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

          let lotteryInfo = _.find(lotteriesData, ['id', lotto.id]);
          let set1PickLimit = (lotteryInfo) ? lotteryInfo.systems[0].numbers : null;
          let set2PickLimit = (lotteryInfo) ? lotteryInfo.systems[0].additionalNumbers : null;

          let numberSet = [];
          tix.ResponseBody.lines.map((line, j) => {
            let lineNumbers = [];
            let _winningsTitle = '奖金';

            let numbers = [];
            let addlNumbers = [];
            let ticketDetailsClassName;
            let comboBetMultiplier = 0;

            if (line.type == 'NORMAL') {
              line.numbers.map((n, k) => {
                numbers.push(<span key={"nums"+(k+1)} className="num-ball">{n}</span>);
              });
              line.additionalNumbers.map((an, l) => {
                addlNumbers.push(<span key={"addlNums"+(l+1)} className={gameSpecialNum}>{an}</span>);
              });
              ticketDetailsClassName = "numbers";
            } else {
              line.numbers.map((n, k) => {
                numbers.push(<span key={"comboBetS1_"+(k+1)} className="num-ball">{n}</span>);
              });
              line.additionalNumbers.map((an, l) => {
                addlNumbers.push(<span key={"comboBetS2_"+(l+1)} className={gameSpecialNum}>{an}</span>);
              });
              ticketDetailsClassName = "numbers combo-bet";
              let combi1 = combinations(line.numbers.length, set1PickLimit);
              let combi2 = combinations(line.additionalNumbers.length, set2PickLimit);
              comboBetMultiplier = combi1 * combi2;
            }

            if (tix.ResponseBody.lifespan.participations) {
              _winningsTitle = (tix.ResponseBody.lifespan.participations.length > 1) ? '奖金' : '';

              tix.ResponseBody.lifespan.participations.map((part, pid) => {
                // let drawObj = _.find(ticketDrawingsData, ['id', tix.ResponseBody.firstDraw]);
                let drawDate = '';
                if (_.isArray(ticketDrawingsData)){
                  ticketDrawingsData.map((td, idx) => {
                    if (td.id === part.drawingId) {
                      drawDate = moment(td.drawingDate).tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm');
                    }
                  });
                }

                let _winnings = (tix.ResponseBody.lifespan.participations.length > 1) ? YUAN.unicode + ' ' + (part.winnings / 100).toFixed(2) : '';
                let _status = '';
                if (part.state !== 'EVALUATED') {
                  _status = '未开奖';
                } else {
                  if (part.state === 'EVALUATED' && (part.winnings / 100) <= 0) {
                    _status = '未中獎';
                  }
                }


                lineNumbers.push(
                  <tr key={"tr_"+(j+1)+'_'+(pid+1)}>
                    <td>{/* bet number */}
                      <div key={"ticketDetails"+j} className={ticketDetailsClassName}>
                        {numbers}
                        {line.type != 'NORMAL' &&
                          <br />
                        }
                        {line.additionalNumbers.length > 0 &&
                        <i className="fa fa-plus" aria-hidden="true"></i>
                        }
                        {addlNumbers}
                        {line.type != 'NORMAL' &&
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;包牌{comboBetMultiplier}組號碼</span>
                        }
                        &nbsp;&nbsp;{withExtraGame}
                      </div>
                    </td>
                    <td>{/* participation date */}
                      {drawDate}
                    </td>
                    <td>{/* bet status */}
                      {_status}
                    </td>
                    <td>{/* bonus */}
                      {_winnings}
                    </td>
                    {/*<td className="align-center">{/* details link * / }
                      <Link to={"/my-lottery-details/"+tix.ResponseBody.ticketId+","+j+"/"+betDateLink}>詳情</Link>
                    </td>*/}
                    <td className="align-center">{/* play again link */}
                      <Link to={"/lfg/"+tix.ResponseBody.lotteryId.toLowerCase()}>再次投注</Link>
                    </td>
                  </tr>
                );

              });

            } else {
              // let drawObj = _.find(ticketDrawingsData, ['id', tix.ResponseBody.firstDraw]);
              let drawDate = '';
              if (_.isArray(ticketDrawingsData)){
                ticketDrawingsData.map((td, idx) => {
                  if (td.id === tix.ResponseBody.firstDraw) {
                    drawDate = moment(td.drawingDate).tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm');
                  }
                });
              }

              lineNumbers.push(
                <tr key={"tr_"+(j+1)}>
                  <td>{/* bet number */}
                    <div key={"ticketDetails"+j} className="numbers">
                      {numbers}
                      {line.additionalNumbers.length > 0 &&
                      <i className="fa fa-plus" aria-hidden="true"></i>
                      }
                      {addlNumbers}
                      &nbsp;&nbsp;{withExtraGame}
                    </div>
                  </td>
                  <td>{/* participation date */}
                    {drawDate}
                  </td>
                  <td>{/* bet status */}
                    {status}
                  </td>
                  <td>{/* bonus */}
                    {YUAN.unicode} {(winnings / 100).toFixed(2)}
                  </td>
                  {/*<td className="align-center">{/* details link * / }
                    <Link to={"/my-lottery-details/"+tix.ResponseBody.ticketId+","+j+"/"+betDateLink}>詳情</Link>
                  </td>*/}
                  <td className="align-center">{/* play again link */}
                    <Link to={"/lfg/"+tix.ResponseBody.lotteryId.toLowerCase()}>再次投注</Link>
                  </td>
                </tr>
              );
            }


            numberSet.push(
              <table id="ticketDetails" key={"tbl"+(j+1)}>
                <thead>
                  <tr>
                    <th>投注号码</th><th>彩票开奖时间</th><th>状态</th><th>{_winningsTitle}</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {lineNumbers}
                </tbody>
              </table>
            );
          });

          ticketListing.push(
            <tbody key={"tbody_"+(tix.ResponseBody.ticketId)}>
              <tr onClick={this._toggleRow.bind(this, tix.ResponseBody.ticketId)} className="ticketRow">
                <td>{tix.ResponseBody.ticketId}</td>
                <td>{betDate}</td>
                <td>{lotto.name}</td>
                <td>{/* bet time */}
                  {betDuration}
                </td>
                <td>{/* bet status */}
                  {status}
                </td>
                <td>{/* bonus */}
                  {YUAN.unicode} {(winnings / 100).toFixed(2)}
                </td>
                <td className="text-right wide30"><a ref={"anchor"+tix.ResponseBody.ticketId} className=""><span className="icon fa-chevron-right"></span></a></td>
              </tr>
              <tr ref={tix.ResponseBody.ticketId} className="hiddenRow">
                <td colSpan="7">
                  {numberSet}
                </td>
              </tr>
            </tbody>
          );

        }

      });
    });


    return (
      <div>
        <header id="heading-title">
          <h1>{localeData['heading.title']}</h1>
        </header>

        <section id="my-lottery">
          <div className="section group">
            <div className="12u">
              <section id="tab-section">
                <div className="tabs">
                  <ul className="tab-links">
                    <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}>{localeData['myLottery.tab1.title']}</a></li>
                    {/*<li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}>刮刮樂</a></li>*/}
                  </ul>
                  <div className="tab-content">
                    <div id="tab1" className={`tab ${tab1}`}>
                      <div className="lottery-tickets">
                        <table id="ticketsTable">
                          <thead>
                            <tr>
                              <th>{localeData['ticketsTable.col1.title']}{/* ticket id */}</th>
			      <th>{localeData['ticketsTable.col2.title']}{/* bet date */}</th>
			      <th>{localeData['ticketsTable.col3.title']}{/* lotto name */}</th>
			      <th>投注方式</th>
			      <th>状态</th>
			      <th>奖金</th>
			      <th>&nbsp;</th>
                            </tr>
                          </thead>
                          {ticketListing}
                        </table>
                      </div>
                      <ReactPaginate previousLabel={"\u276E"}
                                       nextLabel={"\u276F"}
                                       breakLabel={<a href="">...</a>}
                                       breakClassName={"break-me"}
                                       pageNum={page_num}
                                       marginPagesDisplayed={5}
                                       pageRangeDisplayed={5}
                                       clickCallback={this._handlePageClick}
                                       containerClassName={"pagination"}
                                       subContainerClassName={"pages pagination"}
                                       activeClassName={"pageActive"} localeData={localeData}/>
                      {/*<div className="row">
                        <div className="pull-right"><a href="#">較舊的紀錄</a></div>
                      </div>*/}
                    </div>

                    {/*<div id="tab2" className={`tab ${tab2}`}>
                      <div className="scratchcards">
                        <table>
                          <thead>
                            <tr>
                              <th>購買日期</th><th>刮刮樂種類</th><th>獎金</th><th>&nbsp;</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>2016 / n / n xx:xx</td><td>EuroJackpot</td><td>$ 0</td><td className="text-right wide50"><a href="#">再刮一張</a></td>
                            </tr>
                            <tr>
                              <td>2016 / n / n xx:xx</td><td>EuroJackpot</td><td>$ 0</td><td className="text-right wide50"><a href="#">再刮一張</a></td>
                            </tr>
                            <tr>
                              <td>2016 / n / n xx:xx</td><td>EuroJackpot</td><td>$ 0</td><td className="text-right wide50"><a href="#">再刮一張</a></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="row">
                        <div className="pull-right"><a href="#">較舊的紀錄</a></div>
                      </div>
                    </div>*/}
                  </div>
                </div>
              </section>
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
    ajaxStatus: state.ajaxStatus,
    lotteryData: state.lotteryData
  };
};

export default connect(mapStateToProps)(MyLottery);

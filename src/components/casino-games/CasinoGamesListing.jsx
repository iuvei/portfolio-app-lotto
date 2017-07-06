'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import _ from 'lodash';
import ReactPaginate from 'react-paginate';
import { _getBreakpoint } from '../utils/util';
// import NoImageFound from '../../../public/images/no_image.png';
import $ from 'jquery';
import Modal from 'react-modal';
import CasinoPlay from '../casino-play/CasinoPlay';

class CasinoGamesListing extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: '#tab1',
      casinoGames_page: 1,
      casinoGames_per_page: 40,
      casinoGame_id: '',
      windowWidth: window.innerWidth,
      sortBy: '',
      filter: {},
      modalIsOpen: false,
      GameData: {},
      iFrameData: {},
    };
    this._handlePageClick = this._handlePageClick.bind(this);
    this._sortCasinoGames = this._sortCasinoGames.bind(this);
    this._handleNoImage = this._handleNoImage.bind(this);
    // this._createGame = this._createGame.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._handleFilterButtons = this._handleFilterButtons.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  _showModal(game, e) {
    e.preventDefault();
    let data = {
      username: this.props.user.info.preferred_username,
      user_id: this.props.user.info.sub,
      game_id: game.game_id,
      play_for_fun: 1
    };
    this.setState({GameData: game, iFrameData:data});
    this.setState({modalIsOpen: true, });
    this.props.casinoPlayAction.casinoPlay(data);
  }

  _closeModal() {
    this.setState({modalIsOpen: false});
  }
  componentDidMount() {
    // document.getElementById("casino-lobby").classList.add("loading-pulse-black");
    document.getElementById("game-listing").classList.add("loading-pulse-black");
    this.setState({ activeTab: '#tab1' });
    window.addEventListener('resize', this._handleResize);
  }

  componentWillMount(){
    const brkPt = _getBreakpoint(this.state.windowWidth);
    if(brkPt === 'XS' || brkPt === 'S')
      this.props.casinoGamesAction.loadCasinoGames({play_for_fun_supported:true, mobile:true});
    else
      this.props.casinoGamesAction.loadCasinoGames({play_for_fun_supported:true});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _handleTabClick (e) {
    e.preventDefault();

    let currentHrefValue = e.currentTarget.href;
    currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);

    this.setState({ activeTab: currentHrefValue });
  }

  _getPaginatedItems(items, page) {
  	let _page = page || 1;
    let per_page = this.state.casinoGames_per_page;
  	let offset = (_page - 1) * per_page;
    return items.slice(offset, offset + per_page);
  }

  _handlePageClick = (data) => {
    this.setState({
      casinoGames_page: data.selected + 1
    })
  }

  _createGame (val, e) {
    e.preventDefault();
    let data = {
      username: this.props.user.info.preferred_username,
      user_id: this.props.user.info.sub,
      game_id: val,
      play_for_fun: 1
    };
    this.setState({GameData: data});
    this.props.casinoPlayAction.casinoPlay(data);

  }
  _sortCasinoGames(e) {
    e.preventDefault();

    if (e.target.value.length > 0) {
      let strCurrSort = e.target.value.toString();

      this.setState({sortBy: strCurrSort});
    }
  }

  _handleNoImage(e){
    e.target.src = "/images/no_image.png";
    // hide element
    // e.target.parentNode.parentNode.parentNode.className="hidden";
  }

  _handleFilterButtons(e){
    e.preventDefault();
      $("#game-filter").fadeTo(100, 0.1);
      this.setState({filter : JSON.parse($(e.target).attr("data-rel"))});
      $("#game-filter").fadeTo(300, 1);

  }
  _drawHTMLforDesktop (CasinoGames) {
    return (
      <div className="game-holder">
        {
          _.chunk(CasinoGames, 10).map((list, listIndex) => {
            return <div id="six-col-box" className="box alt " key={listIndex}>
              <div className="row uniform  game-container">
                {
                  list.map((game, index) => {
                    return <section className={"2u 4u(xsmall)"} key={game._id} onClick={this._showModal.bind(this, game)}>
                      <img src={game.image} className="game-item desktop" onError={this._handleNoImage}/>
                        {
                          game.category ? <div className="ribbon-wrapper">
                              <span className="ribbon">{game.category}</span>
                            </div> : null
                        }
                        {
                           game.new == "1"  ? <div className="rosette-wrapper">
                              <div className="rosette-circle">NEW</div>
                            </div> : null
                        }
                      <h5 className="fourthRowName"><strong>{game.name}</strong></h5>
                    </section>
                  })
                }
              </div>
            </div>
          })
        }
      </div>
    );
  }

  _drawHTMLforMobile (CasinoGames) {
    // let { casinoVideoSlotGames} = this.props;
    return (
      <div>
        {
           _.chunk(CasinoGames, 4).map((list, listIndex) => {
            return <div id="two-col-box" className="box alt" key={listIndex}>
              <div className="row uniform  game-container">
                {
                  list.map((game, index) => {
                    return <section className="6u 6u(medium)" key={game._id} onClick={this._showModal.bind(this, game)}>
                      <img src={game.image} className="game-item mobile"  onError={this._handleNoImage}/>
                        {
                          game.category ? <div className="ribbon-wrapper">
                              <span className="ribbon">{game.category}</span>
                            </div> : null
                        }
                        {
                           game.new ? <div className="rosette-wrapper">
                              <div className="rosette-circle">NEW</div>
                            </div> : null
                        }

                      <div className="fourthRowName"><strong>{game.name}</strong></div>
                    </section>
                  })
                }
              </div>
            </div>
          })
        }
      </div>
    );
  }
  render () {
    const brkPt = _getBreakpoint(this.state.windowWidth);
    let { casinoGames, ajaxStatus } = this.props;
    let html;
    // if (!ajaxStatus.isLoading && !_.isEmpty(document.getElementById("casino-lobby"))){
    if (!ajaxStatus.isLoading && !_.isEmpty(document.getElementById("game-listing"))){
      document.getElementById("game-listing").classList.remove("loading-pulse-black");
    }
    if (_.isEmpty(casinoGames)) {
      casinoGames = [];
    }
    let tab1, tab2;
    if (this.state.activeTab === '#tab1'){
      tab1 = 'active';
      tab2 = '';
    } else {
      tab1 = '';
      tab2 = 'active';
    }
    let paginatedGames = [];
    let page_num = 1;
    if (casinoGames.length != 0){
      page_num = Math.ceil(casinoGames.length / this.state.casinoGames_per_page);
      paginatedGames = this._getPaginatedItems(casinoGames, this.state.casinoGames_page);
    }
    // let images =  _.sortBy(paginatedGames, this.state.sortBy).map((obj, i) => {
    //   return (
    //     <div>
    //       <div key={obj._id} className="gray-box casino-box">
    //         <div className="casino-img"><img src={obj.image}  onError={this._handleNoImage} onClick={this._createGame.bind(this, obj.game_id)} /></div>
    //         <div className="box-content">
    //           <div className="sc-info">{obj.name}</div>
    //         </div>
    //         <div className="box-actions">
    //           <span onClick={this._createGame.bind(this, obj.game_id)} className="button special small">開始玩！</span>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // });

    let sortCasinoGames =  _.sortBy(paginatedGames, this.state.sortBy);
    let CasinoGames;
    if(Object.keys(this.state.filter).length){
      CasinoGames = _.filter(paginatedGames, this.state.filter);
    }
    else {
      CasinoGames = sortCasinoGames;
    }

    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile(CasinoGames);
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    } else {
      html = this._drawHTMLforDesktop(CasinoGames);
      // html = '';
    }
    return (

        <section id="tab-section" className="casino-games">
         {/* <div className="tabs">
                     <ul className="tab-links">
                       <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}><h1 className="tab-title">游戏！</h1><span className="tab-subtitle">即玩即中！</span></a></li>
                       <li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}><h1 className="tab-title">Categories</h1></a></li>
                     </ul>
                     <div className="tab-content">

                         <div id="tab1" className={`tab ${tab1}`}>*/}
                  <div id="casino-lobby">
                    <header id="heading-title">
                      <span className="welcome-text">
                        <h1>游戏！</h1>
                        <span className="box-subtitle">即玩即中！</span>
                      </span>
                      <span className="sort-by">
                        <span className="btn-filters">
                          <button className="button game-filter" data-rel="{}" onClick={this._handleFilterButtons}>全部游戏</button>
                          <button className="button game-filter" data-rel='{"new":"1"}'  onClick={this._handleFilterButtons}>新游戏</button>
                          <button className="button game-filter" data-rel='{"type":"video-slots"}'  onClick={this._handleFilterButtons}>老虎机游戏</button>
                          <button className="button game-filter" data-rel='{"type":"livecasino"}'  onClick={this._handleFilterButtons}>真人赌场游戏</button>
                          </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="labelForSelect">排列方式 :</span>
                        <span className="select-wrapper small">
                          <select name="sortLotteries" id="sortLotteries" onChange={this._sortCasinoGames} value={this.state.sortBy}>
                            <option value="">请选择</option>
                            <option value="category">类别</option>
                            <option value="lotteryId">名称</option>
                            <option value="jackpots[0].marketingJackpot">最高奖金</option>
                            <option value="closingDate">即将开奖时间</option>
                          </select>
                        </span>
                      </span>
                    </header>
                    <section id="game-listing">
                      <div className="section">
                        <div id="game-lists" className="gray-box">
                          <div className="box-content" id="game-filter">
                            {html}
                          </div>
                        </div>
                      </div>
                    </section>
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
                                   activeClassName={"pageActive"} />
             {/* </div>


                           <div id="tab2" className={`tab ${tab2}`}>
                             <section id="game-categories">
                               <div className="section">
                               </div>
                             </section>
                           </div>
                         </div>
                       </div>
             */}
            <Modal
              ref="modalCasinoPlay"
              isOpen={this.state.modalIsOpen}
              onRequestClose={this._closeModal}
              className="modal-container modalCasinoPlay"
              overlayClassName="modal-overlay" >
                <div className="modal-header">
                  <span className="close" onClick={this._closeModal}>×</span>
                  <h3>{this.state.GameData.name} - 玩乐</h3>
                </div>
                <div className="modal-body">
                  <CasinoPlay gameData={this.state.GameData} iFrameData={this.state.iFrameData}/>
                </div>

            </Modal>
        </section>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    casinoGames: state.casinoGames,
    casinoPlay: state.casinoPlay
  };
};

export default connect(mapStateToProps)(CasinoGamesListing);

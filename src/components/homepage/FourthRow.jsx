'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { _getBreakpoint } from '../utils/util';
import _ from 'lodash';
import * as casinoGamesAction from '../../actions/casinoGamesActions';
import * as casinoPlayAction from '../../actions/casinoPlayActions';

// import game05 from '../../../public/images/game05.png';
// import game14 from '../../../public/images/game14.jpg';
// import game17 from '../../../public/images/game17.png';
// import game19 from '../../../public/images/game19.jpg';
// import game36 from '../../../public/images/game36.jpg';
// import game41 from '../../../public/images/game41.png';
// import NoImageFound from '../../../public/images/no_image.png';
import Modal from 'react-modal';
import CasinoPlay from '../casino-play/CasinoPlay';

class FourthRow extends Component {
  constructor (props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
      games : [],
      GameData: {},
      iFrameData: {},
    };

    this._handleResize = this._handleResize.bind(this);
    this._handleNoImage = this._handleNoImage.bind(this);
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

  componentWillMount(){
    this.props.casinoGamesAction.loadVideSlotGames({type:"video-slots", limit:30, new:1, play_for_fun_supported:true});
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
    document.getElementById("videoSlotLoader").classList.add("loading-pulse");
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _handleNoImage(e){
      e.target.src = "/images/no_image.png";
  }

  _playGame (val, e) {
    e.preventDefault();
    let data = {
      username: this.props.user.info.preferred_username,
      user_id: this.props.user.info.sub,
      game_id: val,
      play_for_fun: 1
    };
    this.props.casinoPlayAction.casinoPlay(data);

  }

  _drawHTMLforDesktop (casinoVideoSlotGames) {
    // let { casinoVideoSlotGames} = this.props;
    let videoSlotGames = _.chunk(casinoVideoSlotGames, 10);
    return (
      <div>
        {
          videoSlotGames.map((list, listIndex) => {
            return <div id="six-col-box" className="box alt " key={listIndex}>
              <div className="row uniform  game-container">
                {
                  list.map((game, index) => {
                    return <section className="2u 4u(xsmall)" key={game._id} onClick={this._showModal.bind(this, game)}>
                      <img src={game.image} className="game-item desktop" onError={this._handleNoImage}/>
                      {
                        game.category ? <div className="ribbon-wrapper">
                            <span className="ribbon">{game.category}</span>
                          </div> : null
                      }
                      <div className="rosette-wrapper">
                        {/*<div className="rosette-star"></div>*/}
                        <div className="rosette-circle">NEW</div>
                      </div>
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

  _drawHTMLforMobile (casinoVideoSlotGames) {
    // let { casinoVideoSlotGames} = this.props;
    let videoSlotGames = _.chunk(casinoVideoSlotGames, 4);
    return (
      <div>
        {
          videoSlotGames.map((list, listIndex) => {
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
                           game.new == "1"  ? <div className="rosette-wrapper">
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
    let html;
    let { casinoVideoSlotGames, ajaxStatus, localeData } = this.props;

    if (!ajaxStatus.isLoading && !_.isEmpty(document.getElementById("videoSlotLoader"))){
      document.getElementById("videoSlotLoader").classList.remove("loading-pulse");
    }
    if (_.isEmpty(casinoVideoSlotGames)) {
      casinoVideoSlotGames = [];
    }
    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile(casinoVideoSlotGames);
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    } else {
      html = this._drawHTMLforDesktop(casinoVideoSlotGames);
      // html = '';
    }
    return (
      <section id="four">
        <div className="section">
          <div id="casino" className="gray-box">
            <div className="box-title">
              <h3>{localeData['gameBoxes.game3.title']}</h3>
              <span className="box-subtitle">{localeData['gameBoxes.game3.subtitle']}</span>
            </div>
            <hr />
            <div className="box-content" id="casinoVideoSlotGamesContent">
              <div id="videoSlotLoader"></div>
              {html}
            </div>
            <div className="box-link">
                <Link to="/casino-lobby">{localeData['gameBoxes.game3.link']} &#187;</Link>
            </div>
          </div>
        </div>

          <Modal
              ref="modalCasinoPlay"
              isOpen={this.state.modalIsOpen}
              onRequestClose={this._closeModal}
              className="modal-container modalCasinoPlay"
              overlayClassName="modal-overlay" >
                <div className="modal-header">
                  <span className="close" onClick={this._closeModal}>×</span>
                  <h3>{localeData['casinoModalDialog.title'].replace('{casinoGameName}', this.state.GameData.name)}</h3>
                </div>
                <div className="modal-body">
                  <CasinoPlay gameData={this.state.GameData} iFrameData={this.state.iFrameData}/>
                </div>

            </Modal>
      </section>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    casinoVideoSlotGames: state.casinoVideoSlotGames,
    ajaxStatus: state.ajaxStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  casinoGamesAction: bindActionCreators(casinoGamesAction, dispatch),
  casinoPlayAction: bindActionCreators(casinoPlayAction, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(FourthRow);

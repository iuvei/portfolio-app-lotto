'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { _getBreakpoint } from '../utils/util';

import * as casinoGamesFeaturedAction from '../../actions/casinoGamesFeaturedActions';
import * as casinoGamesAction from '../../actions/casinoGamesActions';
import * as casinoPlayAction from '../../actions/casinoPlayActions';

// import game05 from '../../../public/images/game05.png';
// import game14 from '../../../public/images/game14.jpg';
// import game17 from '../../../public/images/game17.png';
// import game19 from '../../../public/images/game19.jpg';
// import game36 from '../../../public/images/game36.jpg';
// import game41 from '../../../public/images/game41.png';
// import NoImageFound from '../../../public/images/no_image.png';
import _ from 'lodash';
import Modal from 'react-modal';
import CasinoPlay from '../casino-play/CasinoPlay';

class ThirdRow extends Component {
  constructor (props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
      casinoGames : [],
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

  componentWillMount() {
    document.getElementById("liveCasinoLoader").classList.add("loading-pulse");
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  componentWillMount(){
    // this.props.casinoGamesFeaturedAction.loadCasinoGamesFeatured({type:"livecasino", limit:12});
     this.props.casinoGamesAction.loadLiveGames({type:"livecasino", limit:12});
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

  _drawHTMLforDesktop (casinoLiveGames) {
    // let { casinoLiveGames} = this.props;
    let liveGames = _.chunk(casinoLiveGames, 10);
    return (
      <div>
        {
          liveGames.map((list, listIndex) => {
            return <div id="six-col-box" className="box alt" key={listIndex}>
              <div className="row uniform game-container">
                {
                  list.map((game, index) => {
                      return <section className="2u 4u(xsmall)" key={game._id} onClick={this._showModal.bind(this, game)}>
                          <img src={game.image} className="game-item desktop"  onError={this._handleNoImage}/>
                          {
                            game.category ? <div className="ribbon-wrapper">
                                <span className="ribbon">{game.category}</span>
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

  _drawHTMLforMobile (casinoLiveGames) {
    // let { casinoLiveGames} = this.props;
    let liveGames = _.chunk(casinoLiveGames, 4);
    return (
      <div>
        {
          liveGames.map((list, listIndex) => {
            return <div id="two-col-box" className="box alt" key={listIndex}>
              <div className="row uniform game-container">
                {
                  list.map((game, index) => {
                      return <section className="6u 6u(medium)" key={game._id} onClick={this._showModal.bind(this, game)}>
                      <img src={game.image} className="game-item mobile"  onError={this._handleNoImage}/>
                        {
                          game.category ? <div className="ribbon-wrapper">
                              <span className="ribbon">{game.category}</span>
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
    let { casinoLiveGames, ajaxStatus, localeData } = this.props;
    if (!ajaxStatus.isLoading && !_.isEmpty(document.getElementById("liveCasinoLoader"))){
      document.getElementById("liveCasinoLoader").classList.remove("loading-pulse");
    }
    if (_.isEmpty(casinoLiveGames)) {
      casinoLiveGames = [];
    }
    let html;
    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile(casinoLiveGames);
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    } else {
      html = this._drawHTMLforDesktop(casinoLiveGames);
      // html = '';
    }
    return (
      <section id="three">
        <div className="section">
          <div id="casino" className="gray-box">
            <div className="box-title">
              <h3>{localeData['gameBoxes.game3.title']}</h3>
              <span className="box-subtitle">{localeData['gameBoxes.game3.subtitle']}</span>
            </div>
            <hr />
            <div className="box-content"  id="liveCasinoGamesContent">
              <div id="liveCasinoLoader"></div>
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
    casinoLiveGames: state.casinoLiveGames,
    ajaxStatus: state.ajaxStatus,

  };
};

const mapDispatchToProps = (dispatch) => ({
    casinoGamesAction: bindActionCreators(casinoGamesAction, dispatch),
    casinoPlayAction: bindActionCreators(casinoPlayAction, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ThirdRow);

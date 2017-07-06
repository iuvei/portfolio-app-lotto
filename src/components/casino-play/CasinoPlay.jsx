'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
// import NoImageFound from '../../../public/images/no_image.png';
import { _getBreakpoint } from '../utils/util';
import * as casinoPlayAction from '../../actions/casinoPlayActions';
import * as casinoGamesAction from '../../actions/casinoGamesActions';

class CasinoPlay extends Component {
  constructor(){
    super();
    window.scrollTo(0, 0);
    this.state = {
      casinoGames : [],
      windowWidth: window.innerWidth,
    }
  }

  componentDidMount(){
    document.getElementById("casino-loading").classList.add("loading-pulse");
    document.getElementById("side-loading").classList.add("loading-pulse");
    // if(this.props.casinoGames.length)
    //     this.setState({casinoGames : this.props.casinoGames})
  }


  componentWillMount(){
      const brkPt = _getBreakpoint(this.state.windowWidth);
    if(brkPt === 'XS' || brkPt === 'S')
      this.props.casinoGamesAction.loadCasinoGames({new:1, play_for_fun_supported:true, limit:10, mobile:true});
    else
      this.props.casinoGamesAction.loadCasinoGames({new:1, play_for_fun_supported:true, limit:10});
    // if(this.props.casinoGames.length)
      // this.setState({casinoGames : this.props.casinoGames})
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
  _renderSideGames(casinoGames) {
      const brkPt = _getBreakpoint(this.state.windowWidth);
      return <div>
        {
            (brkPt === 'XS' || brkPt === 'S') ? _.chunk(casinoGames, 3).splice(0,2).map((list, listIndex) => {
              return <div id="six-col-box" className="box alt " key={listIndex}>
                <div className="row uniform  game-container">
                    {
                      list.map((game, index) => {
                          return <section className="6u 6u(medium)" key={game._id} onClick={this._playGame.bind(this, game.game_id)}>
                                <img src={game.image} className="game-item"  onError={this._handleNoImage}/>
                                <h5 className="fourthRowName"><strong>{game.name}</strong></h5>
                          </section>
                      })
                    }
                  </div>
              </div>  }) : _.chunk(casinoGames, 2).splice(0,4).map((games, i) => {
                return <div className="sidebar-games" key={i}>
                  <div className="column1">
                    <div className="row uniform  game-container" onClick={this._playGame.bind(this, games[0].game_id)}>
                      <section  className="" >
                        <img src={games[0].image} className="game-item" onError={this._handleNoImage}/>
                        <div className="game-name"><strong>{games[0].name}</strong></div>
                      </section>
                    </div>
                  </div>
                  <div className="column2">
                    <div className="row uniform  game-container" onClick={this._playGame.bind(this, games[1].game_id)}>
                      <section  className="" >
                        <img src={games[1].image} className="game-item" onError={this._handleNoImage}/>
                        <div className="game-name"><strong>{games[1].name}</strong></div>
                      </section>
                    </div>
                  </div>
              </div>
            })

        }
      </div>

  }
  render() {

    let { casinoPlay, ajaxStatus, casinoGames } = this.props;
    const brkPt = _getBreakpoint(this.state.windowWidth);

    if (!ajaxStatus.isLoading && !_.isEmpty(document.getElementById("casino-loading"))){
      document.getElementById("casino-loading").classList.remove("loading-pulse");
      document.getElementById("side-loading").classList.remove("loading-pulse");
    }
    if (_.isEmpty(casinoPlay)) {
      casinoPlay = [];
    }

    let sideGames = this._renderSideGames(casinoGames);

    return(
      <div className="casino-play">
        <section className="game-container-casino" ref="rngSection">
          <div id="casino-loading"></div>
            <div className="game-play">
              <section className="game-container-casino">
                <iframe ref="rngame" className="iframe-casino" src={casinoPlay.response} frameBorder="2" scrolling="no" style={{width:"100%"}}/>
              </section>
            </div>

           <div className="side-games" id="">
              <div id="side-loading"></div>
              <h5 className="title">更有趣的游戏！</h5>
                {
                    sideGames
                }
          </div>

        </section>
      </div>
    )

  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    casinoGames: state.casinoGames,
    user: state.user,
    casinoPlay: state.casinoPlay,
    ajaxStatus: state.ajaxStatus,
    gameData : ownProps.gameData,
    iFrameData : ownProps.iFrameData
  };
};

const mapDispatchToProps = (dispatch) => ({
  casinoPlayAction: bindActionCreators(casinoPlayAction, dispatch),
  casinoGamesAction: bindActionCreators(casinoGamesAction, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(CasinoPlay);

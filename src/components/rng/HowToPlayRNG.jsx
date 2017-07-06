'use strict';

import React, { Component } from 'react';
import Modal from 'react-modal';
import { _getBreakpoint } from '../utils/util';

// import rngHTP01 from '../../../public/images/rng_htp_001.png';
// import rngHTP02 from '../../../public/images/rng_htp_002.png';
// import rngHTP03 from '../../../public/images/rng_htp_003.png';
// import rngHTP04 from '../../../public/images/rng_htp_004.png';

export default class HowToPlayRNG extends Component {
  constructor (props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      htpModalImg: '',
      windowWidth: window.innerWidth
    };

    this._closeModal = this._closeModal.bind(this);
  }

  _showModalHTP(imgSrc, e) {
    e.preventDefault();

    this.setState({modalIsOpen: true, htpModalImg: imgSrc});
  }

  _closeModal() {
    this.setState({modalIsOpen: false});
  }
  _showGuide(id, url, e){
    document.getElementById(id).src = url;
  }

  render () {
    const brkPt = _getBreakpoint(this.state.windowWidth);
    let {localeData} = this.props;
    return (
      <div className="box alt">
        <div className="row uniform">
          <section className="3u 12u(medium)">
            <span className="black-box">
              {
                (brkPt === 'XS' || brkPt === 'S') ? <img src={"/images/rng/rng_htp_001_mobile.gif"}  id="hfg1"/> : <img src={"/images/rng/rng_htp_001.gif"}  id="hfg1"/>
              }
            </span>
            <p>{localeData['htp.description1']}</p>
          </section>
          <section className="3u 12u(medium)">
            {
              (brkPt === 'XS' || brkPt === 'S') ?  <span className="black-box" >
                <img src={"/images/rng/rng_htp_002.gif"} id="rng2"/>
              </span> : <span className="black-box"  onMouseOver={this._showGuide.bind(this, 'rng2', "/images/rng/rng_htp_002.gif")} onMouseOut={this._showGuide.bind(this, 'rng2', "/images/rng/rng_htp_002_.gif")}>
                <img src={"/images/rng/rng_htp_002_.gif"} id="rng2"/>
              </span>
            }
            
            <p>{localeData['htp.description2']}</p>
          </section>
          <section className="3u 12u(medium)">
            {
              (brkPt === 'XS' || brkPt === 'S') ?  <span className="black-box">
                <img src={"/images/rng/rng_htp_003.gif"} id="rng3"/>
              </span> : <span className="black-box"  onMouseOver={this._showGuide.bind(this, 'rng3', "/images/rng/rng_htp_003.gif")} onMouseOut={this._showGuide.bind(this, 'rng3', "/images/rng/rng_htp_003_.gif")}>
                <img src={"/images/rng/rng_htp_003_.gif"} id="rng3"/>
              </span>
            }
            <p>{localeData['htp.description3']}</p>
          </section>
          <section className="3u 12u(medium)">
            {
              (brkPt === 'XS' || brkPt === 'S') ? <span className="black-box">
              <img src={"/images/rng/rng_htp_004.gif"} id="rng4"/>
            </span> : <span className="black-box"  onMouseOver={this._showGuide.bind(this, 'rng4', "/images/rng/rng_htp_004.gif")} onMouseOut={this._showGuide.bind(this, 'rng4', "/images/rng/rng_htp_004_.gif")}>
              <img src={"/images/rng/rng_htp_004_.gif"} id="rng4"/>
            </span>
            }
            <p>{localeData['htp.description4']}</p>
          </section>
        </div>

        <Modal
          ref="modalRngHTP"
          isOpen={this.state.modalIsOpen}
          onRequestClose={this._closeModal}
          className="modal-container rnghtp"
          overlayClassName="modal-overlay" >

            <div className="modal-header">
              <span className="close" onClick={this._closeModal}>×</span>
              <h3></h3>
            </div>
            <div className="modal-body">
              <img ref="imgHTPModal" src={this.state.htpModalImg} />
            </div>

        </Modal>
      </div>
    );
  }
}

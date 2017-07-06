'use strict';

import React, { Component } from 'react';
import Modal from 'react-modal';
import { _getBreakpoint } from '../utils/util';

// import hfgHTP01 from '../../../public/images/hfg_htp_001.png';
// import hfgHTP02 from '../../../public/images/hfg_htp_002.png';
// import hfgHTP03 from '../../../public/images/hfg_htp_003.png';
// import hfgHTP04 from '../../../public/images/hfg_htp_004.png';

export default class HowToPlayHFG extends Component {
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
                (brkPt === 'XS' || brkPt === 'S') ? <img src={"/images/hfg/hfg_htp_001_mobile.gif"}  id="hfg1"/> : <img src={"/images/hfg/hfg_htp_001.gif"}  id="hfg1"/>
              }
            </span>
            <p>{localeData['htp.description1']}</p>
          </section>
          <section className="3u 12u(medium)">
            
            {
              (brkPt === 'XS' || brkPt === 'S') ?  <span className="black-box">
                {/*<img src={"/images/hfg/hfg_htp_002_.gif"} onClick={this._showModalHTP.bind(this,"/images/hfg/hfg_htp_002.gif")} alt="Click to view larger image." />*/}
                <img src={"/images/hfg/hfg_htp_002.gif"} id="hfg2"/>
              </span> : <span className="black-box" onMouseOver={this._showGuide.bind(this, 'hfg2', "/images/hfg/hfg_htp_002.gif")} onMouseOut={this._showGuide.bind(this, 'hfg2', "/images/hfg/hfg_htp_002_.gif")}>
                {/*<img src={"/images/hfg/hfg_htp_002_.gif"} onClick={this._showModalHTP.bind(this,"/images/hfg/hfg_htp_002.gif")} alt="Click to view larger image." />*/}
                <img src={"/images/hfg/hfg_htp_002_.gif"} id="hfg2"/>
              </span>
            }
            <p>{localeData['htp.description2']}</p>
          </section>
          <section className="3u 12u(medium)">
          {
            (brkPt === 'XS' || brkPt === 'S') ?  <span className="black-box">
              <img src={"/images/hfg/hfg_htp_003.gif"}  id="hfg3" />
            </span> : <span className="black-box"  onMouseOver={this._showGuide.bind(this, 'hfg3', "/images/hfg/hfg_htp_003.gif")} onMouseOut={this._showGuide.bind(this, 'hfg3', "/images/hfg/hfg_htp_003_.gif")}>
              <img src={"/images/hfg/hfg_htp_003_.gif"}  id="hfg3" />
            </span>
          }
            <p>{localeData['htp.description3']}</p>
          </section>
          <section className="3u 12u(medium)">
          {
            (brkPt === 'XS' || brkPt === 'S') ?  <span className="black-box">
              <img src={"/images/hfg/hfg_htp_004.gif"} id="hfg4"/>
            </span> : <span className="black-box"  onMouseOver={this._showGuide.bind(this, 'hfg4', "/images/hfg/hfg_htp_004.gif")} onMouseOut={this._showGuide.bind(this, 'hfg4', "/images/hfg/hfg_htp_004_.gif")}>
              <img src={"/images/hfg/hfg_htp_004_.gif"} id="hfg4"/>
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

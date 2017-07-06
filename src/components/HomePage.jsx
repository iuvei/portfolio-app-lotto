'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import * as lfgAction from '../actions/lfgActions';
import { bindActionCreators } from 'redux';

import translate from './utils/translate';

import Banner from './homepage/Banner';
import FirstRow from './homepage/FirstRow';
import SecondRow from './homepage/SecondRow';
// import ThirdRow from './homepage/ThirdRow';
// import FourthRow from './homepage/FourthRow';

class HomePage extends Component {
  constructor (props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      drawings: []
    };

    this._showModalCS = this._showModalCS.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  componentWillMount() {
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    this.props.lfgAction.fetchDrawings(YUAN.abbr)
      .then((res) => {
        this.setState({ drawings: res.drawings });
        // console.log("drawings",res.drawings);
      });
  }

  _showModalCS(e) {
    e.preventDefault();

    this.setState({modalIsOpen: true});
  }

  _afterOpenModal() {}

  _closeModal() {
    this.setState({modalIsOpen: false});
  }

  render () {
    const { localeData } = this.props;
    const { drawings } = this.state;

    return (
      <div>
        <Banner drawingsData={drawings} localeData={localeData}/>
        <FirstRow drawingsData={drawings} localeData={localeData}/>
        <SecondRow drawingsData={drawings} localeData={localeData}/>
        {/*<ThirdRow localeData={localeData}/>
                <FourthRow localeData={localeData}/>*/}

        {/* <div id="fixed-sticky-cs">
              <a id="link-cs" href="#" onClick={this._showModalCS}>聯絡客服</a>
            </div> */}

        {/*<Modal
          ref="modalCS"
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this._afterOpenModal}
          onRequestClose={this._closeModal}
          className="modal-container cs"
          overlayClassName="modal-overlay" >

            <div className="modal-header">
              <span className="close" onClick={this._closeModal}>×</span>
              <h3>客服窗口</h3>
            </div>
            <div className="modal-body">
              <p><span className="left">客服E-mail :</span> <span className="right">support@lottolandasia.com</span></p>
              <hr />
              <p><span className="left">24h 客服电话 :</span> <span className="right">000-000-000</span></p>
            </div>

        </Modal>*/}

      </div>
    )
  }
}

HomePage.propTypes = {
  strings: React.PropTypes.object,
  localeData: React.PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    currency: state.currency
    // lfg: state.lfg
  };
};

const mapDispatchToProps = (dispatch) => ({
  lfgAction: bindActionCreators(lfgAction, dispatch)
});

// export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
export default connect(mapStateToProps)(HomePage);

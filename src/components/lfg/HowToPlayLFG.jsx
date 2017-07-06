'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

class HowToPlayLFG extends Component {
  constructor (props) {
    super(props);

    this.state = {
      gameId: props.gameId
    };
  }

  render () {
    const { gameId } = this.state;
    const { lotteryData, localeData } = this.props;

    let pod1 = '', pod2 = '', pod3 = '', pod4 = '';
    lotteryData.map((l, i) => {
      if (l.id == gameId) {
        pod1 = l.htp.pod1;
        pod2 = l.htp.pod2;
        pod3 = l.htp.pod3;
        pod4 = l.htp.pod4;
      }
    });

    return (
      <div className="box alt">
        <div className="row uniform">
          <section className="3u 6u(medium)">
            {/*<span className="black-box">&nbsp;</span>*/}
            <p dangerouslySetInnerHTML={{ __html: `${pod1}` }}></p>
          </section>
          <section className="3u 6u(medium)">
            {/*<span className="black-box">&nbsp;</span>*/}
            <p dangerouslySetInnerHTML={{ __html: `${pod2}` }}></p>
          </section>
          <section className="3u 6u(medium)">
            {/*<span className="black-box">&nbsp;</span>*/}
            <p dangerouslySetInnerHTML={{ __html: `${pod3}` }}></p>
          </section>
          <section className="3u 6u(medium)">
            {/*<span className="black-box">&nbsp;</span>*/}
            <p dangerouslySetInnerHTML={{ __html: `${pod4}` }}></p>
          </section>
        </div>
      </div>
    );
  }
}

HowToPlayLFG.propTypes = {
  gameId: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    lotteryData: state.lotteryData
  };
};

export default connect(mapStateToProps)(HowToPlayLFG);

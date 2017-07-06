'use strict';

import React, { Component } from 'react';

// import CountdownTracker from '../utils/CountdownTracker';

class ClockTimer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      deadline: props.endDate,
      timeinterval: 0,
      iterator: 0,
      time: {},
      currentValue: -1
    };

    this._tick = this._tick.bind(this);
    this._getTimeRemaining = this._getTimeRemaining.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.endDate !== nextProps.endDate) {
      this.setState({ deadline: nextProps.endDate });
    }
  }

  componentDidMount() {
    this.interval = setInterval(this._tick, 1000 / 60);
    // this.setState({ timeinterval: requestAnimationFrame(this._tick) });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    // cancelAnimationFrame(this.state.timeinterval);
  }

  componentDidUpdate(prevProps, prevState) {
    for ( let key in this.state.time ){
      if ( key === 'Total' ) { continue; }
      if (this.state.time[key] !== prevState.time[key]) {
        this.refs["fc_"+key].classList.remove('flip');
        void this.refs["fc_"+key].offsetWidth;
        this.refs["fc_"+key].classList.add('flip');
      }
    }
  }

  _tick() {
    let t = this._getTimeRemaining(new Date(this.state.deadline));

    if ( t.Total < 0 ) {
      clearInterval(this.interval);
      // cancelAnimationFrame(this.state.timeinterval);
      return;
    }

    // let i = this.state.iterator;
    // i++;
    // this.setState({ iterator: i });
    // if ( i % 10 ) { return; }

    // this.setState({ timeinterval: requestAnimationFrame(this._tick), time: t });
    this.setState({ time: t });

  }

  _getTimeRemaining(endtime) {
    const {localeData} = this.props;
    let t = Date.parse(endtime) - Date.parse(new Date());
    let Time = {};
    Time['Total'] = t;
    Time[`${localeData["timer.daysLeft"]}`] = Math.floor(t / (1000 * 60 * 60 * 24));
    Time[`${localeData["timer.hoursLeft"]}`] = Math.floor((t / (1000 * 60 * 60)) % 24);
    Time[`${localeData["timer.minutesLeft"]}`] = Math.floor((t / 1000 / 60) % 60);
    Time[`${localeData["timer.secondsLeft"]}`] = Math.floor((t / 1000) % 60);
    return Time/*{
      'Total': t,
      '`${localeData["timer.daysLeft"]}日`': Math.floor(t / (1000 * 60 * 60 * 24)),
      '时': Math.floor((t / (1000 * 60 * 60)) % 24),
      '分': Math.floor((t / 1000 / 60) % 60),
      '秒': Math.floor((t / 1000) % 60)
    }*/;
  }

  _renderClockPieces(t) {
    let pieces = [];
    let key, val, preVal;
    for ( key in t ){
      if ( key === 'Total' ) { continue; }
      val = (t[key] < 10 ) ? ( '0' + t[key] ).slice(-2) : t[key];
      preVal = (t[key] + 1 >= 60) ? '00' : ((t[key] < 10 ) ? ( '0' + (t[key]+1) ).slice(-2) : (t[key]+1));

      pieces.push(
        <span key={key} ref={"fc_"+key} className="flip-clock__piece">
          <b className="flip-clock__card card">
            <b className="card__top">{val}</b>
            <b className="card__bottom" data-value={preVal}></b>
            <b className="card__back" data-value={preVal}>
              <b className="card__bottom" data-value={val}></b>
            </b>
          </b>
          <span className="flip-clock__slot">{key}</span>
        </span>
      );
    }
      // pieces.push(<CountdownTracker ref={key} key={key} label={key} value={t[key]} />);

    return pieces;
  }

  render () {
    return (
      <div className="flip-clock">
        {this._renderClockPieces(this.state.time)}
      </div>
    );
  }
}

// ClockTimer.propTypes = {
//   endDate: React.PropTypes.instanceOf(Date)
// };

export default ClockTimer;

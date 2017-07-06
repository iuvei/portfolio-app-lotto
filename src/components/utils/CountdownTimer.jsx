'use strict';

import React, { Component } from 'react';

import CountdownTracker from '../utils/CountdownTracker';

export default class CountdownTimer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      deadline: new Date('2016-12-25T00:00:00'),
      timeinterval: 0,
      iterator: 0,
      time: {}
    };

    // this._tick = this._tick.bind(this);
    this._updateClock = this._updateClock.bind(this);
  }

  componentWillMount() {
    let countdown = this.state.deadline ? new Date(Date.parse(this.state.deadline)) : false;
    let updateFn = countdown ? this._getTimeRemaining : this._getTime;
    this.setState({ time: updateFn(countdown) });
  }

  componentDidMount() {
    // this.setState({ timeRemaining: this.props.timeRemaining });
    // this.html = '';
    // this.interval = setInterval(this._tick, 1000);
    // let c = new Clock(this.state.deadline, function(){ alert('countdown complete') });
    // let d = new Date(Date.parse(new Date()) + 12 * 24 * 60 * 60 * 1000);
    // let d = new Date('2016-12-25T00:00:00');
    // this.setState({ deadline: d });

    // this._updateClock();
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
    cancelAnimationFrame(this.state.timeinterval);
  }

  componentDidUpdate(prevProps, prevState) {
    // this.refs.flipClockSpan.classList.remove('flip');
    // void this.refs.flipClockSpan.offsetWidth;
    // this.refs.flipClockSpan.classList.add('flip');
    // this.setState({ deadline: d });

    // this._updateClock();
  }

  // _tick() {
  //   const targetDate = new Date('08/10/2016 1:00:00 GMT-0800 (PHT)');
  //   const _second = 1000;
  //   const _minute = _second * 60;
  //   const _hour = _minute * 60;
  //   const _day = _hour * 24;
  //   const now = new Date();
  //   let distance = 0;

  //   console.log('targetDate: ', targetDate);
  //   console.log('targetDate > now: ', distance = targetDate - now);
  //   console.log('targetDate < now: ', distance = now - targetDate);
  //   // console.log();

  //   if (targetDate > now) {
  //     distance = targetDate - now;
  //     if (distance < 0) {
  //       clearInterval(this.interval);
  //       return;
  //     }
  //   } else {
  //     distance = now - targetDate;
  //     if (distance < 0) {
  //       clearInterval(this.interval);
  //       return;
  //     }
  //   }

  //   // this.setState({ timeRemaining: distance });

  //   const days = Math.floor(distance / _day);
  //   let hours = Math.floor((distance % _day) / _hour);
  //   if (hours < 10) {
  //     hours = '0' + hours;
  //   }
  //   let minutes = Math.floor((distance % _hour) / _minute);
  //   if (minutes < 10) {
  //     minutes = '0' + minutes;
  //   }
  //   let seconds = Math.floor((distance % _minute) / _second);
  //   if (seconds < 10) {
  //     seconds = '0' + seconds;
  //   }
  //   let daytext = '';
  //   if (days > 1) {
  //     daytext = ' days ';
  //   } else {
  //     daytext = ' day ';
  //   }

  //   if (days > 0) {
  //     this.html = (
  //       <div id="counter">
  //         <span className="days">{days}</span>
  //         <span className="hours">{hours}</span><i> : </i>
  //         <span className="minutes">{minutes}</span><i> : </i>
  //         <span className="seconds">{seconds}</span>
  //       </div>
  //     );
  //   } else {
  //     this.html = (
  //       <div id="counter">
  //         <span className="hours">{hours}</span><i> : </i>
  //         <span className="minutes">{minutes}</span><i> : </i>
  //         <span className="seconds">{seconds}</span>
  //       </div>
  //     );
  //   }

  //   this.setState({timeRemaining: this.state.timeRemaining - 1});
  //   if (this.state.timeRemaining <= 0) {
  //     clearInterval(this.interval);
  //   }
  // }

  _getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date());
    return {
      'Total': t,
      'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
      'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
      'Minutes': Math.floor((t / 1000 / 60) % 60),
      'Seconds': Math.floor((t / 1000) % 60)
    };
  }

  _getTime() {
    let t = new Date();
    return {
      'Total': t,
      'Hours': t.getHours() % 12,
      'Minutes': t.getMinutes(),
      'Seconds': t.getSeconds()
    };
  }

  _updateClock() {
    this.setState({ timeinterval: requestAnimationFrame(this._updateClock) });
    let i = this.state.iterator;
    i++;
    this.setState({ iterator: i });
    if ( i % 10 ) { return; }

    let t = this._getTimeRemaining(this.state.deadline);
    this.setState({ time: t });

    let key;

    if ( t.Total < 0 ) {
      cancelAnimationFrame(this.state.timeinterval);
      // for ( key in trackers ){
      //   trackers[key].update( 0 );
      // }
      for ( key in t ){
        if ( key === 'Total' ) { continue; }
        this.refs[key]._update(0);
      }
      // callback();
      return;
    }
    for ( key in t ){
      if ( key === 'Total' ) { continue; }
      // console.log(t[key]);
      // this.refs[key]._update(t[key]);
      this.refs[key].value = t[key];
    }
    // cancelAnimationFrame(this.state.timeinterval);
  }

  _updateTracker(val) {

  }

  render () {
    // console.log(this.state.deadline);
    // console.log(this._getTimeRemaining(this.state.deadline));
    // console.log(this.state.time);

    let t = this.state.time, key, index=0, pieces = [];

    for ( key in t ){
      if ( key === 'Total' ) { continue; }
      index++;
      pieces.push(<CountdownTracker ref={key} key={index} label={key} value={t[key]} updateTracker={this._updateTracker.bind(this)} />);
    }

    return (
      <div className="flip-clock">
        {pieces.map((p, i) => (p))
        }
      </div>
    );
  }
}

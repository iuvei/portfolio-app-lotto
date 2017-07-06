'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import pickadate from 'pickadate';

export default class ReactPickadate extends Component {
  constructor(props){
    super(props);
    this.state = {value: null};
  }

  componentDidMount(){
    this._setupDatepicker();

    console.log(Picker);
  }

  componentDidUpdate(prevProps, prevState) {
    this._setupDatepicker();
  }

  _setupDatepicker() {
    // cache this so we can reference it inside the datepicker
    const comp = this;
    // the element
    const el = this.refs.datepicker;
    $(ReactDOM.findDOMNode(el)).pickadate({
      format: 'yyyy-mm-dd',
      formatSubmit: 'yyyy-mm-dd',
      selectMonths: true,
      selectYears: 5,
      closeOnSelect: true,
      onSet: function(e) {
        // you can use any of the pickadate options here
        let val = this.get('select', 'yyyy-mm-dd');
        el.setState({value: val});
        comp._onDateChange({target: {value: el.state.value}});
        // auto close on select
        this.close();
      }
    });
  }

  _onDateChange() {
    this.setState({operand: event.target.value});
  }

  render(){
    return (<input type="date" ref="datepicker" value={this.state.value} onChange={this._onDateChange} />);
  }
}

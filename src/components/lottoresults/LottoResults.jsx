'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class LottoResults extends Component {
  constructor (props) {
    super(props);

    this.state = {
      url: 'http://192.168.237.101:8081/',
      data: [],
      fetchStatus: 0,
      html: ''
    };
  }

  componentDidMount() {
    document.getElementById("draws").classList.add("loading-pulse");

    this._loadData();
  }

  _loadData() {
    fetch(this.state.url).then((res) => {
      this.setState({ fetchStatus: res.status });
      return res.json();

    }).then((data) => {
      this.setState({ data: data});
      document.getElementById("draws").classList.remove("loading-pulse");

      if (this.state.fetchStatus === 200 && data){
        this.setState({ html: this._drawHTMLTable(data) });
      }

    }).catch((err) => {
      this.setState({ fetchStatus: 404 });
      this.setState({ html: 'The lotto results cannot be displayed. An error was encountered while getting the results.' });

      throw new Error(err);
    });
  }

  _drawHTMLTable(data) {
    let html = '';

    if (data !== null){
      html = (
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th><th>Draw No.</th><th>Winning Numbers</th>
            </tr>
          </thead>
          <tbody>
          {data.map((obj, i) => (
              <tr key={i+1}>
                <td>{i+1}</td>
                <td>{obj["Draw No"]}</td>
                <td>
                  {this._drawNumBalls(obj["Winning No"])}
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      );
    }
    return html;
  }

  _drawNumBalls(n) {
    const nums = n.split(',');

    return (
      nums.map((num, i) => <span key={i+1} className="num-ball">{num}</span>)
    );
  }

  render () {
    return (
      <div>
        <header id="heading-title">
          <h1>开奖结果</h1>
        </header>

        <section id="lotto-results" className="style3 left">
          <div className="section group">
            <div className="col span_2_of_2">
              <div className="gray-box">
                <div className="box-title">
                  <h3>开奖结果</h3>
                  <span className="box-subtitle"></span>
                </div>
                <hr />
                <div className="box-content">
                  <div id="draws">{this.state.html}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

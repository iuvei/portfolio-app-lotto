'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Body extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // document.body.classList.add('loading');
  }

  componentDidMount() {
    // const pageWrapper = document.getElementById("page-wrapper");
    // console.log('componentDidMount',pageWrapper);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate',this.props.location);
  }

  _removeLoading() {
    window.setTimeout(function() {
      document.getElementById("homepage-overlay").style.display = 'none';
      // document.body.classList.remove('loading');
      document.getElementById("page-wrapper").style.opacity = 1;
    }, 1000);
  }

  _toggleFullHeight() {
    const currentLocation = this.props.location.pathname;
    const pageWrapper = document.getElementById("page-wrapper");

    if (currentLocation) {
      if (currentLocation === '/login-register'){
        if (pageWrapper && pageWrapper.classList){
          pageWrapper.classList.add('full-height');
        }
      } else {
        if (pageWrapper && pageWrapper.classList){
          pageWrapper.classList.remove('full-height');
        }
      }
    }
  }

  render() {
    // this._removeLoading();
    this._toggleFullHeight();

    const { offCanvasNav } = this.props;

    if (offCanvasNav.toggleLeftNavVisible){
      document.body.classList.add('navPanel-left-visible');
    } else {
      document.body.classList.remove('navPanel-left-visible');
    }

    if (offCanvasNav.toggleRightNavVisible){
      document.body.classList.add('navPanel-right-visible');
    } else {
      document.body.classList.remove('navPanel-right-visible');
    }

    return this.props.children;
  }
}

'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Icons from './icons/Icons';

export default class NavPanel_Left extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLeftNavVisible: props.isLeftNavVisible
    };
  }

  _toggleLeftNavPanel (event) {
    // event.preventDefault();

    // this.setState({ isLeftNavVisible: false });
    // this.props.toggleLeftNavMenu(false);
    const { offCanvasNav, offCanvasNavAction } = this.props;
    offCanvasNavAction.toggleLeftNav(offCanvasNav.toggleLeftNavVisible);
  }

  render () {
    const { links } = this.props;
    // if (sessionStorage.username) {
    //   links.push({
    //     id: 6, text: `Hi, ${sessionStorage.username}`, url: '/#', special: true, color: 'green', isLoggedIn: true
    //   });
    // } else {
    //   links.push({
    //     id: 6, text: '登入 / 注册', url: '/#', special: true, color: 'green', isLoggedIn: false
    //   });
    // }

    return (
      <div id="navPanel-left">
        <nav>
          {links.map((link, i) => (
            link.hasSubMenu ?
              [
                link.subMenu.map((sm, j) => (
                  <Link key={sm.key} to={sm.url} className="link depth-1">
                    <span key={j+1} className="indent-0"></span>{sm.text}
                  </Link>
                ))
              ] :
              [
                <Link key={link.id} className="link depth-0"
                   to={link.url} onClick={this._toggleLeftNavPanel.bind(this)}>
                  <span key={i+1} className="indent-0"></span>{link.text}
                </Link>
              ]
          ))
          }
        </nav>
      </div>
    )
  }
}

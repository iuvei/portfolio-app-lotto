import React, {Component, PropTypes} from 'react';

import { Link } from 'react-router';
import { _getBreakpoint } from '../utils/util';
import ReactHtmlParser from 'react-html-parser';

class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,

    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }


  componentWillUnmount() {

  }

  render() {
    const brkPt = _getBreakpoint(this.state.windowWidth);
    const {localeData} = this.props;
    return (
      <div>
        <header id="heading-title">
          <h1>{localeData['heading.title']}</h1>
        </header>
        <section className="faq">
          <section className="gray-box">
              {ReactHtmlParser(localeData['faq.content'])}
          </section>
        </section>
      </div>
    );
  }
}

export default FAQ;

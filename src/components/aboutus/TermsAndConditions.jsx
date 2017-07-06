import React, {Component, PropTypes} from 'react';
import ReactHtmlParser from 'react-html-parser';

class TermsAndConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {

  }

  render() {
    const {localeData} = this.props;
    return (
      <div>
        {ReactHtmlParser(localeData['about.termsAndConditions.content'])}
      </div>
    );
  }
}

export default TermsAndConditions;

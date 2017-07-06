import React, {Component, PropTypes} from 'react';
import ReactHtmlParser from 'react-html-parser';

import { Link } from 'react-router';
// import promoImage1 from '../../../public/images/promotion/banner_demo/banner_demo_s.jpg';
// import promoImage2 from '../../../public/images/promotion/banner_demo2/banner_demo2_s.jpg';
// import promoImage3 from '../../../public/images/promotion/HFG_banner/HFG_banner_promotion.jpg';


class PlayerProtection extends Component {
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
        {ReactHtmlParser(localeData['about.playerProtection.content'])}
      </div>
    );
  }
}


export default PlayerProtection;

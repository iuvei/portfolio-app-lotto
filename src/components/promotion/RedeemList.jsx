import React, {Component, PropTypes} from 'react';

import { Link } from 'react-router';
// import promoImage1 from '../../../public/images/banner/HFG_banner/banner_HFG_s.jpg';
// import promoImage2 from '../../../public/images/banner/RNG_banner/banner_RNG_s.jpg';
// import promoImage3 from '../../../public/images/promotion/banner_demo2/banner_demo2_s.jpg';

const gameImages = [
   {
    id: 'game05',
    name: 'Asteroids',
    desc: '快速註冊贏大獎',
    src: "/images/banner/HFG_banner/banner_HFG_s.jpg",
    sc_url: '/#',
    isHottest: true
  },
  {
    id: 'game14',
    name: 'KENO',
    desc: '百万大奖等你拿',
    src: "/images/banner/RNG_banner/banner_RNG_s.jpg",
    sc_url: '/#',
    isHottest: false
  },
  {
    id: 'game17',
    name: 'Diamond Deal',
    desc: '百万回馈等你拿',
    src: "/images/promotion/banner_demo2/banner_demo2_s.jpg",
    sc_url: '/#',
    isHottest: false
  },
  {
    id: 'game19',
    name: 'European Roulette',
    desc: '快速註冊贏大獎',
    src: "/images/banner/HFG_banner/banner_HFG_s.jpg",
    sc_url: '/#',
    isHottest: false
  },
  {
    id: 'game36',
    name: 'Starburst',
    desc: '百万大奖等你拿',
    src: "/images/banner/RNG_banner/banner_RNG_s.jpg",
    sc_url: '/#',
    isHottest: false
  },
  {
    id: 'game41',
    name: 'Las Cucas Locas',
    desc: '百万回馈等你拿',
    src: "/images/promotion/banner_demo2/banner_demo2_s.jpg",
    sc_url: '/#',
    isHottest: false
  },
];

class RedeemList extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {

  }


  componentWillUnmount() {

  }

  render() {
    let images = gameImages.map((obj, i) => {
      return (
        <div key={i}>
          <div className="gray-box">
            {/*<div className="box-title">*/}
            <div className="box-title">
              <Link to={obj.sc_url} className="left-link">儲值50送15</Link>
            </div>
            {/*</div>*/}
            <img src={obj.src} />
            <div className="box-content">
              <div className="sc-info">{obj.description}</div>
            </div>
            <div className="box-actions">
              <Link to={obj.sc_url} className="left-link">試玩</Link>
              <Link to={obj.sc_url} className="right-link">試玩</Link>
            </div>
            <div className="box-actions align-center">
              <Link to="/promotions/details" className="button special small">兑换</Link>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
          <header id="heading-title">
            <h1>我的优惠</h1>
          </header>
        <section >
          <section id="promotion-listing">
            <div className="section group">
                {images}
            </div>
          </section>
        </section>
      </div>
    );
  }
}

// PromotionList.propTypes = {

// };

export default RedeemList;

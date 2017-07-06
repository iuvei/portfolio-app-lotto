import React, {Component, PropTypes} from 'react';
import * as promotionAction from '../../actions/promotionActions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
// import promoImage1 from '../../../public/images/banner/HFG_banner/banner_HFG_s.jpg';
// import promoImage2 from '../../../public/images/banner/RNG_banner/banner_RNG_s.jpg';
// import promoImage3 from '../../../public/images/promotion/banner_demo2/banner_demo2_s.jpg';
import ReactHtmlParser from 'react-html-parser';
import { _getBreakpoint} from '../utils/util';

const gameImages = [
   {
    id: 'game01',
    name: ' 新玩家奖金 －充50送18',
    desc: '所有在Lottoland注册的新玩家都可以获得独家的新玩家奖金，只需充值50元马上可以获得18元的奖金。',
    src: "/images/prmo_01.jpg",
    sc_url: '/#',
    isHottest: true
  },
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

class PromotionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab : 1,
      windowWidth: window.innerWidth
    };
  }

  componentWillMount() {
    this.props.promotionAction.loadPromotion();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  
  switchActivePromotion(key){
    this.setState({activeTab:key})
  }
  
  render() {
    let images = gameImages.map((obj, i) => {
      return (
        <div key={i}>
          {/*<div className="gray-box">*/}
            {/*<div className="box-title">*/}
          {/*  <div className="box-title">
                        <Link to={obj.sc_url} className="left-link">儲值50送15</Link>
                      </div>*/}
            {/*</div>*/}
            <img src={obj.src} />
            {/*<div className="box-content">
                          <div className="sc-info">{obj.description}</div>
                        </div>
                        <div className="box-actions">
                          <Link to={obj.sc_url} className="left-link">試玩</Link>
                          <Link to={obj.sc_url} className="right-link">試玩</Link>
                        </div>
                        <div className="box-actions align-center">
                          <Link to="/promotions/details" className="button special small">開始玩！</Link>
                        </div>
                      </div>*/}
        </div>
      );
    });
    const brkPt = _getBreakpoint(this.state.windowWidth);
    let {promotion, localeData} = this.props;
    let Promo;
    if (brkPt === 'XS' || brkPt === 'S') {
       Promo = promotion;
    } else {
      Promo = (typeof promotion[this.state.activeTab-1] !== "undefined") ? promotion[this.state.activeTab-1] : {
        name : "",
        description: "",
        end_date: "",
      };
    }
    return (
      <div>
          <header id="heading-title">
            <h1>优惠活动</h1>
          </header>
          <section id="promotion-listing">
            <div className="section group promotion-lists">
              <div className="gray-box">
                <ul>
                  <li onClick={this.switchActivePromotion.bind(this, 1)}><img src="/images/prmo_01.jpg" /></li>
                  <li onClick={this.switchActivePromotion.bind(this, 2)}><img src="/images/banner/HFG_banner/banner_HFG_s.jpg" /></li>
                  <li onClick={this.switchActivePromotion.bind(this, 3)}><img src="/images/banner/RNG_banner/banner_RNG_s.jpg" /></li>
                  <li onClick={this.switchActivePromotion.bind(this, 4)}><img src="/images/promotion/banner_demo2/banner_demo2_s.jpg" /></li>
                </ul>
              </div>
            </div>
            {
              (Object.keys(promotion).length) ?<div className="section group promotion-details">
              {
                (brkPt === 'XS' || brkPt === 'S') ?  <div>
                  <div className="gray-box">
                    <div className="row-details">
                      <div className="col1">
                        <div>
                          <h3>{Promo[0].name}</h3>
                          <h5>
                            {Promo[0].description}
                          </h5>
                          <h5>
                            {Promo[0].end_date}
                          </h5>
                        </div>
                        <img src={gameImages[0].src} />
                      </div>
                      <div className="col2">
                        <button className="button special">立即充值</button>
                      </div>
                    </div>
                    <div className="row-details description">
                      {ReactHtmlParser(localeData['promo.'+Promo[0].translation_key+'.content'])}
                    </div>
                    <div className="row-details terms">
                      {ReactHtmlParser(localeData['promo.'+Promo[0].translation_key+'.terms.content'])}
                    </div>
                  </div>
                  <div className="gray-box">
                    <div className="row-details">
                      <div className="col1">
                        <div>
                          <h3>{Promo[1].name}</h3>
                          <h5>
                            {Promo[1].description}
                          </h5>
                          <h5>
                            {Promo[1].end_date}
                          </h5>
                        </div>
                        <img src={gameImages[1].src} />
                      </div>
                      <div className="col2">
                        <button className="button special">立即充值</button>
                      </div>
                    </div>
                    <div className="row-details description">
                      {ReactHtmlParser(localeData['promo.'+Promo[1].translation_key+'.content'])}
                    </div>
                    <div className="row-details terms">
                      {ReactHtmlParser(localeData['promo.'+Promo[1].translation_key+'.terms.content'])}
                    </div>
                  </div>
                  <div className="gray-box">
                    <div className="row-details">
                      <div className="col1">
                        <div>
                          <h3>{Promo[2].name}</h3>
                          <h5>
                            {Promo[2].description}
                          </h5>
                          <h5>
                            {Promo[2].end_date}
                          </h5>
                        </div>
                        <img src={gameImages[2].src} />
                      </div>
                      <div className="col2">
                        
                        <button className="button special">立即充值</button>
                      </div>
                    </div>
                    <div className="row-details description">
                      {ReactHtmlParser(localeData['promo.'+Promo[2].translation_key+'.content'])}
                    </div>
                    <div className="row-details terms">
                      {ReactHtmlParser(localeData['promo.'+Promo[2].translation_key+'.terms.content'])}
                    </div>
                  </div>
                  <div className="gray-box">
                    <div className="row-details">
                      <div className="col1">
                        <div>
                          <h3>{Promo[3].name}</h3>
                          <h5>
                            {Promo[3].description}
                          </h5>
                          <h5>
                            {Promo[3].end_date}
                          </h5>
                        </div>
                        <img src={gameImages[3].src} />
                      </div>
                      <div className="col2">
                        
                        <button className="button special">立即充值</button>
                      </div>
                    </div>
                    <div className="row-details description">
                      {ReactHtmlParser(localeData['promo.'+Promo[3].translation_key+'.content'])}
                    </div>
                    <div className="row-details terms">
                      {ReactHtmlParser(localeData['promo.'+Promo[3].translation_key+'.terms.content'])}
                    </div>
                  </div>

                </div> : <div className="gray-box">
                    <div className="box-content">
                      {
                       this.state.activeTab == 1 ?  <div> <div className="row-details">
                            <div className="col1">
                              <img src={gameImages[this.state.activeTab-1].src} />
                            </div>
                            <div className="col2">
                              <h3>{Promo.name}</h3>
                              <h5>
                                {Promo.description}
                              </h5>
                              <h5>
                                {Promo.end_date}
                              </h5>
                              <button className="button special">立即充值</button>
                            </div>
                          </div>
                          <div className="row-details description">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.content'])}
                          </div>
                          <div className="row-details terms">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.terms.content'])}
                          </div> </div>: null
                      }
                      {
                        this.state.activeTab == 2 ? <div> <div className="row-details">
                            <div className="col1">
                              <img src={gameImages[this.state.activeTab-1].src} />
                            </div>
                            <div className="col2">
                              <h3>{Promo.name}</h3>
                              <h5>
                                {Promo.description}
                              </h5>
                              <h5>
                                {Promo.end_date}
                              </h5>
                              <button className="button special">立即充值</button>
                            </div>
                          </div>
                          <div className="row-details description">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.content'])}
                          </div>
                          <div className="row-details terms">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.terms.content'])}
                          </div> </div> : null
                      }
                      {
                        this.state.activeTab == 3 ? <div> <div className="row-details">
                            <div className="col1">
                              <img src={gameImages[this.state.activeTab-1].src} />
                            </div>
                            <div className="col2">
                              <h3>{Promo.name}</h3>
                              <h5>
                                {Promo.description}
                              </h5>
                              <h5>
                                {Promo.end_date}
                              </h5>
                              <button className="button special">立即充值</button>
                            </div>
                          </div>
                          <div className="row-details description">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.content'])}
                          </div>
                          <div className="row-details terms">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.terms.content'])}
                          </div></div>  : null
                      }
                      {
                        this.state.activeTab == 4 ? <div> <div className="row-details">
                            <div className="col1">
                              <img src={gameImages[this.state.activeTab-1].src} />
                            </div>
                            <div className="col2">
                              <h3>{Promo.name}</h3>
                              <h5>
                                {Promo.description}
                              </h5>
                              <h5>
                                {Promo.end_date}
                              </h5>
                              <button className="button special">立即充值</button>
                            </div>
                          </div>
                          <div className="row-details description">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.content'])}
                          </div>
                          <div className="row-details terms">
                            {ReactHtmlParser(localeData['promo.'+Promo.translation_key+'.terms.content'])}
                          </div></div>  : null
                      }
                    </div>
                </div>

              }
            </div>  : null
            }
            
          </section>
      </div>
    );
  }
}

// PromotionList.propTypes = {

// };
const mapStateToProps = (state, ownProps) => {
  return {
    promotion: state.promotion,
  };
};

const mapDispatchToProps = (dispatch) => ({
   promotionAction: bindActionCreators(promotionAction, dispatch),
});

export default  connect(mapStateToProps, mapDispatchToProps)(PromotionList);

'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import ImageGallery from 'react-image-gallery';
import { _getBreakpoint, abbreviateNumber  } from '../utils/util';

import { connect } from 'react-redux';
import moment from 'moment-timezone';

// import promoImage1 from '../../../public/images/promotion/banner_demo/banner_demo_s.jpg';
// import promoImage2 from '../../../public/images/promotion/banner_demo2/banner_demo2_s.jpg';
// import promoImage3 from '../../../public/images/promotion/HFG_banner/HFG_banner_promotion.jpg';

const PREFIX_URL = '/images/';

// import lottoIcon01 from '../../../public/images/lottoicon01.png';
// import lottoIcon02 from '../../../public/images/lottoicon02.png';
// import gameIconHFG from '../../../public/images/game-icon_HFG.png';
// import gameIconRNG from '../../../public/images/game-icon_RNG.png';

class FirstRow extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isPlaying: true,
      showIndex: false,
      slideOnThumbnailHover: false,
      showBullets: true,
      infinite: true,
      showThumbnails: false,
      showNav: false,
      slideInterval: 4000,
      fullscreen: false,
      // images: [
      //   {
      //     original: `${PREFIX_URL}/banner/HFG_banner/banner_HFG_m.jpg`,
      //     originalClass: 'featured-slide',
      //     description: 'RNG-储值50送15,百万大奖等你拿',
      //     url : '/my-account',
      //     descTitle: '下一位亿万富翁就是你 !'
      //   },
      //   {
      //     original: `${PREFIX_URL}/banner/RNG_banner/banner_RNG_m.jpg`,
      //     description: 'HFG-储值50送15,快速注册赢大奖',
      //     url : '/my-account',
      //     descTitle: '下一位亿万富翁就是你 !'
      //   },
      //   // {
      //   //   original: `${PREFIX_URL}promotion/banner_demo2/banner_demo2_m.jpg`,
      //   //   description: 'Cash4Life 即将在 2 天 21 小时后开奖头奖累计 10.5 亿 !',
      //   //   url : '/lfg/euroJackpot',
      //   //   descTitle: '下一位亿万富翁就是你 !'
      //   // }
      // ],
      windowWidth: window.innerWidth
    };

    this._handleResize = this._handleResize.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval) {
      // refresh setInterval
      this._pauseSlider();
      this._playSlider();
    }
  }

  componentDidMount() {

    window.addEventListener('resize', this._handleResize);
    // let self = this;
    // const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    // let images = this.state.images;
    // this.props.drawingActions.fetchDrawings(YUAN.abbr)
    //   .then((res) => {
    //     let d = shuffleArray(res.drawings)[0];
    //     let closingDate = moment(d.closingDate).format('MM/DD HH:mm');
    //       images.push({
    //         original: `${PREFIX_URL}promotion/banner_demo2/banner_demo2_m.jpg`,
    //         description: `Euro Jackpot 即将在 ${closingDate} 小时后开奖头奖累计 ${abbreviateNumber(d.jackpots[0].marketingJackpot, 'zh-CN')} !`,
    //         url : '/lfg/euroJackpot',
    //         descTitle: '下一位亿万富翁就是你 !'
    //       })
    //       self.setState({
    //         images: images
    //       });
    //   });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _onImageClick(event) {
    // console.debug('clicked on image', event.target.src, 'at index', this._imageGallery.getCurrentIndex());
  }

  _renderItem(item) {
    //const onImageError = this.props.onImageError || this._handleImageError

    return (
      <div className='image-gallery-image'>
        <img
            src={item.original}
            alt={item.originalAlt}
            srcSet={item.srcSet}
            sizes={item.sizes}
            onLoad={this.props.onImageLoad}
        />
        {
          item.description &&
            <span className='image-gallery-description'>
              {
                item.descTitle &&
                  <h4>{item.descTitle}</h4>
              }
              <p>{item.description}</p>
              <Link to={item.url} className="button special">更多详情</Link>
            </span>
        }
      </div>
    )
  }

  _drawHTMLforDesktop () {
    const { drawingsData, currency, lotteryData, localeData } = this.props;
    const YUAN = _.find(currency, ['name', 'Yuan']);

    let images = [
      // {
      //   original: `${PREFIX_URL}/banner/HFG_banner/banner_HFG_m.jpg`,
      //   originalClass: 'featured-slide',
      //   description: localeData['imageSlider.item1.description'],
      //   url : '/my-account',
      //   descTitle: localeData['imageSlider.item1.title']
      // },
      // {
      //   original: `${PREFIX_URL}/banner/RNG_banner/banner_RNG_m.jpg`,
      //   description: localeData['imageSlider.item2.description'],
      //   url : '/my-account',
      //   descTitle: localeData['imageSlider.item2.title']
      // }
    ];

    let jackpotAmt = 0, closingDate;
    if (_.isArray(drawingsData)) {
      drawingsData.map((d,i) => {
        lotteryData.map((l, j) => {

          if (l.id === d.lotteryId && d.lotteryId === 'euroJackpot') {
            jackpotAmt = abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN');
            closingDate = moment(d.closingDate).tz('Asia/Shanghai').format('MM/DD HH:mm');

            images.push({
              original: `${PREFIX_URL}promotion/prmo_01.jpg`,
              description: localeData['imageSlider.item3.description'].replace('{lottoName}',l.name).replace('{drawDate}',closingDate).replace('{yuanSymbol}',YUAN.unicode).replace('{jackpotAmt}',jackpotAmt) /*`${l.name} 即将在 ${closingDate} 小时后开奖头奖累计 ${YUAN.unicode}${jackpotAmt} !`*/,
              url : /*l.lfg_url*/ '/about',
              descTitle: localeData['imageSlider.item3.title']
            })
          }
        });
      });
    }

    return (
      <div className="section">
        <div id="carousel" className="gray-box">
          <ImageGallery
            ref={i => this._imageGallery = i}
            items={images}
            lazyLoad={false}
            onClick={this._onImageClick.bind(this)}
            infinite={this.state.infinite}
            showBullets={this.state.showBullets}
            showThumbnails={this.state.showThumbnails}
            showIndex={this.state.showIndex}
            showNav={this.state.showNav}
            slideInterval={parseInt(this.state.slideInterval)}
            autoPlay={this.state.isPlaying}
            slideOnThumbnailHover={this.state.slideOnThumbnailHover}
            renderItem={this._renderItem.bind(this)}
          />
          {/*<Link to="/my-account">
                      <img className="promo-banner" src={`${PREFIX_URL}/prmo_01.jpg`}/>
                    </Link>*/}
        </div>
        <div id="scratchcards" className="gray-box">
          <div className="box-title">
            <h3>{localeData['gameBoxes.game1.title']}</h3>
            <span className="box-subtitle">{localeData['gameBoxes.game1.subtitle']}</span>
          </div>
          <hr />
          <div className="box-content">
            <div id="two-col-box" className="box alt">
              <div className="row uniform">
                <section className="6u 6u(medium)">
                  <Link to="/hfg"><img src={"/images/game-icon_HFG.png"} /></Link>
                </section>
                <section className="6u 6u(medium)">
                  <Link to="/rng"><img src={"/images/game-icon_RNG.png"} /></Link>
                </section>
              </div>
            </div>
          </div>
          <div className="box-link">
            <a href="#">{localeData['gameBoxes.game1.link']} &#187;</a>
          </div>
        </div>
      </div>
    );
  }

  _drawHTMLforMobile () {
    const { drawingsData, currency, lotteryData, localeData } = this.props;
    const YUAN = _.find(currency, ['name', 'Yuan']);

    let images = [
      // {
      //   original: `${PREFIX_URL}/banner/HFG_banner/banner_HFG_m.jpg`,
      //   originalClass: 'featured-slide',
      //   description: localeData['imageSlider.item1.description'],
      //   url : '/my-account',
      //   descTitle: localeData['imageSlider.item1.title']
      // },
      // {
      //   original: `${PREFIX_URL}/banner/RNG_banner/banner_RNG_m.jpg`,
      //   description: localeData['imageSlider.item2.description'],
      //   url : '/my-account',
      //   descTitle: localeData['imageSlider.item2.title']
      // }
    ];

    let jackpotAmt = 0, closingDate;
    if (_.isArray(drawingsData)) {
      drawingsData.map((d,i) => {
        lotteryData.map((l, j) => {

          if (l.id === d.lotteryId && d.lotteryId === 'euroJackpot') {
            jackpotAmt = abbreviateNumber((d.jackpots[0].marketingJackpot / 100), 'zh-CN')
            closingDate = moment(d.closingDate).tz('Asia/Shanghai').format('MM/DD HH:mm');

            images.push({
              original: `${PREFIX_URL}promotion/prmo_01.jpg`,
              description: localeData['imageSlider.item3.description'].replace('{lottoName}',l.name).replace('{drawDate}',closingDate).replace('{yuanSymbol}',YUAN.unicode).replace('{jackpotAmt}',jackpotAmt) /*`${l.name} 即将在 ${closingDate} 小时后开奖头奖累计 ${YUAN.unicode}${jackpotAmt} !`*/,
              url : /*l.lfg_url*/ '/about',
              descTitle: localeData['imageSlider.item3.title']
            })
          }
        });
      });
    }
    return (
      <div className="section">
        <div id="carousel" className="gray-box">
          <ImageGallery
                      ref={i => this._imageGallery = i}
                      items={images}
                      lazyLoad={false}
                      onClick={this._onImageClick.bind(this)}
                      infinite={this.state.infinite}
                      showBullets={this.state.showBullets}
                      showThumbnails={this.state.showThumbnails}
                      showIndex={this.state.showIndex}
                      showNav={this.state.showNav}
                      slideInterval={parseInt(this.state.slideInterval)}
                      autoPlay={this.state.isPlaying}
                      slideOnThumbnailHover={this.state.slideOnThumbnailHover}
                      renderItem={this._renderItem.bind(this)}
                    />
          {/*<Link to="/my-account">
                      <img className="promo-banner" src={`${PREFIX_URL}/prmo_01.jpg`}/>
                    </Link>*/}
        </div>
        <div id="scratchcards" className="gray-box">
          <div className="box-title">
            <h3>{localeData['gameBoxes.game1.title']}</h3>
            <span className="box-subtitle">{localeData['gameBoxes.game1.subtitle']}</span>
          </div>
          <hr />
          <div className="box-content">
            <div id="two-col-box" className="box alt">
              <div className="game-icon-wrapper">
                <section className="6u 6u(medium)">
                  <Link to="/hfg"><img src={"/images/game-icon_HFG.png"} /></Link>
                </section>
                <section className="6u 6u(medium)">
                  <Link to="/rng"><img src={"/images/game-icon_RNG.png"} /></Link>
                </section>
              </div>
            </div>
          </div>
          <div className="box-link">
            <a href="#">{localeData['gameBoxes.game1.link']} &#187;</a>
          </div>
        </div>
      </div>
    );
  }

  render () {
    const brkPt = _getBreakpoint(this.state.windowWidth);
    let html;
    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile();
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    } else {
      html = this._drawHTMLforDesktop();
      // html = '';
    }

    return (
      <section id="one">
        {html}
      </section>
    )
  }
}


FirstRow.propTypes = {
  drawingsData: React.PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    lfg: state.lfg,
    lotteryData: state.lotteryData
  };
};

export default connect(mapStateToProps)(FirstRow);

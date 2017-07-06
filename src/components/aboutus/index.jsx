import React, {Component, PropTypes} from 'react';

import { Link } from 'react-router';
// import promoImage1 from '../../../public/images/promotion/banner_demo/banner_demo_s.jpg';
// import promoImage2 from '../../../public/images/promotion/banner_demo2/banner_demo2_s.jpg';
// import promoImage3 from '../../../public/images/promotion/HFG_banner/HFG_banner_promotion.jpg';

import $ from 'jquery';

//Pages
import AboutUs from './AboutUs';
import AboutPayouts from './Payouts';
import AboutPlayerProtection from './PlayerProtection';
import AboutPrivacyPolicy from './PrivacyPolicy';
import AboutTermsAndConditions from './TermsAndConditions';

class AboutIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.params.activeTab,
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({activeTab:nextProps.params.activeTab})
  }

  componentDidMount() {
  }


  componentWillUnmount() {

  }
  // _handleTabClick (e) {
  //   e.preventDefault();

  //   let currentHrefValue = e.currentTarget.href;
  //   currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);
  //   // document.getElementById(currentHrefValue).className="active";

  //   // $.each($(".tab"), function(el, i){
  //   //     if($(el).hasClass("active"))
  //   //         $(el).removeClass("active")
  //   // })

  //   $(".tab-content").find(".tab").removeClass("active")
  //   $("ul.tab-links").find("li.active").removeClass("active")
  //   $("div"+currentHrefValue).addClass("active");
  //   $("ul"+currentHrefValue).addClass("active");

  //   this.setState({ activeTab: currentHrefValue });
  // }

  render() {
    const {localeData} = this.props;
    return (
      <div>
          <header id="heading-title">
            <h1>{localeData['heading.title']}</h1>
          </header>
        <section >
          <section id="tab-section" className="about-us">
                 <div className="tabs">
                  <ul className="tab-links">
                    <li className={this.context.router.isActive({ pathname: '/about/privacy-policy' }) ? "active" : ""} id="tab1"><Link to="/about/privacy-policy"><h1 className="tab-title">{localeData['about.tab1.title']}</h1></Link></li>
                    <li className={this.context.router.isActive({ pathname: '/about/terms-and-conditions' }) ? "active" : ""} id="tab2"><Link to="/about/terms-and-conditions" ><h1 className="tab-title">{localeData['about.tab2.title']}</h1></Link></li>
                    <li className={this.context.router.isActive({ pathname: '/about/player-protection' }) ? "active" : ""} id="tab3"><Link to="/about/player-protection"><h1 className="tab-title">{localeData['about.tab3.title']}</h1></Link></li>
                    <li className={this.context.router.isActive({ pathname: '/about/payouts' }) ? "active" : ""} id="tab4"><Link to="/about/payouts" ><h1 className="tab-title">{localeData['about.tab4.title']}</h1></Link></li>
                    <li className={!this.context.router.isActive({ pathname: '/about/privacy-policy' }) && !this.context.router.isActive({ pathname: '/about/terms-and-conditions' }) && !this.context.router.isActive({ pathname: '/about/player-protection' }) && !this.context.router.isActive({ pathname: '/about/payouts' }) ? "active" : ""} id="tab5"><Link to="/about"><h1 className="tab-title">{localeData['about.tab5.title']}</h1></Link></li>
                  </ul>
                  <div className="tab-content">
                      <div className="tab active">
                        {
                          this.state.activeTab == "privacy-policy" ? <AboutPrivacyPolicy localeData={localeData}/>:null
                        }
                        {
                          this.state.activeTab == "terms-and-conditions" ? <AboutTermsAndConditions localeData={localeData}/>:null
                        }
                        {
                          this.state.activeTab == "player-protection" ? <AboutPlayerProtection localeData={localeData} />:null
                        }
                        {
                          this.state.activeTab == "payouts" ? <AboutPayouts localeData={localeData} />:null
                        }
                        {
                          this.context.router.isActive({ pathname: '/about' })? <AboutUs localeData={localeData}/>:null
                        }
                      </div>
                  </div>
                </div>
          </section>
        </section>
      </div>
    );
  }
}

AboutIndex.contextTypes = {
  router: React.PropTypes.object
};

AboutIndex.propTypes = {
  localeData: React.PropTypes.object,
}

export default AboutIndex;

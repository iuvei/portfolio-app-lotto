import React, {Component, PropTypes} from 'react';

import { Link } from 'react-router';

// import promoImage1 from '../../../public/images/promotion/banner_demo/banner_demo_L@2x.jpg';
// import promoImage2 from '../../../public/images/promotion/banner_demo2/banner_demo2_L@2x.jpg';
// import promoImage3 from '../../../public/images/promotion/HFG_banner/HFG_banner_L@2x.jpg';

import $ from 'jquery';

class PromotionDetails extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {
    // var acc = document.getElementsByClassName("od-trigger");
    // var i;

    // for (i = 0; i < acc.length; i++) {
    //     acc[i].onclick = function(){
    //         this.classList.toggle("active");
    //         alert("clicked")
    //         this.nextElementSibling.classList.toggle("show");
    //   }
    // }
  }
  toggleOtherDetails(e) {
      // console.log($(".other-details"))
      $(".other-details").toggleClass("show")
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        {/*<header id="heading-title">
            <h1>PROMOTIONS</h1>
          </header>*/}
        <section >
          <section id="promotion-detail">
            <div className="section group">
              <div className="container" >
                  <div className="description"  style={{backgroundImage:'url("/images/promotion/banner_demo/banner_demo_L@2x.jpg") no-repeat center center fixed'}}>
                      <h1 className="">我的帳戶 我的帳戶 我的帳戶</h1>
                      <br />
                      <br />
                      <div>我的帳戶 * 我的帳戶我的帳戶我的帳戶我的帳戶</div> <br />
                      <div>我的帳戶 * 我的帳戶我的帳戶我的帳戶我的帳戶</div> <br />
                      <div>我的帳戶 * 我的帳戶我的帳戶我的帳戶 我的帳戶</div> <br />
                      <a className="button special small" href="/#">&nbsp;&nbsp;&nbsp;開始玩&nbsp;&nbsp;&nbsp;</a> <br />
                      <small><a id="od-trigger" className="" onClick={this.toggleOtherDetails.bind(this)}>開 始 玩 </a></small>
                      <div  className="other-details">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit, architecto, natus. Totam fuga molestias, itaque, voluptatibus corrupti tempore ex. Suscipit consequatur labore, tempora alias hic necessitatibus ea deleniti voluptates iste.
                      </div>
                  </div>
                  {/*<img src={promoImage2} />*/}
              </div>
            </div>
          </section>
        </section>
      </div>
    );
  }
}

// PromotionList.propTypes = {

// };

export default PromotionDetails;

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import translate from '../utils/translate';
// import { FormattedMessage } from 'react-intl';
import moment from 'moment-timezone';
import _ from 'lodash';
import $ from 'jquery';
import { default as showSweetAlert } from 'sweetalert2';
// import Modal from 'react-modal';

import { _getBreakpoint, getDayString, abbreviateNumber, combinations } from '../utils/util';
import ClockTimer from '../utils/ClockTimer';
import FerrisWheelPreloader from '../utils/FerrisWheelPreloader';

// import euroJackpot from '../../../public/images/lfg_eurojackpot-icon.png';
// import euroJackpotIcon from '../../../public/images/lotto_eurojackpot.png';
// import euroMillions from '../../../public/images/lfg_euromillions-icon.png';
// import euroMillionsIcon from '../../../public/images/lotto_euromillions.png';
// import powerball from '../../../public/images/lfg_powerball-icon.png';
// import powerballIcon from '../../../public/images/lotto_powerball.png';
// import hkmark6 from '../../../public/images/lfg_hk6-icon.png';
// import hkmark6Icon from '../../../public/images/lotto_hkmark6.png';
// import megaMillions from '../../../public/images/lfg_megamillions-icon.png';
// import megaMillionsIcon from '../../../public/images/lotto_megamillions.png';

import config from '../../../config';
import Icons from '../icons/Icons';

import HowToPlayLFG from './HowToPlayLFG';
import RecentHistory from './RecentHistory';

const TO_MILLION = 10000; // parseFloat(0.00001).toPrecision(7);

const swalConfig = (title, subTitle, type) => {
  return {
    title: title,
    html: subTitle,
    type: type,
    confirmButtonColor: "#f3a71e"
  };
};

class LFG extends Component {

  constructor(props){
    super(props);
    window.scrollTo(0, 0);

    moment.locale('en');

    const lottery = _.find(props.lotteryData, function(obj) { return obj.id.toUpperCase() == props.params.gameId.toUpperCase(); });
    console.log(lottery.id);

    const durOptsArray = [
      {
        text: '1周',
        value: 1
      },
      {
        text: '2周',
        value: 2
      },
      {
        text: '4周',
        value: 4
      }
    ];

    this.state = {
      activeTab: '#tab1',
      lotteryDay: 'checked',
      betDuration1: 'checked',
      betDuration2: '',
      continuousBet: 'checked',
      betConfirm1: 'checked',
      betConfirm2: 'checked',
      betConfirm2: 'checked',
      isPowerPlayChecked: false,
      isMegaPlierChecked: false,
      windowWidth: window.innerWidth,
      maxSelectedNumS1: 5,
      selectedNumCtrS1: 0,
      selectedNumsS1: [],
      maxSelectedNumS2: 2,
      selectedNumCtrS2: 0,
      selectedNumsS2: [],
      set1PickCount: 0,
      set2PickCount: 0,
      ticketsData: [],
      gameId: lottery.id,
      defaultNextDraws: lottery.defaultNextDraws,
      duration1Options: durOptsArray,
      durationOptionsValue: durOptsArray[0].value,
      numberShieldBtnEnabled: false,
      stakeTotal: 0,
      currentDrawInfo: {
        drawId: '',
        closingDate: moment().add(1, 'M'),
        drawDay: '',
        jackpotAmt: 0,
        state: ''
      },
      drawingsData: [],
      lotteryInfo: {
        set1PickLimit: 0,
        set2PickLimit: 0,
        drawingTypes: [],
        systems: [],
        set1ComboLimit: 0,
        set2ComboLimit: 0
      },
      pricesInfo: {
        version: 0,
        prices: []
      },
      nextDates: this._getNextDates(),
      drawInfoArray: [],
      disabledDrawTypes: [],
      modalIsOpen: false,
      isComboBetSelected: false,
      hasSet1ComboBetReachedLimit: false,
      hasSet2ComboBetReachedLimit: false,
      comboBetMultiplier: "xx",
      systemType: ''
    };

    this._handleResize = this._handleResize.bind(this);
    this._getBetsData = this._getBetsData.bind(this);
    this._disableExtraNums = this._disableExtraNums.bind(this);
  }

  componentWillMount(props) {
  }

  componentDidMount(props) {
    this.setState({ activeTab: '#tab1' });

    window.addEventListener('resize', this._handleResize);

    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);
    const { user, lfgAction } = this.props;

    // lfgAction.fetchPrices({ gameId: this.state.gameId, currency: YUAN.abbr }) //, accessToken: user.info.token
    //   .then((res) => {
    //     let p = res.prices.Prices[0];
    //     this.setState({
    //       pricesInfo: {
    //         version: p.version,
    //         prices: p.prices
    //       }
    //     });
    //   });
    lfgAction.fetchPrices({ currency: YUAN.abbr })
      .then((res) => {
        res.prices.Prices.map((p, i) => {
          if (p.lotteryId == this.state.gameId) {
            this.setState({
              pricesInfo: {
                version: p.version,
                prices: p.prices
              }
            });
          }
        });
      });

    lfgAction.fetchLotteries(this.state.gameId)
      .then((res) => {
        let l = res.lotteries;

        let maxNum = Math.max.apply(Math,l.systems.map(function(o){return o.numbers;}))
        let maxAddlNum = Math.max.apply(Math,l.systems.map(function(o){return o.additionalNumbers;}))

        this.setState({
          lotteryInfo: {
            set1PickLimit: l.systems[0].numbers,
            set2PickLimit: l.systems[0].additionalNumbers,
            drawingTypes: l.drawingTypes,
            systems: l.systems,
            set1ComboLimit: maxNum,
            set2ComboLimit: maxAddlNum
          },
          set1PickCount: l.systems[0].numbers,
          set2PickCount: l.systems[0].additionalNumbers,
          systemType: l.systems[0].name
        });

        lfgAction.fetchDrawings(YUAN.abbr, this.state.gameId, { next: this.state.defaultNextDraws, last: 0 })
          .then((res) => {

            this.setState({ drawingsData: res.drawings });

            res.drawings.map((d, i) => {

              // if (d.jackpots[0].marketingJackpot > 0) {
              if (i >= res.drawings.length-1) {
                this._getBetsData(this.state.gameId, d.id);

                let defaultDrawInfo = {
                  drawId: d.id,
                  drawDate: d.closingDate,
                  drawType: moment(d.closingDate).tz('Asia/Shanghai').format('dd').toUpperCase(),
                  drawDay: moment.utc(d.closingDate).format('dd').toUpperCase()
                };
                // console.log(defaultDrawInfo, d.jackpots[0].marketingJackpot);
                this.setState({
                  currentDrawInfo: {
                    drawId: d.id,
                    closingDate: d.closingDate,
                    drawDay: moment.utc(d.closingDate).format("ddd"),
                    jackpotAmt: d.jackpots[0].marketingJackpot, //((d.jackpots[0].marketingJackpot / 100).toFixed(2) / TO_MILLION).toFixed(0),
                    state: d.state
                  },
                  drawInfoArray: [defaultDrawInfo]
                });
              }

            });
            setTimeout(() => { document.getElementById("lfg-overlay").style.display = 'none'; }, 1000);
          });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  // _showModal(e) {
  //   e.preventDefault();

  //   this.setState({modalIsOpen: true});
  // }

  // _closeModal() {
  //   this.setState({modalIsOpen: false});
  // }

  // _afterOpenModal() {}

  _handleResize (e) {
    this.setState({windowWidth: window.innerWidth});
  }

  _handleTabClick (e) {
    e.preventDefault();

    let currentHrefValue = e.currentTarget.href;
    currentHrefValue = currentHrefValue.substr(currentHrefValue.lastIndexOf('#'), currentHrefValue.length);

    this.setState({ activeTab: currentHrefValue });
  }

  _selectNumber(num, ref, e) {
    e.preventDefault();

    let set1limit = this.state.lotteryInfo.set1PickLimit, set2limit = this.state.lotteryInfo.set2PickLimit, currCountS1, currCountS2;
    let set = num.substr(0, num.indexOf(':')).toUpperCase();
    let selNum = num.substr(num.indexOf(':')+1, num.length);

    let numSet1 = [], numSet2 = [];

    const { gameId, lotteryInfo, isComboBetSelected } = this.state;

    currCountS1 = this.state.selectedNumCtrS1;
    currCountS2 = this.state.selectedNumCtrS2;

    let hasSelected = false;
    if (isComboBetSelected) {
      hasSelected = ($(this.refs[ref]).hasClass('selected-combo')) ? true : false;
    } else {
      hasSelected = ($(this.refs[ref]).hasClass('selected')) ? true : false;
    }
    // let hasSelected = (e.currentTarget.classList.value.indexOf('selected') !== -1) ? true : false;
    if (set === 'SET1') {
      if (!hasSelected) {
        currCountS1 = this.state.selectedNumCtrS1+1;
        numSet1 = this.state.selectedNumsS1;
        numSet1.push(parseInt(selNum));
      } else { //unselected a number
        currCountS1 = this.state.selectedNumCtrS1-1;
        numSet1 = this.state.selectedNumsS1;
        numSet1.splice(numSet1.indexOf(parseInt(selNum)),1);
      }
      // console.log(set1limit, currCountS1 +" <= "+ this.state.lotteryInfo.set1PickLimit);

      if (isComboBetSelected) {
        let systemObj = _.filter(lotteryInfo.systems,{"numbers":currCountS1,"additionalNumbers":currCountS2});

        if (systemObj.length > 0) {
          // const {lfgAction} = this.props;
          // lfgAction.postFetchLotteryAmt({ lotteryId: this.state.gameId, type: systemObj[0].name })
          //   .then((res) => {
          //     this.setState({ comboBetMultiplier: res.fetchLotteryAmt.count });
          //   });
          let combi1 = combinations(currCountS1,this.state.lotteryInfo.set1PickLimit);
          let combi2 = combinations(currCountS2,this.state.lotteryInfo.set2PickLimit);

          this.setState({ systemType: systemObj[0].name });
          if (currCountS1 < this.state.lotteryInfo.set1ComboLimit) {
            this.setState({selectedNumCtrS1: currCountS1, selectedNumsS1: numSet1, hasSet1ComboBetReachedLimit: false});

            let comboPriceMultiplier = combi1 * combi2;
            this.setState({ comboBetMultiplier: comboPriceMultiplier });

            e.currentTarget.classList.toggle('selected-combo');
          } else if (currCountS1 == this.state.lotteryInfo.set1ComboLimit) {
            e.currentTarget.classList.toggle('selected-combo');
            this.setState({ selectedNumCtrS1: currCountS1, hasSet1ComboBetReachedLimit: true });

            let comboPriceMultiplier = combi1 * combi2;
            this.setState({ comboBetMultiplier: comboPriceMultiplier });
          } else {
            this.setState({ hasSet1ComboBetReachedLimit: true });
          }
        } else {
          showSweetAlert(swalConfig("数字选择:", '数字组合不提供包牌。', "info"));
          this.setState({ systemType: systemObj[0].name });
          numSet1 = this.state.selectedNumsS1;
          numSet1.pop();
          set1limit = 0;
        }

      } else {
        if (currCountS1 <= this.state.lotteryInfo.set1PickLimit) {
          this.setState({selectedNumCtrS1: currCountS1, selectedNumsS1: numSet1});
          e.currentTarget.classList.toggle('selected');
          set1limit = set1limit - currCountS1;
        } else {
          showSweetAlert(swalConfig("数字选择:", '您只能为集合1选择'+this.state.lotteryInfo.set1PickLimit+'个号码.', "info"));
          // alert('You can only select '+this.state.lotteryInfo.set1PickLimit+' numbers for Set #1.');
          numSet1 = this.state.selectedNumsS1;
          numSet1.pop();
          set1limit = 0;
        }
        // console.log('Set1-selected nums:',this.state.selectedNumsS1);
        this.setState({set1PickCount: set1limit, systemType: 'NORMAL'});
      }
    } else { // SET2
      if (this.state.gameId === 'megaMillions' || this.state.gameId === 'powerBall') {
        numSet2.push(e.target.value);
        this.setState({selectedNumsS2: numSet2});
        // console.log('Set2-selected num:', e.target.value);
      } else {
        if (!hasSelected) {
          currCountS2 = this.state.selectedNumCtrS2+1;
          numSet2 = this.state.selectedNumsS2;
          numSet2.push(parseInt(selNum));
        } else { //unselected a number
          currCountS2 = this.state.selectedNumCtrS2-1;
          numSet2 = this.state.selectedNumsS2;
          numSet2.splice(numSet2.indexOf(parseInt(selNum)),1);
        }

        if (isComboBetSelected) {
          let systemObj = _.filter(lotteryInfo.systems,{"numbers":currCountS1,"additionalNumbers":currCountS2});

          if (systemObj.length > 0) {
            // const {lfgAction} = this.props;
            // lfgAction.postFetchLotteryAmt({ lotteryId: this.state.gameId, type: systemObj[0].name })
            //   .then((res) => {
            //     this.setState({ comboBetMultiplier: res.fetchLotteryAmt.count });
            //   });
            let combi1 = combinations(currCountS1,this.state.lotteryInfo.set1PickLimit);
            let combi2 = combinations(currCountS2,this.state.lotteryInfo.set2PickLimit);
            let comboPriceMultiplier = combi1 * combi2;

            this.setState({ systemType: systemObj[0].name, comboBetMultiplier: comboPriceMultiplier });
            this.setState({selectedNumCtrS2: currCountS2, selectedNumsS2: numSet2});
            e.currentTarget.classList.toggle('selected-combo');
          } else {
            showSweetAlert(swalConfig("数字选择:", '数字组合不提供包牌。', "info"));
            this.setState({ systemType: systemObj[0].name });
            numSet2 = this.state.selectedNumsS2;
            numSet2.pop();
            set2limit = 0;
          }
        } else {
          if (currCountS2 <= this.state.lotteryInfo.set2PickLimit) {
            this.setState({selectedNumCtrS2: currCountS2, selectedNumsS2: numSet2});
            e.currentTarget.classList.toggle('selected');
            set2limit = set2limit - currCountS2;
          } else {
            showSweetAlert(swalConfig("数字选择:", '您只能为集合2选择'+this.state.lotteryInfo.set2PickLimit+'个号码.', "info"));
            // alert('You can only select '+this.state.lotteryInfo.set2PickLimit+' numbers for Set# 2.');
            numSet2 = this.state.selectedNumsS2;
            numSet2.pop();
            set2limit = 0;
          }
          // console.log('Set2-selected nums:',this.state.selectedNumsS2);
          this.setState({set2PickCount: set2limit, systemType: 'NORMAL'});
        }

      }
    }
  }

  _makeBolder(str) {
    return (<span key="makeBolder0" className="makeBolder">str</span>);
  }

  _generateObjID() {
    return (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
  }

  _addSelectedNumsToTicketData(e) {
    e.preventDefault();
    window.scrollTo(0, 0);

    const { user, lfgAction } = this.props;
    const { isComboBetSelected } = this.state;

    let _selectedNumsS2 = [];
    if (this.state.gameId === 'megaMillions') {
      // console.log(this.state.selectedNumsS1.length +"<"+ this.state.lotteryInfo.set1PickLimit);
      if (this.state.selectedNumsS1.length < this.state.lotteryInfo.set1PickLimit) {
        showSweetAlert(swalConfig("选择投注数...", "请填写您的号码选择.", "info"));
        return;
      } else {
        _selectedNumsS2.push(this.refs.megaMillionsSet2.value);
        this.setState({
          selectedNumsS2: _selectedNumsS2
        });
      }
    } else if (this.state.gameId === 'powerBall') {
      if (this.state.selectedNumsS1.length < this.state.lotteryInfo.set1PickLimit) {
        showSweetAlert(swalConfig("选择投注数...", "请填写您的号码选择.", "info"));
        return;
      } else {
        _selectedNumsS2.push(this.refs.powerBallSet2.value);
        this.setState({
          selectedNumsS2: _selectedNumsS2
        });
      }
    } else {
      if (!isComboBetSelected) {
        if ((this.state.selectedNumsS1.length < this.state.lotteryInfo.set1PickLimit) ||
            (this.state.selectedNumsS2.length < this.state.lotteryInfo.set2PickLimit)) {
          showSweetAlert(swalConfig("选择投注数...", "请填写您的号码选择.", "info"));
          // alert('Please complete your number selection.');
          return;
        } else {
          _selectedNumsS2 = this.state.selectedNumsS2;
        }
      } else {
        _selectedNumsS2 = this.state.selectedNumsS2;
      }
    }

    // console.log(_selectedNumsS2.length, this.state.lotteryInfo.set2PickLimit);

    let linePrice = 0;
    if (!isComboBetSelected) {
      this.state.pricesInfo.prices.map((price,i) => {
        if (price.id === 'line') {
          linePrice = (price.value / 100).toFixed(2);
        }
      });

      //set tickets data here
      /* sample ticket data
        {
          "id": 1,
          "lotteryId": "euroJackpot",
          "selectedNumsSet1": [],
          "selectedNumsSet2": [],
          "hasNumberShield": false,
          "linePrice": 0
        }
       */
      let ticketObj = {
        id: this._generateObjID()(),
        selectedNumsSet1: this.state.selectedNumsS1,
        selectedNumsSet2: _selectedNumsS2,
        hasNumberShield: this.state.numberShieldBtnEnabled,
        linePrice: linePrice,
        type: 'NORMAL'
      };

      let ticketsData = this.state.ticketsData;
      if (ticketsData.length < 100) {
        ticketsData.push(ticketObj);

        this.setState({
          ticketsData: ticketsData,
          isComboBetSelected: false
        });

        // this.refs.numberShieldBtn.classList.remove('selected');
        // this.setState({ numberShieldBtnEnabled: false });

        this._removeSelected();
      } else {
        showSweetAlert(swalConfig("选择投注数...", "最大所选数字仅限于100.", "info"));
      }

    } else {
      let combi1 = combinations(this.state.selectedNumsS1.length,this.state.lotteryInfo.set1PickLimit);
      let combi2 = combinations(_selectedNumsS2.length,this.state.lotteryInfo.set2PickLimit);
      let comboPriceMultiplier = combi1 * combi2;

      this.state.pricesInfo.prices.map((price,i) => {
        if (price.id === 'line') {
          linePrice = (price.value / 100).toFixed(2) * comboPriceMultiplier;
        }
      });

      let ticketObj = {
        id: this._generateObjID()(),
        selectedNumsSet1: this.state.selectedNumsS1,
        selectedNumsSet2: _selectedNumsS2,
        hasNumberShield: this.state.numberShieldBtnEnabled,
        linePrice: linePrice,
        type: this.state.systemType,
        comboBetMultiplier: comboPriceMultiplier
      };

      let ticketsData = this.state.ticketsData;
      if (ticketsData.length < 100) {
        ticketsData.push(ticketObj);

        this.setState({
          ticketsData: ticketsData,
          isComboBetSelected: false
        });

        // this.refs.numberShieldBtn.classList.remove('selected');
        // this.setState({ numberShieldBtnEnabled: false });

        this._removeSelected();
      } else {
        showSweetAlert(swalConfig("选择投注数...", "最大所选数字仅限于100.", "info"));
      }
    }


    // console.log('ObjID', this._generateObjID()());
    // console.log('selectedNumsSet1', this.state.selectedNumsS1);
    // console.log('selectedNumsSet2', _selectedNumsS2);
    // console.log('numberShieldBtnEnabled', this.state.numberShieldBtnEnabled);
  }

  _removeFromTicketsData(id, e) {
    e.preventDefault();

    let ticketsData = this.state.ticketsData;
    _.remove(ticketsData, ['id',id]);

    this.setState({
      ticketsData: ticketsData
    });
  }

  _toggleNumberShield() {
    // this.refs.numberShieldBtn.classList.toggle('selected');
    // this.setState({ numberShieldBtnEnabled: !this.state.numberShieldBtnEnabled });
  }

  _handleQuickPick(num, e) {
      e.preventDefault();

      const { user } = this.props;
      // const { gameId } = this.props.params;
      const { gameId } = this.state;
      let gameData = _.find(this.props.lotteryData, ['id', gameId]);
      let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

      let linePrice = 0;
      // if (user.isLoggedIn) {
        this.state.pricesInfo.prices.map((price,i) => {
          if (price.id === 'line') {
            linePrice = (price.value / 100).toFixed(2);
          }
        });
      // }

      let ticketsData = this.state.ticketsData;

      for (let i=0; i < num; i++) {
        let arr1 = [], arr2 = [];
        /* for Set# 1 */
        while(arr1.length < this.state.lotteryInfo.set1PickLimit) {
          let randomnumber=Math.ceil(Math.random() * nums1);
          let found=false;
          for(let i=0; i < arr1.length; i++) {
            if(arr1[i]==randomnumber) { found=true; break; }
          }
          if(!found) {
            // arr1[arr1.length]=randomnumber.toString();
            arr1.push(parseInt(randomnumber));
          }
        }

        // this.setState({selectedNumCtrS1: this.state.lotteryInfo.set1PickLimit, selectedNumsS1: arr1, set1PickCount: 0});

        /* for Set# 2 */
        if (gameId !== 'markSix') {
          while(arr2.length < this.state.lotteryInfo.set2PickLimit){
            let randomnumber=Math.ceil(Math.random() * nums2);
            let found=false;
            for(let i=0;i < arr2.length;i++){
              if(arr2[i]==randomnumber){ found=true; break; }
            }
            if(!found) {
              // arr2[arr2.length]=randomnumber.toString();
              arr2.push(parseInt(randomnumber));
            }
          }

          // this.setState({selectedNumCtrS2: this.state.lotteryInfo.set2PickLimit, selectedNumsS2: arr2, set2PickCount: 0});
        }

        let ticketObj = {
          id: this._generateObjID()(),
          selectedNumsSet1: arr1,
          selectedNumsSet2: arr2,
          hasNumberShield: false,
          linePrice: linePrice,
          type: 'NORMAL'
        };

        if (ticketsData.length < 100) {
          ticketsData.push(ticketObj);
        } else {
          showSweetAlert(swalConfig("选择投注数...", "最大所选数字仅限于100.", "info"));
        }

      }
      this.setState({
        ticketsData: ticketsData
      });
      // console.log('quickpick:',arrPickedNumbers);
  }

  _convertToLongStr(str, locale) {
    if (str.length > 0 && (str.length < 3 || (str === 'ALL' || str === 'ALLDAYS'))) {
      return getDayString(str, locale);
    } else {
      let daysArr = str.match(/.{1,2}/g);
      let dayString = '';
      _.forEach(daysArr, (s, i) => {
        if (i+1 == daysArr.length) {
          dayString += getDayString(s, locale);
        } else {
          let andChar = (locale == 'zh-cn') ? "和" : " & ";
          dayString += getDayString(s, locale) + andChar;
        }
      });
      return dayString;
    }
  }

  _handleCheckboxChange (id, e) {
    // e.preventDefault();

    if (id === 'POWERPLAY') {
      this.setState({isPowerPlayChecked: !this.state.isPowerPlayChecked});
    } else if (id === 'MEGAPLIER') {
      this.setState({isMegaPlierChecked: !this.state.isMegaPlierChecked});
    }
  }

  _handleDrawTypeChange (id, e) {
    // e.preventDefault();

    if (!this.refs[id].checked) {
      const drawDateValue = this.refs[id].value.split(',');
      const drawDay = id.split('_');

      const { drawingsData } = this.state;
      let drawArray = [];

      $(this.refs[id]).prop("checked", true);

      drawDateValue.map((dt, i) => {
        let drawDate = moment(dt).tz('Asia/Shanghai').format("YYYY-MM-DDTHH:mm");

        drawingsData.map((dd, j) => {
          let ddDrawDate = moment(dd.closingDate).tz('Asia/Shanghai').format("YYYY-MM-DDTHH:mm");
          if (drawDate == ddDrawDate) {

            if (dd.state == "IN_PLAY") {
              let d_info = {
                drawId: dd.id,
                drawDate: dd.closingDate,
                drawType: moment(dd.closingDate).tz('Asia/Shanghai').format('dd').toUpperCase(),
                drawDay: drawDay[1]
              };

              drawArray.push(d_info);
            }
          }
        });

      });
      this.setState({ drawInfoArray: drawArray });

      // if (drawDateValue.length <= 1) {
      //   $(this.refs[id]).prop("checked", false);

      //   disabledArray.push(idNum[1]);
      //   this.setState({ disabledDrawTypes: disabledArray });

      //   showSweetAlert(swalConfig("绘制日期选择:", '抱歉，此抽签日期尚未提供。 请选择其他抽奖日。', "info"));
      // }
    }

  }

  _getNextDates() {
    let theDay = new Date(), day = theDay.getDay();
    let weekdays=new Array(7);

    for(let i=0; i < weekdays.length; i++) {
      let month = theDay.getMonth() + 1;
      let year = theDay.getFullYear();
      let dayNum, dayObj;

      dayNum = theDay.getDate() - day + i; //(day === 0 ? -6 : i);
      if (dayNum < theDay.getDate()) { //include same day
        dayNum += 7;
      }
      dayObj = new Date(new Date().setDate(dayNum));

      if (dayObj.getDate() < theDay.getDate()) {
        if (month === 12) {
          month = 1;
        }
        year += 1;
      }
      weekdays[i] = new Date(year + "/" + month + "/" + dayObj.getDate());
    }

    return weekdays;
  }


  _getDrawData(drawingType) {
    const { drawingsData } = this.state;

    let dayStrArr = [], drawDateObj = {};

    if (drawingType.length > 0 && (drawingType.length < 3)) {
      // let dayStr = getDayString(drawingType);

      let strDay = '';
      // drawingsData.map((draw, idx) => {
      //   let dayName = moment.utc(draw.closingDate).format('ddd');
      //   if (dayStr.toUpperCase() === dayName.toUpperCase()) {
      //     dayStrArr.push(draw.closingDate);
      //     strDay += moment(draw.closingDate).tz('Asia/Shanghai').format('dd').toUpperCase();
      //   }
      // });

      // drawDateObj = {
      //   drawingType: drawingType,
      //   drawDates: dayStrArr,
      //   strDayCN: strDay
      // };

      const drawData = _.filter(drawingsData, ['drawingType', drawingType]);

      if (drawData.length >= 1) {
        drawData.map((draw, idx) => {
          strDay = moment(draw.closingDate).tz('Asia/Shanghai').format('dd').toUpperCase();
          drawDateObj = {
            drawingType: drawingType,
            drawDates: draw.closingDate,
            strDayCN: strDay
          };
        });
      }

    } else {
      if (drawingType.toUpperCase() == "ALL" || drawingType.toUpperCase() == "ALLDAYS") {
        const { lotteryInfo } = this.state;

        let strDay = 'ALLDAYS';
        // lotteryInfo.drawingTypes.map((dtype, i) => {
        //   if (dtype.toUpperCase() != "ALL") {

        //     let dayStr = getDayString(dtype);

        //     drawingsData.map((draw, idx) => {
        //       let dayName = moment.utc(draw.closingDate).format('ddd');
        //       if (dayStr.toUpperCase() === dayName.toUpperCase()) {
        //         dayStrArr.push(draw.closingDate);
        //       }
        //     });
        //     drawDateObj = {
        //       drawingType: drawingType,
        //       drawDates: dayStrArr,
        //       strDayCN: strDay
        //     };
        //   }
        // });
        drawingsData.map((draw, idx) => {
          dayStrArr.push(draw.closingDate);
          drawDateObj = {
            drawingType: drawingType,
            drawDates: dayStrArr,
            strDayCN: strDay
          };
        });

      } else {
        let daysArr = drawingType.match(/.{1,2}/g);
        // let dayString = '';
        let strDay = '';
        _.forEach(daysArr, (s, i) => {
          let dayStr = getDayString(s);

          drawingsData.map((draw, idx) => {
            let dayName = moment.utc(draw.closingDate).format('ddd');
            if (dayStr.toUpperCase() === dayName.toUpperCase()) {
              dayStrArr.push(draw.closingDate);
              strDay += moment(draw.closingDate).tz('Asia/Shanghai').format('dd').toUpperCase();
            }
          });

          drawDateObj = {
            drawingType: drawingType,
            drawDates: dayStrArr,
            strDayCN: strDay
          };
        });
      }
    }
    return drawDateObj;
  }

  _handleDurationOptionChange(e) {
    e.preventDefault();
    this.setState({ durationOptionsValue: parseInt(e.target.value) });
  }


  _drawHTMLforDesktop (rows, rows2, gameId) {
    let gameSpecialNum, powerballPlay, megaPlier, powerPlayChecked, megaPlierChecked;
    switch (gameId) {
      case "euroJackpot":
        gameSpecialNum = "num-ball dark";
        break;
      case "euroMillions":
        gameSpecialNum = "num-star icon";
        break;
      case "powerBall":
        gameSpecialNum = "num-ball red";
        powerPlayChecked = (this.state.isPowerPlayChecked) ? "checked" : '';
        powerballPlay = (
          <div className="box-content">
            <div>
              <input type="checkbox" name="powerball-play" id="powerball-play" ref="powerballPlay" onClick={this._handleCheckboxChange.bind(this,'POWERPLAY')} checked={powerPlayChecked} />
              <label htmlFor="powerball-play" onClick={this._handleCheckboxChange.bind(this,'POWERPLAY')}>威力倍数</label>
            </div>
          </div>);
        break;
      case "megaMillions":
        gameSpecialNum = "num-ball purple";
        megaPlierChecked = (this.state.isMegaPlierChecked) ? "checked" : '';
        megaPlier = (
          <div className="box-content">
            <div>
              <input type="checkbox" name="mega-plier" id="mega-plier" ref="megaPlier" onClick={this._handleCheckboxChange.bind(this,'MEGAPLIER')} checked={megaPlierChecked} />
              <label htmlFor="mega-plier" onClick={this._handleCheckboxChange.bind(this,'MEGAPLIER')}>百万倍数</label>
              <span className="pull-right">中獎時獲得更多獎金</span>
            </div>
          </div>);
        break;
      default:
        gameSpecialNum = "num-ball dark";
    }

    let gameData = _.find(this.props.lotteryData, ['id', gameId]);
    let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

    const { strings: lfg, currency, user, localeData } = this.props;
    const { currentDrawInfo, lotteryInfo, ticketsData, pricesInfo, drawingsData, drawInfoArray, duration1Options, durationOptionsValue } = this.state;
    const YUAN = _.find(currency, ['name', 'Yuan']);

    let linePrice = 0; let disabled = '';
    if (_.isEmpty(pricesInfo.prices)) {
      linePrice = "价格不可用";
      disabled = "disabled";
    } else {
      pricesInfo.prices.map((price,i) => {
        if (price.id === 'line') {
          linePrice = (price.value / 100).toFixed(2);
        }
      });
    }

    let drawingTypes = [];
    let defaultChecked = false, defaultDisabled = false, strDay = '', strDayCN = '';
    const drawDay = currentDrawInfo.drawDay;
    // console.log(dateNow < drawClosingDate);
    if (drawDay) {
      let drawClosingDate = moment(currentDrawInfo.closingDate).tz('Asia/Shanghai');
      let dateNow = moment().tz('Asia/Shanghai');

      lotteryInfo.drawingTypes.map((day,i) => {
        let dayData = this._getDrawData(day);

        if (!_.isEmpty(dayData)) {
          strDay = this._convertToLongStr(day);
          strDayCN = this._convertToLongStr(dayData.strDayCN, 'zh-cn');

          if (strDay.toUpperCase() === drawDay.toUpperCase()) {
            if (dateNow < drawClosingDate) {
              defaultChecked = true;
            }
          } else {
            defaultChecked = false;
          }
          if (_.indexOf(this.state.disabledDrawTypes, ""+(i+1)) > -1) {
            defaultDisabled = true;
          } else {
            defaultDisabled = false;
          }
          drawingTypes.push(
            <span key={(i+1)}>
              <input key={"rdDrawDay"+(day)} type="radio" id={"lottery-day_"+(day)} ref={"lottery-day_"+(day)} name="lotto-day" value={dayData.drawDates} defaultChecked={defaultChecked} disabled={defaultDisabled} onClick={this._handleDrawTypeChange.bind(this, 'lottery-day_'+(day))} />
              <label key={"lblDrawDay"+(day)} htmlFor={"lottery-day_"+(day)} onClick={this._handleDrawTypeChange.bind(this, 'lottery-day_'+(day))} >{strDayCN}</label>
            </span>
          );
        }

      });
    }

    let stakeTotal = 0;
    let tickets = ticketsData.map((t,i) => {
      let num1container = [], num2container = [];

      t.selectedNumsSet1.sort((a, b) => {return a - b;});
      t.selectedNumsSet2.sort((a, b) => {return a - b;});

      t.selectedNumsSet1.map((n1,j) => {
        num1container.push(<span key={n1+j} className="num-ball">{n1}</span>);
      });
      t.selectedNumsSet2.map((n2,k) => {
        num2container.push(<span key={k+1} className={gameSpecialNum}>{n2}</span>);
      });

      stakeTotal += parseFloat(t.linePrice);

      return (
        <div className="bet" key={t.id}>
          {(t.type == 'NORMAL')
          ?
            <div>
              {num1container}
              {(t.selectedNumsSet2.length > 0) &&
                <i className="fa fa-plus" aria-hidden="true"></i>
              }
              {num2container}
            </div>
          :
            <div className="combo-bet">
              {num1container}
              <br />
              {(t.selectedNumsSet2.length > 0) &&
                <i className="fa fa-plus" aria-hidden="true"></i>
              }
              {num2container}
              {(t.selectedNumsSet2.length > 0) ?
              <span>&nbsp;&nbsp;&nbsp;&nbsp;包牌{t.comboBetMultiplier}組號碼</span>
              :
              <span>&nbsp;包牌{t.comboBetMultiplier}組號碼</span>
              }
            </div>
          }
          <span key={i+1} className="checkout-actions">
            {t.hasNumberShield &&
            <a href="#"><Icons iconType="NUMBERSHIELD" fill="#ccc" className="icon svg-icon" /></a>
            }
            <a href="#" onClick={this._removeFromTicketsData.bind(this, t.id)}><Icons iconType="TRASHCAN" fill="#ccc" className="icon svg-icon" /></a>
          </span>
        </div>
      );
    });

    if (this.state.isPowerPlayChecked) {
      let powerPlayPrice = 0;
      pricesInfo.prices.map((price,i) => {
        if (price.id === 'powerPlay') {
          powerPlayPrice = (price.value / 100).toFixed(2);
        }
      });
      if (_.isEmpty(ticketsData) || ticketsData.length <= 0) {
        stakeTotal += parseFloat(powerPlayPrice);
      } else {
        ticketsData.map((t,i) => {
          if (t.type == 'NORMAL') {
            stakeTotal += parseFloat(powerPlayPrice);
          } else {
            stakeTotal = stakeTotal + (t.comboBetMultiplier * parseFloat(powerPlayPrice));
          }
        });
      }
    }

    if (this.state.isMegaPlierChecked) {
      let megaPlierPrice = 0;
      pricesInfo.prices.map((price,i) => {
        if (price.id === 'megaplier') {
          megaPlierPrice = (price.value / 100).toFixed(2);
        }
      });
      if (_.isEmpty(ticketsData) || ticketsData.length <= 0) {
        stakeTotal += parseFloat(megaPlierPrice);
      } else {
        ticketsData.map((t,i) => {
          if (t.type == 'NORMAL') {
            stakeTotal += parseFloat(megaPlierPrice);
          } else {
            stakeTotal = stakeTotal + (t.comboBetMultiplier * parseFloat(megaPlierPrice));
          }
        });
      }
    }

    if (drawInfoArray.length > 0) {
      stakeTotal = stakeTotal * drawInfoArray.length;
    }

    if (durationOptionsValue) {
      stakeTotal = stakeTotal * durationOptionsValue;
    }

    let currCountS1 = this.state.selectedNumCtrS1;
    let currCountS2 = this.state.selectedNumCtrS2;
    let limitCountS1 = this.state.lotteryInfo.set1PickLimit;
    let limitCountS2 = this.state.lotteryInfo.set2PickLimit;
    let btnComboBet;
    const {isComboBetSelected} = this.state;

    let isBtnComboBetEnabled = false;
    if ((currCountS1 >= limitCountS1) && (currCountS2 >= limitCountS2)) { // btn combo bet enabled
      if (isComboBetSelected) {
        btnComboBet = <button className="button selected-combo" ref="btnComboBet" onClick={this._toggleComboBet.bind(this)}><Icons iconType="COMBOBET" fill="#FFF" className="icon svg-icon" />包牌</button>;
      } else {
        btnComboBet = <button className="button white" ref="btnComboBet" onClick={this._toggleComboBet.bind(this)}><Icons iconType="COMBOBET" fill="#000" className="icon svg-icon" />包牌</button>;
      }
      isBtnComboBetEnabled = true;
    } else {
      btnComboBet = <button className="button white" disabled ref="btnComboBet"><Icons iconType="COMBOBET" fill="#000" className="icon svg-icon" />包牌</button>;
      isBtnComboBetEnabled = false;
    }
    this._disableExtraNums(isBtnComboBetEnabled);

    return (
      <div className="section">
        <div id="bet-config" className="gray-box">
          <div className="box-content">
            <h5>{localeData['betConfig.drawDay.label']} :</h5>
            <div className="draw-days">
              {drawingTypes}
            </div>
          </div>
          <hr />
          <div className="box-content">
            <h5>{localeData['betConfig.betDuration.label']} {/*連續下注*/}:</h5>
            <div>
              <input type="radio" id="bet-duration1" ref="bet-duration1" name="bet-duration" defaultChecked="true" defaultValue="on" />
              <label htmlFor="bet-duration1">{localeData['betConfig.betDuration.label']}</label>
              <div className="select-wrapper small">
                <select name="bet-duration-option" id="bet-duration-option" ref="bet-duration-option" onChange={this._handleDurationOptionChange.bind(this)} value={this.state.durationOptionsValue}>
                  {duration1Options.map((dur, i) => (
                  <option key={"dur"+(dur.value)} value={dur.value}>{dur.text}</option>
                  ))}
                </select>
              </div>
              {/*<input type="checkbox" name="continuous" id="continuous-bet" ref="continuous-bet" disabled />
              <label htmlFor="continuous-bet">{lfg.betConfig.duration1Checkbox}</label>
              <input type="radio" id="bet-duration2" ref="bet-duration2" name="bet-duration" disabled />
              <label htmlFor="bet-duration2">{lfg.betConfig.duration2}</label>*/}
            </div>
          </div>
          {/*<hr />
          <div className="box-content">
            <h5>{lfg.betConfig.deferredPlayLabel}</h5>
            <div>
              <input type="checkbox" name="timing" id="bet-timing" ref="bet-timing" disabled />
              <label htmlFor="bet-timing">{lfg.betConfig.minJackpotCheckbox}</label>
              <div className="select-wrapper small">
                <select name="bet-timing-option1" id="bet-timing-option1" ref="bet-timing-option1" disabled>
                  <option key={"jackpotAmt0"} value=""></option>
                  {lfg.betConfig.minJackpotOptions.map((amt, i) => (
                  <option key={"jackpotAmt"+(i+1)} value={i+1}>{amt} 萬</option>
                  ))}
                </select>
              </div>
              <div className="select-wrapper small">
                <select name="bet-timing-option2" id="bet-timing-option2" ref="bet-timing-option2" disabled>
                  <option key={"fdDate0"} value=""></option>
                  {lfg.betConfig.firstDrawOptions.map((date, i) => (
                  <option key={"fdDate"+(i+1)} value={i+1}>時下注七 {date}</option>
                  ))}
                </select>
              </div>
              <span className="labelForSelect">{lfg.betConfig.firstDrawLabel}</span>
            </div>
          </div>
          <hr />
          {(gameId === 'markSix') ? '' : [
          <div className="box-content">
            <div className="half-left">
              <h5>{lfg.betConfig.doubleJackpotLabel}&nbsp;{(this.props.language.current === 'zh-cn') && lfg.common.currency}</h5>
              <h1 className="double-jackpot">{this.state.currentDrawInfo.jackpotAmt} 万</h1>
            </div>
            <div className="half-right">
              <h5>&nbsp;</h5>
              <div>
                <input type="radio" id="bet-confirm1" name="bet-confirm" ref="bet-confirm1" disabled />
                <label htmlFor="bet-confirm1">{lfg.betConfig.doubleJackpotConfirm1}</label>
                <input type="radio" id="bet-confirm2" name="bet-confirm" ref="bet-confirm2" disabled />
                <label htmlFor="bet-confirm2">{lfg.betConfig.doubleJackpotConfirm2}</label>
              </div>
            </div>
          </div>
          ] */}
          {(gameId === 'powerBall' || gameId === 'megaMillions') ? <hr /> : ''}
          {powerballPlay}
          {megaPlier}
        </div>
        <div id="bet-slip">
          <div id="bet-slip-form-wrapper">
            <div className="rowWrapper">
              <div className="half-left">
                <div id="bet-slip-form">
                  <div className="set1">{rows}</div>
                  {(gameId !== 'markSix' && gameId !== 'polishMiniLotto') &&
                  <span key="plusIcon1" className="plus"><i className="fa fa-plus" aria-hidden="true"></i></span>
                  }
                  <div className="set2">{rows2}</div>
                </div>
              </div>
              <div className="half-right">
                <div id="bet-slip-actions">
                  <div className="bet-notice">
                    <h4>{nums1} {localeData['betSlip.forLabel']} {lotteryInfo.set1PickLimit} :</h4>
                    <p>{localeData['betSlip.pickMore'].replace('{pickCount}',this.state.set1PickCount).replace('[s]','number/s')}</p>
                    {(nums2 <= 0 || (gameId === 'powerBall' || gameId === 'megaMillions')) ? '' : (
                    <h4>{nums2} {localeData['betSlip.forLabel']} {lotteryInfo.set2PickLimit} :</h4>
                    )}
                    {(nums2 <= 0 || (gameId === 'powerBall' || gameId === 'megaMillions')) ? '' : (
                    <p>{localeData['betSlip.pickMore'].replace('{pickCount}',this.state.set2PickCount).replace('[s]','number/s')}</p>
                    )}
                    {
                      (gameId === 'powerBall' || gameId === 'megaMillions') ? <h4>{localeData['betSlip.systemLabel']} :</h4> : null
                    }
                    {
                      (gameId === 'powerBall' || gameId === 'megaMillions') ? <p>{localeData['betSlip.systemContent']}</p> : null
                    }
                    {(isComboBetSelected && this.state.systemType !== 'NORMAL') ?
                    <h4>包牌 :</h4>
                    : ""}
                    {(isComboBetSelected && this.state.systemType !== 'NORMAL') ?
                    <p>{nums1}選{this.state.selectedNumCtrS1}，
                      {(gameId !== 'powerBall' && gameId !== 'megaMillions' && gameId !== 'markSix') && `${nums2}選${this.state.selectedNumCtrS2}，`}
                      包牌{this.state.comboBetMultiplier}注</p>
                    : ""}
                   {/* <h4>{localeData['betSlip.systemLabel']} :</h4>
                                       <p>{localeData['betSlip.systemContent']}</p>*/}
                  </div>
                  <div className="bet-buttons">
                    <button className="button white" onClick={this._autoPickNumbers.bind(this)}><Icons iconType="AUTOPICK" fill="#000" className="icon svg-icon" />{localeData['betSlip.autoPickBtnLabel']}</button>
                    {/*<button ref="numberShieldBtn" className="button white disabled" onClick={this._toggleNumberShield.bind(this)} disabled><Icons iconType="NUMBERSHIELD" fill="#000" className="icon svg-icon" />{lfg.betSlip.numberShieldBtnLabel}</button>*/}
                    {btnComboBet}
                    <button className="button white" onClick={this._removeSelected.bind(this)}><Icons iconType="TRASHCAN" fill="#000" className="icon svg-icon" />{localeData['betSlip.clearBtnLabel']}</button>
                    <button className="button special" onClick={this._addSelectedNumsToTicketData.bind(this)}><Icons iconType="CONFIRM" fill="#fff" className="icon svg-icon" />{localeData['betSlip.submitBtnLabel']}</button>
                  </div>
                  <div className="bet-price">
                    <h3>{(_.isEmpty(pricesInfo.prices)) ? '' : YUAN.unicode} {linePrice}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="checkout-slip" className="gray-box">
          <div className="box-content">
            <div id="checkout-buttons">
              <button className="button checkout-options" onClick={this._handleQuickPick.bind(this, 1)}>+1 {localeData['checkoutSlip.quickPickLabel']}</button>
              <button className="button checkout-options" onClick={this._handleQuickPick.bind(this, 6)}>+6 {localeData['checkoutSlip.quickPickLabel']}</button>
              {/*<button className="button checkout-options disabled" disabled><Icons iconType="NUMBERSHIELD" fill={(gameId === 'megaMillions') ? "#fff" : "#000"} className="icon svg-icon" />{lfg.checkoutSlip.shieldAllLabel}</button>*/}
            </div>
            <div id="chosen-bets">
              {tickets}
            </div>
            <div id="checkout-subtotal">{localeData['checkoutSlip.subTotal']} : {(_.isEmpty(pricesInfo.prices)) ? '' : YUAN.unicode} {(_.isEmpty(pricesInfo.prices)) ? '不可用' : stakeTotal}</div>
            <div id="checkout-button">
              <button className={`button special ${disabled}`} disabled={disabled} onClick={this._handleCheckoutBets.bind(this)}>{localeData['checkoutSlip.checkOutBtnLabel']}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _drawHTMLforMobile (rows, rows2, gameId) {
    let gameSpecialNum, powerballPlay, megaPlier, powerPlayChecked, megaPlierChecked;
    switch (gameId) {
      case "euroJackpot":
        gameSpecialNum = "num-ball dark";
        break;
      case "euroMillions":
        gameSpecialNum = "num-star icon";
        break;
      case "powerBall":
        gameSpecialNum = "num-ball red";
        powerPlayChecked = (this.state.isPowerPlayChecked) ? "checked" : '';
        powerballPlay = (
          <div className="box-content">
            <div>
              <input type="checkbox" name="powerball-play" id="powerball-play" ref="powerballPlay" onClick={this._handleCheckboxChange.bind(this,'POWERPLAY')} checked={powerPlayChecked} />
              <label htmlFor="powerball-play" onClick={this._handleCheckboxChange.bind(this,'POWERPLAY')}>威力倍数</label>
            </div>
          </div>);
        break;
      case "megaMillions":
        gameSpecialNum = "num-ball purple";
        megaPlierChecked = (this.state.isMegaPlierChecked) ? "checked" : '';
        megaPlier = (
          <div className="box-content">
            <div>
              <input type="checkbox" name="mega-plier" id="mega-plier" ref="megaPlier" onClick={this._handleCheckboxChange.bind(this,'MEGAPLIER')} checked={megaPlierChecked} />
              <label htmlFor="mega-plier" onClick={this._handleCheckboxChange.bind(this,'MEGAPLIER')}>百万倍数</label>
              <span className="pull-right">中獎時獲得更多獎金</span>
            </div>
          </div>);
        break;
      default:
        gameSpecialNum = "num-ball dark";
    }

    let gameData = _.find(this.props.lotteryData, ['id', gameId]);
    let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

    const { strings: lfg, currency, user, localeData } = this.props;
    const { currentDrawInfo, lotteryInfo, ticketsData, pricesInfo, drawingsData, drawInfoArray, duration1Options, durationOptionsValue } = this.state;
    const YUAN = _.find(currency, ['name', 'Yuan']);

    let linePrice = 0; let disabled = '';
    if (_.isEmpty(pricesInfo.prices)) {
      linePrice = "价格不可用";
      disabled = "disabled";
    } else {
      pricesInfo.prices.map((price,i) => {
        if (price.id === 'line') {
          linePrice = (price.value / 100).toFixed(2);
        }
      });
    }

    let drawingTypes = [];
    let defaultChecked = false, defaultDisabled = false, strDay = '', strDayCN = '';
    const drawDay = currentDrawInfo.drawDay;
    if (drawDay) {
      let drawClosingDate = moment(currentDrawInfo.closingDate).tz('Asia/Shanghai');
      let dateNow = moment().tz('Asia/Shanghai');

      lotteryInfo.drawingTypes.map((day,i) => {
        let dayData = this._getDrawData(day);

        if (!_.isEmpty(dayData)) {
          strDay = this._convertToLongStr(day);
          strDayCN = this._convertToLongStr(dayData.strDayCN, 'zh-cn');

          if (strDay.toUpperCase() === drawDay.toUpperCase()) {
            if (dateNow < drawClosingDate) {
              defaultChecked = true;
            }
          } else {
            defaultChecked = false;
          }
          if (_.indexOf(this.state.disabledDrawTypes, ""+(i+1)) > -1) {
            defaultDisabled = true;
          } else {
            defaultDisabled = false;
          }
          drawingTypes.push(
            <span key={(i+1)}>
              <input key={"rdDrawDay"+(day)} type="radio" id={"lottery-day_"+(day)} ref={"lottery-day_"+(day)} name="lotto-day" value={dayData.drawDates} defaultChecked={defaultChecked} disabled={defaultDisabled} onClick={this._handleDrawTypeChange.bind(this, 'lottery-day_'+(day))} />
              <label key={"lblDrawDay"+(day)} htmlFor={"lottery-day_"+(day)} onClick={this._handleDrawTypeChange.bind(this, 'lottery-day_'+(day))} >{strDayCN}</label>
            </span>
          );
        }
      });
    }

    let stakeTotal = 0;
    let tickets = ticketsData.map((t,i) => {
      let num1container = [], num2container = [];

      t.selectedNumsSet1.sort((a, b) => {return a - b;});
      t.selectedNumsSet2.sort((a, b) => {return a - b;});

      t.selectedNumsSet1.map((n1,j) => {
        num1container.push(<span key={n1+j} className="num-ball">{n1}</span>);
      });
      t.selectedNumsSet2.map((n2,k) => {
        num2container.push(<span key={k+1} className={gameSpecialNum}>{n2}</span>);
      });

      stakeTotal += parseFloat(t.linePrice);

      return (
        <div className="bet" key={t.id}>
          {(t.type == 'NORMAL')
          ?
            <div>
              {num1container}
              {(t.selectedNumsSet2.length > 0) &&
                <i className="fa fa-plus" aria-hidden="true"></i>
              }
              {num2container}
            </div>
          :
            <div className="combo-bet">
              {num1container}
              <br />
              {(t.selectedNumsSet2.length > 0) &&
                <i className="fa fa-plus" aria-hidden="true"></i>
              }
              {num2container}
              {(t.selectedNumsSet2.length > 0) ?
              <span>&nbsp;&nbsp;&nbsp;&nbsp;包牌{t.comboBetMultiplier}組號碼</span>
              :
              <span>&nbsp;包牌{t.comboBetMultiplier}組號碼</span>
              }
            </div>
          }
          <span key={i+1} className="checkout-actions">
            {t.hasNumberShield &&
            <span><Icons iconType="NUMBERSHIELD" fill="#ccc" className="icon svg-icon" /></span>
            }
            <button className="svg-icon-button" onClick={this._removeFromTicketsData.bind(this, t.id)}><Icons iconType="TRASHCAN" fill="#ccc" className="icon svg-icon" /></button>
          </span>
        </div>
      );
    });

    if (this.state.isPowerPlayChecked) {
      let powerPlayPrice = 0;
      pricesInfo.prices.map((price,i) => {
        if (price.id === 'powerPlay') {
          powerPlayPrice = (price.value / 100).toFixed(2);
        }
      });
      if (_.isEmpty(ticketsData) || ticketsData.length <= 0) {
        stakeTotal += parseFloat(powerPlayPrice);
      } else {
        ticketsData.map((t,i) => {
          if (t.type == 'NORMAL') {
            stakeTotal += parseFloat(powerPlayPrice);
          } else {
            stakeTotal = stakeTotal + (t.comboBetMultiplier * parseFloat(powerPlayPrice));
          }
        });
      }
    }

    if (this.state.isMegaPlierChecked) {
      let megaPlierPrice = 0;
      pricesInfo.prices.map((price,i) => {
        if (price.id === 'megaplier') {
          megaPlierPrice = (price.value / 100).toFixed(2);
        }
      });
      if (_.isEmpty(ticketsData) || ticketsData.length <= 0) {
        stakeTotal += parseFloat(megaPlierPrice);
      } else {
        ticketsData.map((t,i) => {
          if (t.type == 'NORMAL') {
            stakeTotal += parseFloat(megaPlierPrice);
          } else {
            stakeTotal = stakeTotal + (t.comboBetMultiplier * parseFloat(megaPlierPrice));
          }
        });
      }
    }

    if (drawInfoArray.length > 0) {
      stakeTotal = stakeTotal * drawInfoArray.length;
    }

    if (durationOptionsValue) {
      stakeTotal = stakeTotal * durationOptionsValue;
    }

    let currCountS1 = this.state.selectedNumCtrS1;
    let currCountS2 = this.state.selectedNumCtrS2;
    let limitCountS1 = this.state.lotteryInfo.set1PickLimit;
    let limitCountS2 = this.state.lotteryInfo.set2PickLimit;
    let btnComboBet;
    const {isComboBetSelected} = this.state;

    let isBtnComboBetEnabled = false;
    if ((currCountS1 >= limitCountS1) && (currCountS2 >= limitCountS2)) { // btn combo bet enabled
      if (isComboBetSelected) {
        btnComboBet = <button className="button selected-combo" ref="btnComboBet" onClick={this._toggleComboBet.bind(this)}><Icons iconType="COMBOBET" fill="#FFF" className="icon svg-icon" />包牌</button>;
      } else {
        btnComboBet = <button className="button white" ref="btnComboBet" onClick={this._toggleComboBet.bind(this)}><Icons iconType="COMBOBET" fill="#000" className="icon svg-icon" />包牌</button>;
      }
      isBtnComboBetEnabled = true;
    } else {
      btnComboBet = <button className="button white" disabled ref="btnComboBet"><Icons iconType="COMBOBET" fill="#000" className="icon svg-icon" />包牌</button>;
      isBtnComboBetEnabled = false;
    }
    this._disableExtraNums(isBtnComboBetEnabled);


    const brkPt = _getBreakpoint(this.state.windowWidth);
    let betSlipFormHtml;
    if (brkPt === 'XS') {
      betSlipFormHtml = (
        <div id="bet-slip-form-wrapper">
          <div id="bet-slip-form">
            <div>
              <div className="set1">{rows}</div>
              {(gameId !== 'markSix' && gameId !== 'polishMiniLotto') &&
              <span key="plusIcon1" className="plus"><i className="fa fa-plus" aria-hidden="true"></i></span>
              }
              <div className="set2">{rows2}</div>
            </div>
          </div>
          <div className="bet-price">
            <h3>{(_.isEmpty(pricesInfo.prices)) ? '' : YUAN.unicode} {linePrice}</h3>
          </div>
          <div className="bet-buttons">
            <button className="button white" onClick={this._autoPickNumbers.bind(this)}><Icons iconType="AUTOPICK" fill="#000" className="icon svg-icon" />{localeData['betSlip.autoPickBtnLabel']}</button>
            {/*<button ref="numberShieldBtn" className="button white disabled" onClick={this._toggleNumberShield.bind(this)} disabled><Icons iconType="NUMBERSHIELD" fill="#000" className="icon svg-icon" />{lfg.betSlip.numberShieldBtnLabel}</button>*/}
            {btnComboBet}
            <button className="button white" onClick={this._removeSelected.bind(this)}><Icons iconType="TRASHCAN" fill="#000" className="icon svg-icon" />{localeData['betSlip.clearBtnLabel']}</button>
            <button className="button special" onClick={this._addSelectedNumsToTicketData.bind(this)}><Icons iconType="CONFIRM" fill="#fff" className="icon svg-icon" />{localeData['betSlip.submitBtnLabel']}</button>
          </div>
        </div>
      );
    } else if (brkPt === 'S') {
      betSlipFormHtml = (
        <div id="bet-slip-form-wrapper">
          <div className="rowWrapper">
            <div className="half-left">
              <div id="bet-slip-form">
                <div>
                  <div className="set1">{rows}</div>
                  {(gameId !== 'markSix' && gameId !== 'polishMiniLotto') &&
                  <span key="plusIcon1" className="plus"><i className="fa fa-plus" aria-hidden="true"></i></span>
                  }
                  <div className="set2">{rows2}</div>
                </div>
              </div>
            </div>
            <div className="half-right">
              <div id="bet-slip-actions">
                <div className="bet-notice">
                  <h4>{nums1} {localeData['betSlip.forLabel']} {lotteryInfo.set1PickLimit} :</h4>
                  <p>{localeData['betSlip.pickMore'].replace('{pickCount}',this.state.set1PickCount).replace('[s]','number/s')}</p>
                  {(nums2 <= 0 || (gameId === 'powerBall' || gameId === 'megaMillions')) ? '' : (
                  <h4>{nums2} {localeData['betSlip.forLabel']} {lotteryInfo.set2PickLimit} :</h4>
                  )}
                  {(nums2 <= 0 || (gameId === 'powerBall' || gameId === 'megaMillions')) ? '' : (
                  <p>{localeData['betSlip.pickMore'].replace('{pickCount}',this.state.set2PickCount).replace('[s]','number/s')}</p>
                  )}
                  {
                    (gameId === 'powerBall' || gameId === 'megaMillions') ? <h4>{localeData['betSlip.systemLabel']} :</h4> : null
                  }
                  {
                    (gameId === 'powerBall' || gameId === 'megaMillions') ? <p>{localeData['betSlip.systemContent']}</p> : null
                  }
                  {(isComboBetSelected && this.state.systemType !== 'NORMAL') ?
                  <h4>包牌 :</h4>
                  : ""}
                  {(isComboBetSelected && this.state.systemType !== 'NORMAL') ?
                  <p>{nums1}選{this.state.selectedNumCtrS1}，
                    {(gameId !== 'powerBall' && gameId !== 'megaMillions' && gameId !== 'markSix') && `${nums2}選${this.state.selectedNumCtrS2}，`}
                    包牌{this.state.comboBetMultiplier}注</p>
                  : ""}
                 {/* <h4>{localeData['betSlip.systemLabel']} :</h4>
                                   <p>{localeData['betSlip.systemContent']}</p>*/}
                </div>
                <div className="bet-buttons">
                  <button className="button white" onClick={this._autoPickNumbers.bind(this)}><Icons iconType="AUTOPICK" fill="#000" className="icon svg-icon" />{localeData['betSlip.autoPickBtnLabel']}</button>
                  {/*<button ref="numberShieldBtn" className="button white disabled" onClick={this._toggleNumberShield.bind(this)} disabled><Icons iconType="NUMBERSHIELD" fill="#000" className="icon svg-icon" />{lfg.betSlip.numberShieldBtnLabel}</button>*/}
                  {btnComboBet}
                  <button className="button white" onClick={this._removeSelected.bind(this)}><Icons iconType="TRASHCAN" fill="#000" className="icon svg-icon" />{localeData['betSlip.clearBtnLabel']}</button>
                  <button className="button special" onClick={this._addSelectedNumsToTicketData.bind(this)}><Icons iconType="CONFIRM" fill="#fff" className="icon svg-icon" />{localeData['betSlip.submitBtnLabel']}</button>
                </div>
                <div className="bet-price">
                  <h3>{(_.isEmpty(pricesInfo.prices)) ? '' : YUAN.unicode} {linePrice}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }


    return (
      <div className="section group">
        <div id="bet-slip">
          <div id="checkout-buttons">
            <button className="button checkout-options" onClick={this._handleQuickPick.bind(this, 1)}>+1  {localeData['checkoutSlip.quickPickLabel']}</button>
            <button className="button checkout-options" onClick={this._handleQuickPick.bind(this, 6)}>+6 {localeData['checkoutSlip.quickPickLabel']}</button>
            {/*<button className="button checkout-options disabled" disabled><Icons iconType="NUMBERSHIELD" fill="#fff" className="icon svg-icon" />{lfg.checkoutSlip.shieldAllLabel}</button>*/}
          </div>
          <div id="chosen-bets">
            {tickets}
          </div>
          {betSlipFormHtml}
          <div id="bet-config" className="gray-box">
            <div className="box-content">
              <h5>{localeData['betConfig.drawDay.label']} :</h5>
              <div>
                {drawingTypes}
              </div>
            </div>
            <hr />
            <div className="box-content">
              <h5>{localeData['betConfig.betDuration.label']} :</h5>
              <div>
                <input type="radio" id="bet-duration1" ref="bet-duration1" name="bet-duration" defaultChecked="true" defaultValue="on" />
                <label htmlFor="bet-duration1">{localeData['betConfig.betDuration.label']}</label>
                <div className="select-wrapper small">
                  <select name="bet-duration-option" id="bet-duration-option" ref="bet-duration-option" onChange={this._handleDurationOptionChange.bind(this)} value={this.state.durationOptionsValue}>
                    {duration1Options.map((dur, i) => (
                    <option key={"dur"+(dur.value)} value={dur.value}>{dur.text}</option>
                    ))}
                  </select>
                </div>
                {/*<input type="checkbox" name="continuous" id="continuous-bet" ref="continuous-bet" disabled />
                <label htmlFor="continuous-bet">{lfg.betConfig.duration1Checkbox}</label>
                <input type="radio" id="bet-duration2" ref="bet-duration2" name="bet-duration" disabled />
                <label htmlFor="bet-duration2">{lfg.betConfig.duration2}</label>*/}
              </div>
            </div>
            {/*<hr />
            <div className="box-content">
              <div>
                <input type="checkbox" name="timing" id="bet-timing" ref="bet-timing" disabled />
                <label htmlFor="bet-timing">{lfg.betConfig.minJackpotCheckbox}</label>
                <div className="select-wrapper small">
                  <select name="bet-timing-option1" id="bet-timing-option1" ref="bet-timing-option1" disabled>
                  <option key={"jackpotAmt0"} value=""></option>
                  {lfg.betConfig.minJackpotOptions.map((amt, i) => (
                  <option key={"jackpotAmt"+(i+1)} value={i+1}>{amt} 萬</option>
                  ))}
                  </select>
                </div>
                { / * <span className="labelForSelect">時下注</span> * / }
                <div className="select-wrapper small">
                  <select name="bet-timing-option2" id="bet-timing-option2" ref="bet-timing-option2" disabled>
                  <option key={"fdDate0"} value=""></option>
                  {lfg.betConfig.firstDrawOptions.map((date, i) => (
                  <option key={"fdDate"+(i+1)} value={i+1}>時下注七 {date}</option>
                  ))}
                  </select>
                </div>
                <span className="labelForSelect">{lfg.betConfig.firstDrawLabel}</span>
              </div>
            </div>
            <hr />
            <div className="box-content">
              <h5>{lfg.betConfig.doubleJackpotLabel} :</h5>
              <div>
                <input type="radio" id="bet-confirm1" name="bet-confirm" ref="bet-confirm1" disabled />
                <label htmlFor="bet-confirm1">{lfg.betConfig.doubleJackpotConfirm1}</label>
                <input type="radio" id="bet-confirm2" name="bet-confirm" ref="bet-confirm2" disabled />
                <label htmlFor="bet-confirm2">{lfg.betConfig.doubleJackpotConfirm2}</label>
              </div>
            </div>*/}
            {(gameId === 'powerBall' || gameId === 'megaMillions') ? <hr /> : ''}
            {powerballPlay}
            {megaPlier}
          </div>
        </div>
        <div id="checkout-slip" className="gray-box">
          <div className="box-content">
            <div id="checkout-subtotal">{localeData['checkoutSlip.subTotal']} : {(_.isEmpty(pricesInfo.prices)) ? '' : YUAN.unicode} {(_.isEmpty(pricesInfo.prices)) ? '不可用' : stakeTotal}</div>
            <div id="checkout-button">
              <button className={`button special ${disabled}`} disabled={disabled} onClick={this._handleCheckoutBets.bind(this)}>{localeData['checkoutSlip.checkOutBtnLabel']}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  _handleCheckoutBets(e) {
    window.scrollTo(0, 0);

    const { gameId, pricesInfo, currentDrawInfo, drawInfoArray, ticketsData, durationOptionsValue } = this.state;
    const YUAN = _.find(this.props.currency, ['name', 'Yuan']);

    if (ticketsData.length < 1) {
      showSweetAlert(swalConfig("结帐投注...", "请选择你的赌注.", "info"));
      // alert('Please pick your bets!');
      return;
    }

    const { user, wallet, lfgAction } = this.props;

    let token = '';
    if (user.isLoggedIn) {
      token = user.info.token;

      let linesData = [];
      let stakeTotal = 0;
      linesData = this.state.ticketsData.map((t, i) => {
        stakeTotal += parseFloat(t.linePrice);
        let line = {
          id: i,
          numbers: t.selectedNumsSet1,
          additionalNumbers: t.selectedNumsSet2,
          type: t.type
        };
        return line;
      });

      let options = [];
      if (this.state.isPowerPlayChecked) {
        let powerPlayPrice = 0;
        pricesInfo.prices.map((price,i) => {
          if (price.id === 'powerPlay') {
            powerPlayPrice = (price.value / 100).toFixed(2);
          }
        });
        if (_.isEmpty(ticketsData)) {
          stakeTotal += parseFloat(powerPlayPrice);
        } else {
          ticketsData.map((t,i) => {
            if (t.type == 'NORMAL') {
              stakeTotal += parseFloat(powerPlayPrice);
            } else {
              stakeTotal = stakeTotal + (t.comboBetMultiplier * parseFloat(powerPlayPrice));
            }
          });
        }
        options.push("powerPlay");
      }

      if (this.state.isMegaPlierChecked) {
        let megaPlierPrice = 0;
        pricesInfo.prices.map((price,i) => {
          if (price.id === 'megaplier') {
            megaPlierPrice = (price.value / 100).toFixed(2);
          }
        });
        if (_.isEmpty(ticketsData)) {
          stakeTotal += parseFloat(megaPlierPrice);
        } else {
          ticketsData.map((t,i) => {
            if (t.type == 'NORMAL') {
              stakeTotal += parseFloat(megaPlierPrice);
            } else {
              stakeTotal = stakeTotal + (t.comboBetMultiplier * parseFloat(megaPlierPrice));
            }
          });
        }
        options.push("megaplier");
      }

      if (drawInfoArray.length > 0) {
        stakeTotal = stakeTotal * drawInfoArray.length;
      }

      if (durationOptionsValue) {
        stakeTotal = stakeTotal * durationOptionsValue;
      }

      let balance = 0;
      let cashWallet = _.find(wallet, {type: 'cash'});
      if (!_.isEmpty(cashWallet)){
        balance = cashWallet.balance.toLocaleString();
      }

      if (balance < stakeTotal) {
        //swalConfig("Checkout bets...", "Your current balance is not enough to place bet/s. ", "info")
        showSweetAlert({
            title: "结帐投注...",
            // text: "Your current balance is not enough to place bet/s. Click the OK button to be redirected to the My Account page.",
            text: "您当前的余额不足以投注. 单击确定按钮将重定向到我的帐户页面",
            type: "info",
            showCancelButton: false,
            confirmButtonColor: "#f3a71e"
          }).then(function () {
            //redirect to Cashier page
            browserHistory.push('/my-account');
          });
        return;
      }

      let betBodyArr = [];

      let drawDate = '';
      let strDays = '';
      let lifespanData = {};
      let partData = {};
      partData = {
        drawingId: drawInfoArray[0].drawId
      };
      _.sortBy(drawInfoArray, "drawDate").map((di, idx) => {
        if (di.drawDay.length > 2) {
          partData = {
            drawingId: this.state.currentDrawInfo.drawId
          };
        }

        lifespanData = {
          drawingType: di.drawDay,
          duration: durationOptionsValue
        };

        let dateStr = moment(di.drawDate).tz('Asia/Shanghai').format('YYYY/MM/DD');
        strDays += di.drawType;
        if (idx+1 == drawInfoArray.length) {
          drawDate += dateStr;
        } else {
          drawDate += dateStr + ", ";
        }
      });

      let betBody = {
        accessToken: token,
        ticketPayload: {
          id: "",
          lotteryId: this.state.gameId,
          options: options,
          firstDraw: partData.drawingId, // this.state.currentDrawInfo.drawId,
          ticketNr:null,
          betMultiplier:null,
          jokerMultiplier:null,
          elGordoData:null,
          jokerSelections:null,
          doubleJackpot:false,
          // shares:0,
          // totalShares:0,
          lifespan: lifespanData,
          lines: linesData
          // specialJackpot:0
        }
      };

      // console.log(partData.drawingId, this.state.currentDrawInfo.drawId);
      // console.log("ticketPayload", JSON.stringify(betBody.ticketPayload));

      // betBodyArr.push(betBody);

      let gameData = _.find(this.props.lotteryData, ['id', gameId]);
      let lottoName = gameData.name;

      let strDayCN = this._convertToLongStr(strDays, 'zh-cn');

      let durStr = (durationOptionsValue > 1) ? ` (${durationOptionsValue}周)` : '';

      let ticketInfo = `您将购买: ${lottoName} 彩票共${linesData.length}张<br/>`;
      let drawDateInfo = `开奖日期是 ${drawDate}${durStr}<br/>`; //(drawInfoArray.length > 1) ? `投注时间从 ${drawDate}<br/>` :
      let drawDayInfo = `开奖设定：${strDayCN}`;

      let subTitle = `<span class="half-left">您将消费： <b><span style=color:#FFF>${YUAN.unicode} ${stakeTotal}人民币</span></b></span>` +
                     `<span class="half-right">目前余额： <b><span style=color:#FFF>${YUAN.unicode} ${balance}人民币</span></b></span>` +
                     `<div>` +ticketInfo+drawDateInfo+drawDayInfo+ `</div>`;
                     // `<div>可在 <span class="green-text">我的彩券</span> 中看到你购买的彩券, 祝你好运！</div>`;

      showSweetAlert({
          title: "付款确认",
          html: subTitle,
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#f3a71e",
          // cancelButtonColor: "#dd636f",
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          width: 650,
          allowOutsideClick: false,
          showLoaderOnConfirm: true,
          preConfirm: function () {
            return new Promise(function (resolve, reject) {
              // console.log(lfgAction);
              // this.setState({ ticketsData: [] });
              // sessionStorage.removeItem('betsData');
              window.name = '';
              let ctr = 0;

              // this code is for testing purposes only
              // drawInfoArray.map((di, idx) => {
              //   let dd = moment.utc(di.drawDate).format("YYYY-MM-DD");
              //   lfgAction.fetchDrawingsByDate(YUAN.abbr, gameId, dd)
              //     .then((res) => {
              //       if (res.statusCode !== 500) {
              //         ctr++;

              //         console.log("ctr", ctr);
              //         if (ctr >= drawInfoArray.length){
              //           resolve();
              //         }
              //       } else {
              //         reject();
              //       }
              //     }).catch((err) => {
              //       reject();
              //     });
              // });

              // betBodyArr.map((body, i) => {
                lfgAction.postBets(betBody)
                  .then((res) => {
                    if (res.statusCode !== 500) {
                      // ctr++;
                      // if (ctr >= betBodyArr.length){
                        resolve();
                      // }
                    } else {
                      reject();
                    }
                  }).catch((err) => {
                    reject();
                  });
              // });

            })
          }
        }).then(function () {
          browserHistory.push('/lfg-summary/'+gameId.toLowerCase());
          console.log("success");
        }, function (dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            console.log("cancelled");
          }
        });

    } else {
      // redirect to register page
      // showSweetAlert(swalConfig("结帐投注...", '您需要登录才能下注.', "info"));
      const { keycloak } = this.props;

      let betsData = {
        lotteryId: this.state.gameId,
        drawId: this.state.currentDrawInfo.drawId,
        ticketsData: this.state.ticketsData
      };
      // console.log(betsData);

      showSweetAlert({
          title: "结帐投注...",
          text: "您需要登录才能下注.",
          type: "info",
          showCancelButton: true,
          confirmButtonColor: "#f3a71e",
          confirmButtonText: "注册一个帐户？",
          cancelButtonText: "取消",
          allowOutsideClick: false,
          showLoaderOnConfirm: true,
          preConfirm: function () {
            return new Promise(function (resolve, reject) {
              // this._storeBetsData(betsData);
              // sessionStorage.setItem('betsData', JSON.stringify(betsData));
              window.name = JSON.stringify(betsData);
              keycloak.register({ redirectUri: config.lottoland+window.location.pathname });
              resolve();
            })
          }
      }).then(function () {
          console.log("redirect to register");
      }, function (dismiss) {
          if (dismiss === 'cancel') {
            console.log("cancelled");
          }
      });

      // return;
    }
  }

  // _storeBetsData(betsData) {
  //   sessionStorage.setItem('betsData', JSON.stringify(betsData));
    // window.name = JSON.stringify(betsData);
  // }

  _getBetsData(gameId, drawId) {
    // let betsData = JSON.parse(sessionStorage.getItem('betsData'));
    let betString = window.name;
    let betsData = '';
    // console.log('window.name:',betString);
    if (betString.length > 0) {
      if (/^[\],:{}\s]*$/.test(betString.replace(/\\["\\\/bfnrtu]/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        betsData = JSON.parse(betString);
      } else {
        return;
      }
    }

    let ticketsData = [];
    if (betsData) {
      if (betsData.lotteryId === gameId && betsData.drawId === drawId) {
        this.setState({
          ticketsData: betsData.ticketsData
        });
      }
    }
  }


  _autoPickNumbers(e) {
    e.preventDefault();
    // reset the selected numbers
    this._removeSelected();

    let arr1 = [], arr2 = [];
    // const { gameId } = this.props.params;
    const { gameId } = this.state;

    let gameData = _.find(this.props.lotteryData, ['id', gameId]);
    let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

    /* for Set# 1 */
    while(arr1.length < this.state.lotteryInfo.set1PickLimit) {
      let randomnumber=Math.ceil(Math.random() * nums1);
      let found=false;
      for(let i=0; i<arr1.length; i++) {
        if(arr1[i]==randomnumber) { found=true; break; }
      }
      if(!found) { arr1.push(parseInt(randomnumber)); }
    }

    arr1.forEach((n) => {
      this.refs['numS1_'+n].classList.toggle('selected');
    });
    this.setState({selectedNumCtrS1: this.state.lotteryInfo.set1PickLimit, selectedNumsS1: arr1, set1PickCount: 0});
    // console.log('rand set1:',arr1);

    /* for Set# 2 */
    while(arr2.length < this.state.lotteryInfo.set2PickLimit){
      let randomnumber=Math.ceil(Math.random() * nums2);
      let found=false;
      for(let i=0;i<arr2.length;i++){
        if(arr2[i]==randomnumber){ found=true; break; }
      }
      if(!found) { arr2.push(parseInt(randomnumber)); }
    }

    arr2.forEach((n) => {
      if (gameId === 'megaMillions') {
        this.refs.megaMillionsSet2.value = n;
      } else if (gameId === 'powerBall') {
        this.refs.powerBallSet2.value = n;
      } else if (gameId !== 'powerBall' && gameId !== 'markSix' && gameId !== 'megaMillions') {
        this.refs['numS2_'+n].classList.toggle('selected');
      }
    });

    this.setState({selectedNumCtrS2: this.state.lotteryInfo.set2PickLimit, selectedNumsS2: arr2, set2PickCount: 0});
    // console.log('rand set2:',arr2);
  }

  _removeSelected() {
    const { gameId, isComboBetSelected } = this.state;
    let gameData = _.find(this.props.lotteryData, ['id', gameId]);
    let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

    // Set 1
    for (let i=0; i < nums1; i++) {
      let k = i+1;
      this.refs['numS1_'+k].classList.remove('selected');
      if (isComboBetSelected) {
        this.refs['numS1_'+k].classList.remove('selected-combo');
      }
    }
    this.setState({ selectedNumCtrS1: 0, selectedNumsS1: [], set1PickCount: this.state.lotteryInfo.set1PickLimit });

    // Set 2
    if (gameId !== 'powerBall' && gameId !== 'markSix' && gameId !== 'megaMillions') {
      for (let i=0; i < nums2; i++) {
        let k = i+1;
        this.refs['numS2_'+k].classList.remove('selected');
        if (isComboBetSelected) {
          this.refs['numS2_'+k].classList.remove('selected-combo');
        }
      }
      this.setState({selectedNumCtrS2: 0, selectedNumsS2: [], set2PickCount: this.state.lotteryInfo.set2PickLimit});
    }

    if (isComboBetSelected) {
      this.setState({ isComboBetSelected: false });
    }
  }

  _disableExtraNums(isComboBetEnabled) {

    const { gameId, isComboBetSelected, hasSet1ComboBetReachedLimit } = this.state;
    let gameData = _.find(this.props.lotteryData, ['id', gameId]);
    let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

    // Set 1
    for (let i=0; i < nums1; i++) {
      let k = i+1;
      if (isComboBetEnabled) {
        if (isComboBetSelected) {
          // console.log("hasSet1ComboBetReachedLimit",hasSet1ComboBetReachedLimit);
          if (hasSet1ComboBetReachedLimit) {
            if ($(this.refs['numS1_'+k]).hasClass('selected') && !$(this.refs['numS1_'+k]).hasClass('selected-combo')) {
              $(this.refs['numS1_'+k]).removeClass("disabled");
              $(this.refs['numS1_'+k]).addClass("selected");
            } else if (!$(this.refs['numS1_'+k]).hasClass('selected') && $(this.refs['numS1_'+k]).hasClass('selected-combo')) {
              // $(this.refs['numS1_'+k]).removeClass("disabled selected-combo");
              // $(this.refs['numS1_'+k]).addClass("selected");
              $(this.refs['numS1_'+k]).removeClass("disabled");
              $(this.refs['numS1_'+k]).addClass("selected-combo");
            } else {
              $(this.refs['numS1_'+k]).addClass("disabled");
            }
          } else {
            $(this.refs['numS1_'+k]).removeClass("disabled");
            if ($(this.refs['numS1_'+k]).hasClass('selected')) {
              $(this.refs['numS1_'+k]).removeClass("selected");
              $(this.refs['numS1_'+k]).addClass("selected-combo");
            }
          }
        } else {
          if ($(this.refs['numS1_'+k]).hasClass('selected') && !$(this.refs['numS1_'+k]).hasClass('selected-combo')) {
            $(this.refs['numS1_'+k]).removeClass("disabled");
            $(this.refs['numS1_'+k]).addClass("selected");
          } else if (!$(this.refs['numS1_'+k]).hasClass('selected') && $(this.refs['numS1_'+k]).hasClass('selected-combo')) {
            $(this.refs['numS1_'+k]).removeClass("disabled selected-combo");
            $(this.refs['numS1_'+k]).addClass("selected");
          } else {
            $(this.refs['numS1_'+k]).addClass("disabled");
          }
        }
      } else {
        $(this.refs['numS1_'+k]).removeClass("disabled");
      }
    }

    // Set 2
    if (gameId !== 'powerBall' && gameId !== 'markSix' && gameId !== 'megaMillions') {
      for (let i=0; i < nums2; i++) {
        let k = i+1;
        if (isComboBetEnabled) {
          if (isComboBetSelected) {
            $(this.refs['numS2_'+k]).removeClass("disabled");
            if ($(this.refs['numS2_'+k]).hasClass('selected')) {
              $(this.refs['numS2_'+k]).removeClass("selected");
              $(this.refs['numS2_'+k]).addClass("selected-combo");
            }
          } else {
            if ($(this.refs['numS2_'+k]).hasClass('selected') && !$(this.refs['numS2_'+k]).hasClass('selected-combo')) {
              $(this.refs['numS2_'+k]).removeClass("disabled");
              $(this.refs['numS2_'+k]).addClass("selected");
            } else if (!$(this.refs['numS2_'+k]).hasClass('selected') && $(this.refs['numS2_'+k]).hasClass('selected-combo')) {
              $(this.refs['numS2_'+k]).removeClass("disabled selected-combo");
              $(this.refs['numS2_'+k]).addClass("selected");
            } else {
              $(this.refs['numS2_'+k]).addClass("disabled");
            }
          }
        } else {
          $(this.refs['numS2_'+k]).removeClass("disabled");
        }
      }
    }
  }

  _toggleComboBet(e) {
    e.preventDefault();

    const { gameId, isComboBetSelected, lotteryInfo, selectedNumsS1, selectedNumsS2 } = this.state;
    let comboBetSelected = !isComboBetSelected;

    this.setState({ isComboBetSelected: comboBetSelected });

    if (!comboBetSelected) {
      let gameData = _.find(this.props.lotteryData, ['id', gameId]);
      let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

      if (selectedNumsS1.length > lotteryInfo.set1PickLimit) {
        selectedNumsS1.splice(lotteryInfo.set1PickLimit, selectedNumsS1.length - lotteryInfo.set1PickLimit);

        // Set 1
        for (let i=0; i < nums1; i++) {
          let k = i+1;
          let selectednum = selectedNumsS1.indexOf(k);
          if (selectednum > -1){
            if ($(this.refs['numS1_'+k]).hasClass('selected') && !$(this.refs['numS1_'+k]).hasClass('selected-combo')) {
              $(this.refs['numS1_'+k]).removeClass("disabled");
              $(this.refs['numS1_'+k]).addClass("selected");
            } else if (!$(this.refs['numS1_'+k]).hasClass('selected') && $(this.refs['numS1_'+k]).hasClass('selected-combo')) {
              $(this.refs['numS1_'+k]).removeClass("disabled selected-combo");
              $(this.refs['numS1_'+k]).addClass("selected");
            } else {
              $(this.refs['numS1_'+k]).addClass("disabled");
            }
          } else {
            $(this.refs['numS1_'+k]).removeClass("selected-combo selected");
            $(this.refs['numS1_'+k]).addClass("disabled");
          }
        }

        this.setState({selectedNumCtrS1: lotteryInfo.set1PickLimit, selectedNumsS1: selectedNumsS1});
      }

      if (selectedNumsS2.length > lotteryInfo.set2PickLimit) {
        selectedNumsS2.splice(lotteryInfo.set2PickLimit, selectedNumsS2.length - lotteryInfo.set2PickLimit);

        // Set 2
        if (gameId !== 'powerBall' && gameId !== 'markSix' && gameId !== 'megaMillions') {
          for (let i=0; i < nums2; i++) {
            let k = i+1;
            let selectednum = selectedNumsS2.indexOf(k);
            if (selectednum > -1){
              if ($(this.refs['numS2_'+k]).hasClass('selected') && !$(this.refs['numS2_'+k]).hasClass('selected-combo')) {
                $(this.refs['numS2_'+k]).removeClass("disabled");
                $(this.refs['numS2_'+k]).addClass("selected");
              } else if (!$(this.refs['numS2_'+k]).hasClass('selected') && $(this.refs['numS2_'+k]).hasClass('selected-combo')) {
                $(this.refs['numS2_'+k]).removeClass("disabled selected-combo");
                $(this.refs['numS2_'+k]).addClass("selected");
              } else {
                $(this.refs['numS2_'+k]).addClass("disabled");
              }
            } else {
              $(this.refs['numS2_'+k]).removeClass("selected-combo selected");
              $(this.refs['numS2_'+k]).addClass("disabled");
            }
          }
        }
        this.setState({selectedNumCtrS1: lotteryInfo.set1PickLimit, selectedNumsS1: selectedNumsS1});
      }
    }

  }


  render() {
    let tab1, tab2;
    if (this.state.activeTab === '#tab1'){
      tab1 = 'active';
      tab2 = '';
    } else {
      tab1 = '';
      tab2 = 'active';
    }

    const { gameId } = this.state;
    let gameIcon, gameTitle, set2ClassName;
    switch (gameId) {
      case "euroJackpot":
        gameIcon = "/images/lotto_eurojackpot.png";
        gameTitle = "/images/lfg_eurojackpot-icon.png";
        set2ClassName = "bet-slip-num";
        break;
      case "euroMillions":
        gameIcon = "/images/lotto_euromillions.png";
        gameTitle = "/images/lfg_euromillions-icon.png";
        set2ClassName = "num-star icon";
        break;
      case "powerBall":
        gameIcon = "/images/lotto_powerball.png";
        gameTitle = "/images/lfg_powerball-icon.png";
        set2ClassName = "";
        break;
      case "markSix":
        gameIcon = "/images/lotto_hkmark6.png";
        gameTitle = "/images/lfg_hk6-icon.png";
        set2ClassName = "";
        break;
      case "megaMillions":
        gameIcon = "/images/lotto_megamillions.png";
        gameTitle = "/images/lfg_megamillions-icon.png";
        set2ClassName = "";
        break;
      case "polishMiniLotto":
        gameIcon = "/images/lotto_polishminilotto.png";
        gameTitle = "/images/lfg_polishmini-icon.png";
        set2ClassName = "";
        break;
      default:
        gameIcon = "/images/lotto_eurojackpot.png";
        gameTitle = "/images/lfg_eurojackpot-icon.png";
        set2ClassName = "bet-slip-num";
    }

    let gameData = _.find(this.props.lotteryData, ['id', gameId]);
    let nums1 = gameData.set1nums, nums2 = gameData.set2nums;

    // for set 1
    let rows = [];
    for (let i=0; i < nums1; i++) {
      let k = i+1;
      rows.push(<div key={k}><span key={k} ref={"numS1_"+k} className="bet-slip-num" onClick={this._selectNumber.bind(this, "set1:"+k, "numS1_"+k)}><a href="javascript:void(0);">{k}</a></span></div>);
    }
    // for set 2
    let rows2 = [];
    let selectList = [];
    for (let i=0; i < nums2; i++) {
      selectList.push(<option key={i+1} value={i+1}>{i+1}</option>);
    }

    if (gameId === "powerBall") {
      let pbSet2 = (
        <div key="0" className="powerball-s2">
          <span className="labelForSelect">强力球:</span>
          <div className="select-wrapper small">
            <select name="powerBallSet2" id="powerBallSet2" ref="powerBallSet2" onChange={this._selectNumber.bind(this, "set2:"+0, "powerBallSet2")}>
              {selectList}
            </select>
          </div>
        </div>
      );
      rows2.push(pbSet2);
    } else if (gameId === "megaMillions") {
      let mmSet2 = (
        <div key="0" className="megaMillions-s2">
          <span className="labelForSelect">超级号:</span>
          <div className="select-wrapper small">
            <select name="megaMillionsSet2" id="megaMillionsSet2" ref="megaMillionsSet2" onChange={this._selectNumber.bind(this, "set2:"+0, "megaMillionsSet2")}>
              {selectList}
            </select>
          </div>
        </div>
      );
      rows2.push(mmSet2);
    } else {
      for (let i=0; i < nums2; i++) {
        let k = i+1;
        rows2.push(<div key={k}><span key={k} ref={"numS2_"+k} className={set2ClassName} onClick={this._selectNumber.bind(this, "set2:"+k, "numS2_"+k)}><a href="javascript:void(0);">{i+1}</a></span></div>);
      }
    }

    const brkPt = _getBreakpoint(this.state.windowWidth);
    let html;
    if (brkPt === 'XS' || brkPt === 'S') {
      html = this._drawHTMLforMobile(rows, rows2, gameId);
    // } else if (brkPt === 'M' || brkPt === 'L' || brkPt === 'XL') {
    } else {
      html = this._drawHTMLforDesktop(rows, rows2, gameId);
      // html = '';
    }

    const { strings: lfg, localeData } = this.props;
    const { currency, paymentDetail } = this.props;
    const { currentDrawInfo } = this.state;
    let closingDate = moment(this.state.currentDrawInfo.closingDate).tz('Asia/Shanghai').format();

    return (
      <div className="lfg-wrapper">
        <div id="lfg-overlay"><FerrisWheelPreloader/></div>
        <section className={`lfg ${gameId}`}>
          <div className="header">
            <div className="img-container">
              <img src={gameIcon} />
            </div>
            <div className="img-container">
              <img src={gameTitle} />
            </div>
            <div className="heading-prize">
              <h3>{localeData['headingPrize.jackpotLabel']}<br />{(this.props.language.current === 'en-us') && lfg.common.currency}</h3>
              <h1>{abbreviateNumber((currentDrawInfo.jackpotAmt / 100), 'zh-CN')}</h1>
            </div>
            <div className="timer">
              <h4>{localeData['timer.drawCountdown']}</h4>
              <ClockTimer endDate={new Date(closingDate)} localeData={localeData}/>
            </div>
          </div>
          {html}
        </section>

        <section id="tab-section" className="lfg">
          <div className="tabs">
            <ul className="tab-links">
              <li className={tab1}><a href="#tab1" onClick={this._handleTabClick.bind(this)}>{localeData['howToPlay.title']}</a></li>
              <li className={tab2}><a href="#tab2" onClick={this._handleTabClick.bind(this)}>{localeData['drawHistory.title']}</a></li>
            </ul>
            <div className="tab-content">
              <div id="tab1" className={`tab ${tab1}`}>
                <div className="how-to-play">
                  <HowToPlayLFG gameId={this.state.gameId} {...this.props} localeData={localeData}/>
                </div>
              </div>

              <div id="tab2" className={`tab ${tab2}`}>
                <div className="recent-history">
                  <RecentHistory gameId={this.state.gameId} localeData={localeData}/>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    );
  }
}

LFG.propTypes = {
  strings: React.PropTypes.object,
  keycloak: React.PropTypes.object,
  translations: React.PropTypes.object,
  localeData : React.PropTypes.object,
};

// LFG.defaultProps = {
//   strings: {
//     someTranslatedText: 'Hello World'
//   }
// };

const mapStateToProps = (state) => {
  return {
    // lfg: state.lfg,
    currency: state.currency,
    lotteryData: state.lotteryData
  };
};

// export default translate('LFG')(connect(mapStateToProps)(LFG));
export default connect(mapStateToProps)(LFG);

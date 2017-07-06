export default {
  offCanvasNav: {
    toggleLeftNavVisible: false,
    toggleRightNavVisible: false
  },
  links: [
    { id: 1, key: 'LFG', text: '世界乐透', url: '/lfg-listing' }, // lottery / LFG
    { id: 2, key: 'HFG', text: '乐透方程式', url: '/hfg' }, // lottery / HFG
    { id: 3, key: 'RNG', text: '欢乐时时乐', url: '/rng' }, // lottery / RNG
    // { id: 2, key: 'RNG', text: '时时彩', url: '#', hasSubMenu: true,
    //   subMenu: [
    //     { id: 2.1, key: 'RNG', text: 'RNG', url: '/rng' },
    //     { id: 2.2, key: 'HFG', text: 'HFG', url: '/hfg' }
    //   ]
    // }, // 时时彩
    // { id: 4, key: 'CASINO', text: '游乐场', url: '/casino-lobby' }, // casino / games
    // { id: 6, key: 'WINNERSTORIES', text: '贏家故事', url: '#' } // casino / games
    // { id: 6, key: 'RESULTS', text: '开奖结果', url: '/lotto-results' } // lotto-results
    // { id: 6, key: 'LOGIN', text: '登入 / 注册', url: '/', special: true, color: 'green', isLoggedIn: false } // Login / Register
    //{ id: 5, key: 'PROMOTIONS', text: '优惠活动', url: '/promotions' }, // Scratchcards
    { id: 6, key: 'FAQ', text: '常问问题', url: '/faq' } // casino / games
  ],
  user: {
    info: {},
    isLoggedIn: false
  },
  wallet: {},
  language: {
    current: '58a82d87a5527676b47c8742'
  },
  loyalty: {},
  currency: [
    {
      name: "Yuan",
      abbr: "CNY",
      htmlcode: "&#20803;",
      unicode: "\u00A5"
    },
    {
      name: "US Dollar",
      abbr: "USD",
      htmlcode: "&#36;",
      unicode: "\u0024"
    }
  ],
  paymentDetail: [
    {
      id: 1,
      name: "中国银联",
            iconType: "UNIONPAY",
            isEnabled: 1
    },
    {
      id: 2,
      name: "微信支付",
            iconType: "WECHATPAY",
            isEnabled: 0
    },
    {
      id: 3,
      name: "Paypal",
            iconType: "PAYPAL",
            isEnabled: 1
    }
  ],
  casinoGames: {},
  casinoGamesFeatured: {},
  casinoAccount: {},
  casinoPlay: {},
  ajaxStatus: {},
  bank: {},
  lotteryData: [
    {
      id: 'euroJackpot',
      name: '欧洲超级乐透', //'Euro Jackpot',
      desc: '',
      src: '/images/lotto_eurojackpot.png',
      lfg_url: '/lfg/eurojackpot',
      in_play: true,
      imgIcon: '/images/lfg_eurojackpot-icon.png',
      set1nums: 50,
      set2nums: 10,
      defaultNextDraws: 1,
      prizeTier: [
        {
          rank: 1,
          tierText: '5个号码＋2个特别号码'
        },
        {
          rank: 2,
          tierText: '5个号码＋1个特别号码'
        },
        {
          rank: 3,
          tierText: '5个号码'
        },
        {
          rank: 4,
          tierText: '4个号码＋2个特别号码'
        },
        {
          rank: 5,
          tierText: '4个号码＋1个特别号码'
        },
        {
          rank: 6,
          tierText: '4个号码'
        },
        {
          rank: 7,
          tierText: '3个号码＋2个特别号码'
        },
        {
          rank: 8,
          tierText: '2个号码＋2个特别号码'
        },
        {
          rank: 9,
          tierText: '3个号码＋1个特别号码'
        },
        {
          rank: 10,
          tierText: '3个号码'
        },
        {
          rank: 11,
          tierText: '1个号码＋2个特别号码'
        },
        {
          rank: 12,
          tierText: '2个号码＋1个特别号码'
        }
      ],
      htp: {
        pod1: '欧洲最新的在多国同时出售的大型乐透，是您赢取巨额奖金的又一绝佳机会，而每注仅需15元。',
        pod2: '投注规则：5+2(前区1-50个号码选5 ＋ 后区1-10个特别号码选2 )<br/>1.  您可以自行选择号码，或者使用“随机选号”功能；<br/>2.  选好号码后，请点击页面中间的“确认选号”。然后，您可以继续投下一注；<br/>3.  或者在选完所有号码后点击右下角的“结账”。<br/>',
        pod3: '欧洲超级乐透开奖时间在北京时间每周六凌晨，因此请您确保您在投注截止时间（北京时间02:00）前完成投注。',
        pod4: '欧洲超级乐透的开奖在欧洲时间周五，在芬兰赫尔辛基举行。开奖后，我们将把中奖号码和12等级的奖金公布在网站上。二等奖的奖金平均在15万欧元左右（约110万元）。'
      }
    },
    {
      id: 'euroMillions',
      name: '欧洲百万乐透', //'Euro Millions',
      desc: '',
      src: '/images/lotto_euromillions.png',
      lfg_url: '/lfg/euromillions',
      in_play: true,
      imgIcon: '/images/lfg_euromillions-icon.png',
      set1nums: 50,
      set2nums: 12,
      defaultNextDraws: 2,
      prizeTier: [
        {
          rank: 1,
          tierText: '5个号码 + 2颗星号'
        },
        {
          rank: 2,
          tierText: '5个号码 + 1颗星号'
        },
        {
          rank: 3,
          tierText: '5个号码 + 0颗星号'
        },
        {
          rank: 4,
          tierText: '4个号码 + 2颗星号'
        },
        {
          rank: 5,
          tierText: '4个号码 + 1颗星号'
        },
        {
          rank: 6,
          tierText: '3个号码 + 2颗星号'
        },
        {
          rank: 7,
          tierText: '4个号码 + 0颗星号'
        },
        {
          rank: 8,
          tierText: '2个号码 + 2颗星号'
        },
        {
          rank: 9,
          tierText: '3个号码 + 1颗星号'
        },
        {
          rank: 10,
          tierText: '3个号码 + 0颗星号'
        },
        {
          rank: 11,
          tierText: '1个号码 + 2颗星号'
        },
        {
          rank: 12,
          tierText: '2个号码 + 1颗星号'
        },
        {
          rank: 13,
          tierText: '2个号码 + 0颗星号'
        }
      ],
      htp: {
        pod1: '每注只需18 元，您即有机会获得每期头奖高达1.9亿欧元（约13.9亿元）的欧洲百万乐透开奖。',
        pod2: '投注规则：5+2 （前区1-50个号码选5 ＋ 后区1-12个特别号码选2 ）<br/>1.  您可以自行选择号码，或者使用“随机选号”功能；<br/>2.  选好号码后，请点击页面中间的“确认选号”。然后，您可以继续投下一注；<br/>3.  或者在选完所有号码后点击右下角的“结账”。<br/>',
        pod3: '欧洲百万乐透的投注截止时间是每周三和周六北京时间凌晨03:30，因此不要错过赢取巨额奖金的机会！',
        pod4: '开奖时间透的投注截止时间是每周三和周六北京时间凌晨04:30。我们将在开奖后在我们网站上公布左右13个等级的奖金。在这里您可以随时查看您是否赢得了大奖'
      }
    },
    {
      id: 'markSix',
      name: '香港六合彩', // 'HK Mark Six',
      desc: '',
      src: '/images/lotto_hkmark6.png',
      lfg_url: '/lfg/marksix',
      in_play: true,
      imgIcon: '/images/lfg_hk6-icon.png',
      set1nums: 49,
      set2nums: 0,
      defaultNextDraws: 3,
      prizeTier: [
        {
          rank: 1,
          tierText: '匹配 6'
        },
        {
          rank: 2,
          tierText: '匹配 5+1'
        },
        {
          rank: 3,
          tierText: '匹配 5'
        },
        {
          rank: 4,
          tierText: '匹配 4+1'
        },
        {
          rank: 5,
          tierText: '匹配 4'
        },
        {
          rank: 6,
          tierText: '匹配 3+1'
        },
        {
          rank: 7,
          tierText: '匹配 3'
        }
      ],
      htp: {
        pod1: '现在就把握机会投注香港六合彩，头奖最低有800万港元（约700万元）。',
        pod2: '香港六合彩每注10元，在1-49中选6个号码作为一注。、<br/>1.  您可以自行选择号码，或者使用“随机选号”功能；<br/>2.  选好号码后，请点击页面中间的“确认选号”。然后，您可以继续投下一注；<br/>3.  或者在选完所有号码后点击右下角的“结账”。<br/>',
        pod3: '每周3次机会赢得六合彩！香港六合彩开奖时间在每周二，周四和周六北京时间20:30。<br/>请注意，如果周六晚上香港进行赛马，开奖将顺延到周日才开奖。',
        pod4: '六合彩有7个奖金等级，历史最高累积彩池纪录是在2016年5月的1.17亿港元（约1.03亿元），共两注中，每注分得8500万元港元（约7500万元）。'
      }
    },
    {
      id: 'megaMillions',
      name: '美国超级乐透', //'Mega Millions',
      desc: '',
      src: '/images/lotto_megamillions.png',
      lfg_url: '/lfg/megamillions',
      in_play: true,
      imgIcon: '/images/lfg_megamillions-icon.png',
      set1nums: 75,
      set2nums: 15,
      defaultNextDraws: 2,
      prizeTier: [
        {
          rank: 1,
          tierText: '5个号码＋1个超级号'
        },
        {
          rank: 2,
          tierText: '5个号码'
        },
        {
          rank: 3,
          tierText: '4个号码＋1个超级号'
        },
        {
          rank: 4,
          tierText: '4个号码'
        },
        {
          rank: 5,
          tierText: '3个号码＋1个超级号'
        },
        {
          rank: 6,
          tierText: '3个号码'
        },
        {
          rank: 7,
          tierText: '2个号码＋1个超级号'
        },
        {
          rank: 8,
          tierText: '1个号码＋1个超级号'
        },
        {
          rank: 9,
          tierText: '1个超级号'
        }
      ],
      htp: {
        pod1: '如果您的梦想是成为富翁，那么美国超级乐透是您不可错失的机会，每注只需要20元。',
        pod2: '投注规则：5+1（前区1-75个号码选5 ＋ 后区1-15个特别号码选1）<br/>1.  您可以自行选择号码，或者使用“随机选号”功能；<br/>2.  选好号码后，请点击页面中间的“确认选号”。然后，您可以继续投下一注；<br/>3.  或者在选完所有号码后点击右下角的“结账”。<br/>',
        pod3: '美国超级乐透的投注截止时间在每周三和周六北京时间11:00。该乐透历史最高彩池纪录是在2012年3月产生的6.56亿美元（约40亿元）。',
        pod4: '特色额外投注功能“超级倍增”，只需额外6元／注，让您的一等奖以下的奖金变成2倍，3倍，4倍，甚至5倍！“超级倍增”的倍数在官方开奖结束后抽出，您可以在我们网站上查看更多详细资料。'
      }
    },
    {
      id: 'powerBall',
      name: '美国强力球', //'Powerball',
      desc: '',
      src: '/images/lotto_powerball.png',
      lfg_url: '/lfg/powerball',
      in_play: true,
      imgIcon: '/images/lfg_powerball-icon.png',
      set1nums: 69,
      set2nums: 26,
      defaultNextDraws: 2,
      prizeTier: [
        {
          rank: 1,
          tierText: '5个号码 + 强力球号'
        },
        {
          rank: 2,
          tierText: '5个号码'
        },
        {
          rank: 3,
          tierText: '4个号码 + 强力球号'
        },
        {
          rank: 4,
          tierText: '4个号码'
        },
        {
          rank: 5,
          tierText: '3个号码 + 强力球号'
        },
        {
          rank: 6,
          tierText: '3个号码'
        },
        {
          rank: 7,
          tierText: '2个号码 + 强力球号'
        },
        {
          rank: 8,
          tierText: '1个号码 + 强力球号'
        },
        {
          rank: 9,
          tierText: '强力球号'
        }
      ],
      htp: {
        pod1: '全球史上最高乐透奖金16亿美元（约100亿元）就是在美国强力球产生的！而每注投入只需20 元。',
        pod2: '投注规则：5+1（前区1-69个号码选5 ＋ 后区1-26个特别号码选1 ）<br/>1.  您可以自行选择号码，或者使用“随机选号”功能；<br/>2.  选好号码后，请点击页面中间的“确认选号”。然后，您可以继续投下一注；<br/>3.  或者在选完所有号码后点击右下角的“结账”。<br/>',
        pod3: '美国强力球投注截止时间在每周四和周日北京时间11:00，请不要错过赢得巨额美金的机会！',
        pod4: '“强力倍增”是美国强力球的一大特色功能，只需额外6元／注，让您的一等奖以下的奖金变成2倍，3倍，4倍，甚至5倍！“强力倍增”的倍数在官方开奖结束后抽出，您可以随时在我们网站上查看更多的详细资料。'
      }
    },
    {
      id: 'polishMiniLotto',
      name: '波兰天天彩',
      desc: '',
      src: '/images/lotto_polishminilotto.png',
      lfg_url: '/lfg/polishMiniLotto',
      in_play: true,
      imgIcon: '/images/lfg_polishmini-icon.png',
      set1nums: 42,
      set2nums: 0,
      defaultNextDraws: 7,
      prizeTier: [
        {
          rank: 1,
          tierText: '5个号码'
        },
        {
          rank: 2,
          tierText: '4个号码'
        },
        {
          rank: 3,
          tierText: '3个号码'
        }
      ],
      htp: {
        pod1: '欧洲最新的在多国同时出售的大型乐透，是您赢取巨额奖金的又一绝佳机会，而每注仅需15元。',
        pod2: '投注规则：5+2(前区1-50个号码选5 ＋ 后区1-10个特别号码选2 )<br/>1.  您可以自行选择号码，或者使用“随机选号”功能；<br/>2.  选好号码后，请点击页面中间的“确认选号”。然后，您可以继续投下一注；<br/>3.  或者在选完所有号码后点击右下角的“结账”。<br/>',
        pod3: '欧洲超级乐透开奖时间在北京时间每周六凌晨，因此请您确保您在投注截止时间（北京时间02:00）前完成投注。',
        pod4: '欧洲超级乐透的开奖在欧洲时间周五，在芬兰赫尔辛基举行。开奖后，我们将把中奖号码和12等级的奖金公布在网站上。二等奖的奖金平均在15万欧元左右（约110万元）。'
      }
    },
    {
      id: 'cash4Life',
      name: '现金天天彩', //'Cash4Life',
      desc: '',
      src: '/images/lotto_cash4life.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 60,
      set2nums: 4
    },
    {
      id: 'ozLotto',
      name: '澳洲乐透', //'OZ Lotto',
      desc: '',
      src: '/images/lotto_ozlotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 45,
      set2nums: 0
    },
    {
      id: 'austrianLottery',
      name: '奥地利乐透', //'Austrian Lotto',
      desc: '',
      src: '/images/lotto_austrian-lottery.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 45,
      set2nums: 0
    },
    {
      id: 'elGordoPrimitiva',
      name: '西班牙大肥彩', //'El Gordo Primitiva Lotto',
      desc: '',
      src: '/images/lotto_elgordoprimitiva.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 0,
      set2nums: 0
    },
    {
      id: 'frenchLotto',
      name: '法国乐透', //'French Lotto',
      desc: '',
      src: '/images/lotto_frenchlotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 49,
      set2nums: 10
    },
    {
      id: 'german6Aus49',
      name: '德国乐透', //'German 6 Aus 49',
      desc: '',
      src: '/images/lotto_german6aus49.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 0,
      set2nums: 0
    },
    {
      id: 'germanKeno',
      name: '德国基诺', //'German Keno',
      desc: '',
      src: '/images/lotto_germankeno.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 70,
      set2nums: 0
    },
    {
      id: 'irishLotto',
      name: '爱尔兰乐透', //'Irish Lotto',
      desc: '',
      src: '/images/lotto_irishlotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 47,
      set2nums: 0
    },
    {
      id: 'keNow',
      name: '四分彩', //'KeNow',
      desc: '',
      src: '/images/lotto_kenow.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 70,
      set2nums: 0
    },
    {
      id: 'megaSena',
      name: '巴西乐透', //'MegaSena',
      desc: '',
      src: '/images/lotto_megasena.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 60,
      set2nums: 0
    },
    {
      id: 'monWedOz',
      name: '澳洲一三彩', //'Mon & Wed Oz Lotto',
      desc: '',
      src: '/images/lotto_monwedoz.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 45,
      set2nums: 0
    },
    {
      id: 'multiKeno',
      name: '波兰基诺', //'Multi Keno',
      desc: '',
      src: '/images/lotto_multimulti.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 80,
      set2nums: 0
    },
    {
      id: 'ozPowerball',
      name: '澳洲强力球', //'Oz Powerball',
      desc: '',
      src: '/images/lotto_ozpowerball.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 40,
      set2nums: 20
    },
    {
      id: 'polishLotto',
      name: '波兰乐透', //'Polish Lotto',
      desc: '',
      src: '/images/lotto_polishlotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 49,
      set2nums: 0
    },
    {
      id: 'saturdayOz',
      name: '澳洲周六乐透', //'Saturday Oz Lotto',
      desc: '',
      src: '/images/lotto_saturdayoz.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 45,
      set2nums: 0
    },
    {
      id: 'summerGordo',
      name: '西班牙圣诞乐透', //'El Gordo Lotto',
      desc: '',
      src: '/images/lotto_summergordo.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 0,
      set2nums: 0
    },
    {
      id: 'superEnaLotto',
      name: '意大利乐透', //'SuperEnaLotto',
      desc: '',
      src: '/images/lotto_superenalotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 90,
      set2nums: 0
    },
    {
      id: 'swedishLotto',
      name: '瑞典乐透', //'Swedish Lotto',
      desc: '',
      src: '/images/lotto_swedishlotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 35,
      set2nums: 0
    },
    {
      id: 'ukLotto',
      name: '英国乐透', //'UK Lotto',
      desc: '',
      src: '/images/lotto_uklotto.png',
      lfg_url: '/lfg-listing',
      in_play: false,
      imgIcon: '',
      set1nums: 0,
      set2nums: 0
    }
  ]
};

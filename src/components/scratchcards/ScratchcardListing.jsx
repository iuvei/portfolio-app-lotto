'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

// import scratchcard01 from '../../../public/images/scratchcard01.png';
// import scratchcard02 from '../../../public/images/scratchcard02.jpg';
// import scratchcard03 from '../../../public/images/scratchcard03.jpg';
// import scratchcard04 from '../../../public/images/scratchcard04.jpg';
// import scratchcard05 from '../../../public/images/scratchcard05.jpg';
// import scratchcard06 from '../../../public/images/scratchcard06.jpg';
// import scratchcard07 from '../../../public/images/scratchcard07.jpg';
// import scratchcard08 from '../../../public/images/scratchcard08.jpg';
// import scratchcard09 from '../../../public/images/scratchcard09.jpg';
// import scratchcard10 from '../../../public/images/scratchcard10.jpg';
// import scratchcard11 from '../../../public/images/scratchcard11.jpg';
// import scratchcard12 from '../../../public/images/scratchcard12.jpg';
// import scratchcard13 from '../../../public/images/scratchcard13.png';

const scratchcardImages = [
  {
    id: 'scratchcard01',
    name: 'EuroCup Scratch',
    desc: '',
    src: '/images/scratchcard01.png',
    sc_url: '/#'
  },
  {
    id: 'scratchcard02',
    name: 'Full Bloom',
    desc: '',
    src: '/images/scratchcard02.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard03',
    name: 'Super Shamrock',
    desc: '',
    src: '/images/scratchcard03.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard04',
    name: 'Ten Lucky Years',
    desc: '',
    src: '/images/scratchcard04.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard05',
    name: 'Football Champions Cup',
    desc: '',
    src: '/images/scratchcard05.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard06',
    name: 'Jimi Hendrix Online Shot',
    desc: '',
    src: '/images/scratchcard06.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard07',
    name: 'Raid the Piggy Bank',
    desc: '',
    src: '/images/scratchcard07.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard08',
    name: 'Instant Millionaire',
    desc: '',
    src: '/images/scratchcard08.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard09',
    name: 'Fruity Flurry',
    desc: '',
    src: '/images/scratchcard09.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard10',
    name: '777',
    desc: '',
    src: '/images/scratchcard10.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard11',
    name: '33 Chances',
    desc: '',
    src: '/images/scratchcard11.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard12',
    name: '100K Cash',
    desc: '',
    src: '/images/scratchcard12.jpg',
    sc_url: '/#'
  },
  {
    id: 'scratchcard13',
    name: 'Star Raiders',
    desc: '',
    src: '/images/scratchcard13.png',
    sc_url: '/#'
  },
];

export default class ScratchcardListing extends Component {
  constructor (props) {
    super(props);

    this.state = {
    };
  }

  render () {
    let images = scratchcardImages.map((obj, i) => {
      return (
        <div>
          <div key={i} className="gray-box">
            <div className="box-title">
              <h3 className="pull-left">獎項</h3>
              <h3 className="pull-right">試玩</h3>
            </div>
            <img src={obj.src} />
            <div className="box-content">
              <div className="sc-info">Scratch your way to $100k! There&#39;s $1.8 million available on this exciting scratchcard which features a massive top prize of $100,000. Match three number to win!</div>
              <Link to={obj.sc_url} className="button special small">開始玩 !</Link>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <header id="heading-title">
          <h1>刮刮乐 !</h1>
          <span className="box-subtitle">即刮即中 !</span>
        </header>

        <section id="scratchcard-listing">
          <div className="section">
            {images}
          </div>
        </section>
      </div>
    )
  }
}

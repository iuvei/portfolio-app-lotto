'use strict';

export function _getBreakpoint(width) {
  let bp = 'XL';
  if (width <= 480) {
    bp = 'XS';
  } else if (width <= 767) {
    bp = 'S';
  } else if (width <= 980) {
    bp = 'M';
  } else if (width <= 1280) {
    bp = 'L';
  } else { // > 1280
    bp = 'XL';
  }
  return bp;
}

export function requestFullScreen(element) {
  // Supports most browsers and their versions.
  let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    let wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

export function cancelFullScreen(el) {
  let requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;

  if (requestMethod) { // cancel full screen.
    requestMethod.call(el);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    let wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

export function toggleFull(el) {
  let isInFullScreen = (el.fullScreenElement && el.fullScreenElement !== null) ||  (el.mozFullScreen || el.webkitIsFullScreen);

  if (isInFullScreen) {
    cancelFullScreen(el);
  } else {
    requestFullScreen(el);
  }
  return false;
}

export function abbreviateNumber(value, lang) {
  let newValue = value;

  if (lang === 'zh-CN') {
    // 兆 means 1,000,000,000,000 or 10^12
    // 亿 means 100,000,000 or 10^8
    // 万 means 10,000 or 10^4
    // 千 means 1,000 or 10^3
    // 百 means 100 or 10^2
    // 十 means 10 or 10^1

    if (value >= 1) {
      let exp = Math.floor(Math.log10(value));
      let pow = 0, suffixNum = 0, shortValue = '';
      let suffixes = ["", "十", "百", "千", "万", "亿", "兆"];
      if (exp >= 12) {
        pow = 12;
        suffixNum = 6;
      } else if (exp >= 8 && exp < 12) {
        pow = 8;
        suffixNum = 5;
      } else if (exp >= 4 && exp < 8) {
        pow = 4;
        suffixNum = 4;
      } else if (exp < 4) {
        pow = exp;
        suffixNum = exp;
      }
      shortValue = (value / Math.pow(10, pow)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      newValue = shortValue + suffixes[suffixNum];
    }
  } else {
    if (value >= 1000) {
      let suffixes = [], divisor = 0, pow = 0;
      suffixes = ["", " K", " M", " B", " T"];
      divisor = 3;
      pow = 1000;

      const suffixNum = Math.floor( (""+Math.floor(value)).length/divisor );
      // console.log("suffixNum",suffixNum);
      let shortValue = '', shortNum = 0;
      for (let precision = 2; precision >= 2; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(pow,suffixNum) ) : value).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]); //.toPrecision(precision)
          // console.log("shortValue",(value / Math.pow(pow,suffixNum) ).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
          let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          // console.log("dotLessShortValue",dotLessShortValue);
          if (dotLessShortValue.length <= 2) { break; }
      }
      // if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
    }
  }

  return newValue;
}

export function getDayString(d, locale) {
  if (d !== ''){
    let str = '';

    if (locale === 'zh-cn') {
      switch (d) {
        case "SU":
          str = '星期日';
          break;
        case "MO":
          str = '星期一';
          break;
        case "TU":
          str = '星期二';
          break;
        case "WE":
          str = '星期三';
          break;
        case "TH":
          str = '星期四';
          break;
        case "FR":
          str = '星期五';
          break;
        case "SA":
          str = '星期六';
          break;
        case "ALL":
          str = '所有';
          break;
        case "ALLDAYS":
          str = '所有';
          break;
      }
    } else {
      switch (d) {
        case "SU":
          str = 'Sun';
          break;
        case "MO":
          str = 'Mon';
          break;
        case "TU":
          str = 'Tue';
          break;
        case "WE":
          str = 'Wed';
          break;
        case "TH":
          str = 'Thu';
          break;
        case "FR":
          str = 'Fri';
          break;
        case "SA":
          str = 'Sat';
          break;
        case "ALL":
          str = 'All';
          break;
        case "ALLDAYS":
          str = 'All';
          break;
      }
    }
    return str;
  }
}

function product_Range(a,b) {
  var prd = a,i = a;

  while (i++<b) {
    prd*=i;
  }
  return prd;
}
export function combinations(n, r) {
  if (n==r) {
    return 1;
  } else {
    r=(r < n-r) ? n-r : r;
    return product_Range(r+1, n)/product_Range(1,n-r);
  }
}

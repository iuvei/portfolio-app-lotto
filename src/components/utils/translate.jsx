'use strict';

import { default as React } from 'react';
// import enUS from '../../data/l10n/en-us';
// import zhCN from '../../data/l10n/zh-cn';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import * as localeAction from '../../actions/localeActions';

// const languages = {
//   'en-us': enUS,
//   'zh-cn': zhCN
// };

const defaultLocale = {  
   "Links":{  
   },
   "Home":{  
   },
   "LFG":{  
   },
   "HFG":{  
   },
   "RNG":{  
   },
   "CasinoGames":{  
   },
   "Promotion":{  
   },
   "MyAccount":{  
   },
   "AccountSettings":{  
   },
   "MyLottery":{  
   },
   "AboutUs":{  
   },
   "Footer":{  
   },
   "PaymentMethods":{  
   },
   "Banks":{  
   },
   "Lotteries":{  
   }
};

export default function translate(key) {
  return Component => {
    class TranslationComponent extends React.Component {
      constructor (props) {
        super(props);
      }
      componentWillMount(){
        // this.props.localeAction.loadLocale('zh-CN');
      }
      componentDidMount(){
      }
      render() {
        // console.log('type of currentLanguage',typeof this.context.currentLanguage);
        // console.log('current language: ', this.context.currentLanguage);
        var strings = (typeof this.props.translations[key] != 'undefined') ? this.props.translations[key] : defaultLocale//languages[this.context.currentLanguage][key];
        return (typeof this.props.translations[key] != 'undefined') ? <Component {...this.props} keycloak={this.props.keycloak} {...this.state} strings={strings} localeData={strings} translations={this.props.translations}/> : null;
      }
    }

    TranslationComponent.contextTypes = {
      currentLanguage: React.PropTypes.string
    };

    TranslationComponent.propTypes = {
      keycloak: React.PropTypes.object
    };

    const mapStateToProps = (state, ownProps) => {
      return {
        translations: state.locale,
      };
    };

    const mapDispatchToProps = (dispatch) => ({
       localeAction: bindActionCreators(localeAction, dispatch),
    });

    // return TranslationComponent;
    return connect(mapStateToProps, mapDispatchToProps)(TranslationComponent);
  };
}

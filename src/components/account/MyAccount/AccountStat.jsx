import React, {PropTypes} from 'react';
import { Line } from 'rc-progress';
import _ from 'lodash';

const AccountStat = ({wallet, casinoBalance, loyalty, localeData}) => {
  let cashWallet = _.find(wallet, {type: 'cash'}) || {};
  let loyaltyWallet = _.find(wallet, {type: 'loyalty'}) || {};

  let promotionReward = 0;
  let wageringRequirement = 0;
  let promotionAmount = 0;
  let percentage = 0;

  if(!_.isEmpty(loyalty)){
     promotionReward = loyalty.reward.amount;
     wageringRequirement = loyalty.release.pending_amount;

     promotionAmount = loyalty.release.amount - wageringRequirement;
     percentage = promotionAmount/loyalty.release.amount*100;
  }

  let proposedBonus = (
    <div id="proposed-bonus" className="gray-box">
      <div className="box-title">
        <h3>可提出獎金</h3>
      </div>
      <hr />
      <div className="box-content">
        <div className="align-center"><h2>{loyaltyWallet.balance ? loyaltyWallet.balance.toLocaleString() : 0}</h2></div>
      </div>
    </div>
  );

  let enrolledPromotion = (!_.isEmpty(loyalty)) ?
    <div id="enrolled-promotion" className="gray-box">
      <div className="box-title">
        <h3>可提出獎金</h3>
      </div>
      <hr />
      <div className="box-content">
        <Line percent={percentage} strokeWidth="5" strokeColor="#69a507" trailWidth="1" strokeLinecap="square"/>
        <div className="pull-left">奖励: ¥{promotionReward.toLocaleString()}</div>
        <div className="pull-right">投注要求: ¥{wageringRequirement.toLocaleString()}</div>
      </div>
    </div>
    : '';


  let availableBalance = (
    <div id="available-balance" className="gray-box">
      <div className="box-title">
        <h3>可用餘額</h3>
         {/*<button className="button special pull-right reload" onClick={refresh}><i className="fa fa-refresh" /></button>*/}
      </div>
      <hr />
      <div className="box-content">
        <div className="align-center"><h2>¥ {cashWallet.balance ? cashWallet.balance.toLocaleString() : 0}</h2></div>
      </div>
    </div>
  );

  return(
    <section id="account-stats">
      <div className="section">
        {proposedBonus}
        {enrolledPromotion}
        {availableBalance}
      </div>
    </section>
  )
};


export default AccountStat;

import React, {PropTypes} from 'react';
import Icons from '../../icons/Icons';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
// import 'moment/locale/zh-cn';

const converToChinese = (word) => {
  let translated;
    if (word == 'LFG')
      translated = "世界乐透";
    else if (word == 'HFG')
      translated = "乐透方程式";
    else if (word == 'RNG')
      translated = "欢乐时时乐";
    else
      translated = word;

    return translated;
}


const Transaction = ({transaction, page_num, onPageClick, localeData}) => {
  moment.locale('zh-cn');

  const trans = Object.keys(transaction).map((key => {
    return transaction[key];
  }))
  return(
    <section id="transactions-history">
      <div className="section group">
        <div id="games-played" className="gray-box">
          <div className="box-title">
            <h3>{localeData['transactions.boxTitle']}</h3>
            {/*<span className="pull-right"><a href="#"><Icons iconType="ARROW_UP" fill="#b5d264" className="icon svg-icon medium" /></a></span>*/}
          </div>
          <hr />
          <div className="box-content">
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>{localeData['transactions.col1.title']}</th>
                    <th>{localeData['transactions.col2.title']}</th>
                    <th>{localeData['transactions.col3.title']}</th>
                    <th>{localeData['transactions.col4.title']}</th>
                  </tr>
                </thead>
                <tbody>
                  {trans.map(tx =>
                    <tr key={tx._id}>
                      {/*<td>{moment(tx.date).locale('zh_cn').format('YYYY/MM/DD HH:mm')}</td>*/}
                      {<td>{moment(tx.date).format('LLL')}</td>}
                      <td>{tx.product ? converToChinese(tx.product.name) : ''}</td>
                      <td className="text-capitalize">{((tx.type == "credit") ? localeData['transactions.type2'] : (tx.type == "debit") ? localeData['transactions.type1'] : (tx.type == "deposit") ? localeData['transactions.type5']  : (tx.type == "withdraw") ? localeData['transactions.type4']  : tx.type)}</td>
                      <td>¥ {tx.amount.toFixed(2)}</td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            <ReactPaginate previousLabel={"\u276E"}
                           nextLabel={"\u276F"}
                           breakLabel={<a href="">...</a>}
                           breakClassName={"break-me"}
                           pageNum={page_num}
                           marginPagesDisplayed={5}
                           pageRangeDisplayed={5}
                           clickCallback={onPageClick}
                           containerClassName={"pagination"}
                           subContainerClassName={"pages pagination"}
                           activeClassName={"pageActive"} />

          </div>
        </div>
      </div>
    </section>
  )
};

export default Transaction;

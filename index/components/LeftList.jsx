import React from 'react';
import ReactDOM from 'react-dom';
import Loader from 'react-loader-spinner'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import GetSalesInvoiceDetails from './GetSalesInvoiceDetails.jsx';

const GET_SALES_INVOICES = gql`
 {
    sage {
      emSales {
        salesInvoice(first: 40, orderBy: "{numberOfLines:-1, invoiceDate:-1}",
                     filter:"{salesSite:{code:{$regex : 'P'}}}") {
          edges {
            node {
              id
              salesSite{
                code
              }
              invoiceDate
            }
          }
        }
      }
    }
  }
`;



export default class LeftList extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <div className="LeftList">
        <Query query={GET_SALES_INVOICES} >
          {({ data: { sage }, loading }) => {
            if (loading || !sage) {
              return(
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '40vh'}}>
            	  <Loader
            	     type="ThreeDots"
            	     color="#3b424f"
            	     height="80"
            	     width="80"
            	  />
              </div>
            	);
            }

            return (
               <SalesInvoice salesInvoice={sage.emSales.salesInvoice} />
            );
         }
        }
        </Query>
      </div>
    );
  }
}

// Redux Connected Component
class SalesInvoiceList extends React.Component {
constructor (props) {
    super(props);
}
render() {
  return (
    <table className="s-grid-table-body" cellSpacing="0" cellPadding="0">
      <tbody>
      {this.props.salesInvoice.edges.map(({ node }, lineNumber) => {
        const isSelected = this.props.selectedSalesInvoiceIds.includes(node.id);

        const rowClassName = ['s-grid-row s-grid-navig-row s-record-selector-row'];

        if (isSelected) {
          rowClassName.push('s-record-selected');
        }
        if (!isSelected && lineNumber % 2) {
          rowClassName.push('s-record-alt');
        }
        return (
          <React.Fragment key={node.id}>
              <Select_Tr_Container className={rowClassName.join(' ')} node={node} key={node.id}
                isSelected={isSelected} id={node.id}>
              </Select_Tr_Container>
              {isSelected ? <GetSalesInvoiceDetails node_id = {node.id}/>: null }
          </React.Fragment>

        );
      })}
    </tbody>
   </table>
);
}
}

const mapStateToProps = state => ({
  selectedSalesInvoiceIds: state.selectedSalesInvoiceIds,
});

const SalesInvoice = connect(mapStateToProps)(SalesInvoiceList);

// Redux Connected Component

const Select_Tr = ({ isSelected, toggleSelectSalesInvoice, node, className }) => (
  <tr onClick={toggleSelectSalesInvoice} className = {className}>
    <td
      className="s-grid-cell s-grid-navig-cell s-filter-criteria-col s-inplace"
      style={{ width: '181px' }}
    >
      <div className="s-inplace-value-read">
        {node.id}
      </div>
    </td>
    <td
      className="s-grid-cell s-grid-navig-cell s-filter-criteria-col s-inplace"
      style={{ width: '106px' }}
    >
      <div className="s-inplace-value-read">
        {node.salesSite.code}
      </div>
    </td>
    <td
      className="s-grid-cell s-grid-navig-cell s-filter-criteria-col s-filter-criteria-col-with-btn s-inplace"
      style={{ width: '94px' }}
    >
      <div className="s-inplace-value-read s-date">
        {node.invoiceDate}
      </div>
    </td>
  </tr>
);

const mapDispatchToProps = (dispatch, { id, isSelected }) => ({
  toggleSelectSalesInvoice: () =>
    dispatch({
      type: 'TOGGLE_SELECT_SALES_INVOICE',
      id,
      isSelected,
    }),
});

const Select_Tr_Container = connect(null, mapDispatchToProps)(Select_Tr);

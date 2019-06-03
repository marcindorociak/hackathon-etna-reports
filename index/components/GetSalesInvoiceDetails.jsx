import React from 'react';
import ReactDOM from 'react-dom';
import Loader from 'react-loader-spinner'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';

const GET_SALES_INVOICE_DETAILS = gql`
  query InvoiceDetails($id: String!) {
    sage {
      emSales {
        salesInvoice{
          node(id: $id) {
            id
            company {
              code
            }
            currency {
              code
            }
            salesSite{
              description
              code
              addresses{
                edges{
                  node {
                    address
                    addressLine1
                    addressLine2
                    addressLine3
                    zipCode {
                      postal
                    }
                    city
                    country{
                      country
                    }


                  }
                }
              }
            }
            billToCustomer{
              companyName
              shortCompanyName
              defaultAddress{
                address
                description
                addressLine1
                addressLine2
                addressLine3
                city
                countryName

              }
            }
            europeanUnionVatNumber
            deliveryPostalCode{
              postal
            }
            factor{
              factor
            }
            invoiceDate
            currency{
              code
            }
            numberOfLines
            numberOfInvoiceCopies
            priceStructure
            lines{
              edges{
                node{
                  lineNumber
                  product{
                    code
                    description1
                  }
                  grossPrice
                  netPrice
                  invoicedQuantityInSalesUnit
                  sageSalesTax{
                    glossaryId
                  }
                  stockUnit{
                    unit
                  }
                  costPrice
                  taxExcludedLineAmount
                  taxRate
                  taxAmounts
                  taxBasisAmounts

                }
              }


            }

          }
        }
      }
    }
   }
`;
  //   document.getElementById('invoiceNrInput').setAttribute("value", node.id);
export default class GetSalesInvoiceDetails extends React.Component {
  constructor (props) {
    super(props);
    this.node_id = this.props.node_id;
  }

  fillFields(node) {
    document.getElementById('invoiceNrInput').setAttribute("value", node.id);
    document.getElementById('salesSite').setAttribute("value", node.salesSite.code);
    document.getElementById('invoiceDate').setAttribute("value", node.invoiceDate);
    document.getElementById('billToCustomer').setAttribute("value", node.billToCustomer.companyName);
    document.getElementById('currencyField').setAttribute("value", node.currency.code);
    document.getElementById('siteTitle').innerHTML = node.salesSite.description;
  }
  render () {
    const id = this.node_id;
    return (
        <Query query={GET_SALES_INVOICE_DETAILS} variables={{ id }}>
          {({ data: { sage }, loading }) => {
            if (loading || !sage) {
              return(
                <tr style={{position:'fixed', left:'50%', top:'50%', zIndex:99999}}>
                <td>
                <Loader
            	     type="ThreeDots"
            	     color="#3366a0"
            	     height="80"
            	     width="80"
            	  />
                </td>
              </tr>
            	);
            }
            let node = sage.emSales.salesInvoice.node;
            this.fillFields(node);
            return (<FillDetailsContainer node = {node}/>);
         }
        }
        </Query>
    );
  }
}
class FillDetails extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    this.props.toggleGetSalesDetails();
    return null;
  }
}
const mapDispatchToProps = (dispatch, { node }) => ({
  toggleGetSalesDetails: () =>
    dispatch({
      type: 'TOGGLE_GET_SALES_DETAILS',
      node,
    }),
});

const FillDetailsContainer = connect(null, mapDispatchToProps)(FillDetails);

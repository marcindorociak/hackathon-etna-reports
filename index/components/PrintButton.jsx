import React from 'react';
import { connect } from 'react-redux';
import Helpers from './Helpers.jsx';
import Loader from 'react-loader-spinner'

class PrintButt extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false, // to keep track of when form submitted
    };
  }

  /**
     * render
     * @returns {XML}
     */
  handleClick() {
    const node = this.props.selectedSalesInvoiceDetails;
    if (!(Object.entries(node).length === 0 && node.constructor === Object)) {

      this.setState({
        loading: true,
      }, () => {
        Helpers.httpRequest(
          'http://localhost:3000/api/generate-pdf',
          'post',
           [node],
        )
        // 1. Convert the data into 'blob'
        .then((response) => response.blob())
        .then((blob) => {

          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${node.id}.pdf`);

          // 3. Append to html page
          document.body.appendChild(link);

          // 4. Force download
          link.click();

          // 5. Clean up and remove the link
          link.parentNode.removeChild(link);

          this.setState({
            loading: false
          });
        })
        .catch((error) => {
          error.json().then((json) => {
            this.setState({
              loading: false
            });
          })
        });
        });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        {(loading) ?
          <div style={{position:'fixed', left:'50%', top:'50%', zIndex:99999}}>
            <Loader
               type="ThreeDots"
               color="#3366a0"
               height="80"
               width="80"
            />
          </div> : null}
        <a className="s_page_action" aria-label="Print" href="#" tabIndex="0" disabled={loading}
         onClick={this.handleClick.bind(this)}>
          <i className="s_page_action_i s_btn_i s_sagearmonyeicon">print</i>
        </a>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  selectedSalesInvoiceDetails: state.selectedSalesInvoiceDetails,
});

export const PrintButton = connect(mapStateToProps)(PrintButt);

import { createStore } from 'redux';

// Redux Store Setup
const initialState = {
  selectedSalesInvoiceIds: [],
  selectedSalesInvoiceDetails:{}
};

function repositoryReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SELECT_SALES_INVOICE': {
      return applyToggleSalesInvoice(state, action);
    }
    case 'TOGGLE_GET_SALES_DETAILS':{
      return toggleSalesIncoiceDetails(state, action);
    }
    default:
      return state;
  }
}

function applyToggleSalesInvoice(state, action) {
  const { id, isSelected } = action;
  state.selectedSalesInvoiceIds = [];
  const selectedSalesInvoiceIds = false
    ? state.selectedSalesInvoiceIds.filter(itemId => itemId !== id)
    : state.selectedSalesInvoiceIds.concat(id);

  return { ...state, selectedSalesInvoiceIds };
}

function toggleSalesIncoiceDetails(state, action) {
  const { node } = action;
  state.selectedSalesInvoiceDetails = node
  const selectedSalesInvoiceDetails = node

  return { ...state, selectedSalesInvoiceDetails };
}

const store = createStore(repositoryReducer, initialState);

export default store;

import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import client from './reducers/apolloClient.jsx';

import { Provider } from 'react-redux';
import store from './reducers/reducer.jsx';

import { PrintButton } from './components/PrintButton.jsx';
import LeftList from './components/LeftList.jsx';


ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
          <PrintButton />
      </Provider>
    </ApolloProvider>,
    document.querySelector('.s_common_actions_print_button')
);
ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
          <LeftList />
      </Provider>
    </ApolloProvider>,
    document.querySelector('.s-grid-slot-body')
);

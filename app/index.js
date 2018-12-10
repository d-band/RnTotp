import React from 'react';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import store from './store';
import TotpPage from './pages/TotpPage';
import ScanPage from './pages/ScanPage';

const Navigator = createStackNavigator({
  Home: {
    screen: TotpPage,
    navigationOptions: {
      title: 'Authenticator'
    }
  },
  Scan: {
    screen: ScanPage
  }
}, {
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#1582dc'
    }
  }
});
const AppContainer = createAppContainer(Navigator);

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;

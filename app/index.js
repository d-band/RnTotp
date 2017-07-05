import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import { StyleSheet } from 'react-native';
import store from './store';
import TotpPage from './pages/TotpPage';
import ScanPage from './pages/ScanPage';

const RouterWithRedux = connect()(Router);

const getSceneStyle = (props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#ddd',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#1582dc'
  },
  navBarTitle: {
    color: '#fff'
  }
});

const App = () => {
  return (
    <Provider store={store}>
      <RouterWithRedux
        getSceneStyle={getSceneStyle}
        navigationBarStyle={styles.navBar}
        titleStyle={styles.navBarTitle}>
        <Scene key="root">
          <Scene
            key="main"
            title="Authenticator"
            initial
            hideTabBar
            component={TotpPage}
          />
          <Scene
            key="scan"
            hideTabBar
            component={ScanPage}
          />
        </Scene>
      </RouterWithRedux>
    </Provider>
  );
};

export default App;

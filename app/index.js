import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import { StyleSheet, Navigator } from 'react-native';
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
    const nh = Navigator.NavigationBar.Styles.General.TotalNavHeight;
    style.marginTop = computedProps.hideNavBar ? 0 : nh;
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
            title="身份验证器"
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

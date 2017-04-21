import React, { Component } from 'react';
import { View, StyleSheet } from "react-native";
import { connect } from 'react-redux';
import { Actions } from "react-native-router-flux";
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import parse from 'url-parse';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rectWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rect: {
    height: 250,
    width: 250,
    borderWidth: 0.5,
    borderColor: '#2db7f5',
    backgroundColor: 'transparent'
  },
  corner: {
    width: 20,
    height: 20,
    position: 'absolute',
    borderColor: '#2db7f5'
  },
  lt: {
    left: 0,
    top: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3
  },
  rt: {
    right: 0,
    top: 0,
    borderRightWidth: 3,
    borderTopWidth: 3
  },
  lb: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3
  },
  rb: {
    right: 0,
    bottom: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3
  }
});

class ScanPage extends Component {
  componentDidMount() {
    Icon.getImageSource('arrow-left', 32, '#fff').then(img => {
      Actions.refresh({
        backButtonImage: img,
        leftButtonIconStyle: {
          width: 16
        }
      });
    });
  }
  barCodeRead({ data }) {
    if (!this.flag) return;
    this.flag = false;

    const { dispatch } = this.props;
    const { protocol, host, pathname, query } = parse(data, true);
    
    if (protocol === 'otpauth:' && host === 'totp') {
      const name = pathname.replace(/^\//, '');
      const { secret } = query;
      dispatch({
        type: 'totp/add',
        payload: { name, secret }
      });
      Actions.pop();
    } else {
      this.flag = true;
    }
  }
  render() {
    this.flag = true;
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          onBarCodeRead={this.barCodeRead.bind(this)}
          aspect={Camera.constants.Aspect.fill}>
          <View style={styles.rectWrap}>
            <View style={styles.rect}>
              <View style={[styles.corner, styles.lt]}/>
              <View style={[styles.corner, styles.rt]}/>
              <View style={[styles.corner, styles.lb]}/>
              <View style={[styles.corner, styles.rb]}/>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
}

export default connect()(ScanPage);

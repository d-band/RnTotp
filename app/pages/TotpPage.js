import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Clipboard,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { totp } from 'botp';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons';
import CircleProgress from '../components/CircleProgress';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerItem: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: '#3c80f7',
    fontSize: 40
  },
  user: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginRight: 5
  },
  time: {
    color: '#666',
    fontSize: 14,
    marginTop: 5
  },
  icon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    backgroundColor: '#eeeeec'
  },
  listView: {
    backgroundColor: '#eeeeec'
  }
});

const second = () => (new Date()).getUTCSeconds() % 30;
const genList = (ds, list) => {
  return ds.cloneWithRows(
    list.map(v => ({ ...v, otp: totp.gen(v.secret) }))
  );
};
class TotpPage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      time: second(),
      ds: genList(ds, props.list)
    };
  }
  resetDS(props) {
    const { ds } = this.state;
    this.setState({
      ds: genList(ds, props.list)
    });
  }
  componentWillReceiveProps(nextProps) {
    this.resetDS(nextProps);
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      const time = second();
      if (time === 0) {
        this.resetDS(this.props);
      }
      this.setState({ time });
    }, 500);
    // init otp list
    this.resetDS(this.props);
    // init navbar
    Icon.getImageSource('md-qr-scanner', 40, '#fff').then(img => {
      Actions.refresh({
        rightButtonImage: img,
        rightButtonIconStyle: {
          width: 20,
          height: 20
        },
        onRight: () => Actions.scan()
      });
    });
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  deleteItem(item) {
    this.props.dispatch({
      type: 'totp/delete',
      payload: item
    });
  }
  render() {
    const { ds, time } = this.state;
    const copy = (text) => {
      Clipboard.setString(text);
      Alert.alert('Tips', 'Have copied to clipboard: ' + text);
    };
    const TrashIcon = () => {
      return (
        <View style={styles.icon}>
          <Icon name="ios-trash-outline" size={30} color="#fff" />
        </View>
      );
    };
    const renderRow = (item) => {
      const btns = [{
        component: <TrashIcon />,
        backgroundColor: 'red',
        onPress: () => { this.deleteItem(item) }
      }];
      return (
        <Swipeout right={btns}
          autoClose
          backgroundColor="transparent">
          <TouchableOpacity onPress={() => copy(item.otp)}>
            <View style={styles.containerItem}>
              <Text style={styles.title}>{item.otp}</Text>
              <View style={styles.itemContent}>
                <Text style={styles.user}>{item.name}</Text>
                <CircleProgress radius={8} percent={time / 30 * 100} />
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
      );
    };
    const content = () => {
      if (ds.getRowCount() === 0) {
        return (
          <View style={styles.noData}>
            <Icon name="ios-filing-outline" size={100} color="#999" />
            <Text style={{ fontSize: 18, color: '#999' }}>
              No Data
            </Text>
          </View>
        );
      }
      return (
        <ListView
          initialListSize={1}
          dataSource={ds}
          renderRow={renderRow}
          style={styles.listView}
        />
      );
    };
    return (
      <View style={styles.container}>
        {content()}
      </View>
    );
  }
}

const mapState = (state) => {
  return { list: state.totp.list };
}

export default connect(mapState)(TotpPage);

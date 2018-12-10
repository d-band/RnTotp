import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Clipboard
} from 'react-native';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons';
import CircleProgress from '../components/CircleProgress';

const styles = StyleSheet.create({
  headerBtn: {
    marginHorizontal: 11
  },
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
class TotpPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.push('Scan')}>
          <Icon name="md-qr-scanner" size={23} color="#fff" />
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      time: second()
    };
  }
  updateOTP() {
    this.props.dispatch({
      type: 'totp/update'
    });
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      const time = second();
      this.setState(prev => {
        if (prev.time > time) {
          this.updateOTP();
        }
        return { time };
      });
    }, 500);
    // init update otp list
    this.updateOTP();
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
    const { time } = this.state;
    const { list } = this.props;
    const copy = (text) => {
      Clipboard.setString(text);
      Alert.alert('Tips', 'Have copied to clipboard: ' + text);
    };
    const TrashIcon = () => {
      return (
        <View style={styles.icon}>
          <Icon name="ios-trash" size={30} color="#fff" />
        </View>
      );
    };
    const renderItem = ({ item }) => {
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
      if (!list.length) {
        return (
          <View style={styles.noData}>
            <Icon name="ios-filing" size={100} color="#999" />
            <Text style={{ fontSize: 18, color: '#999' }}>
              No Data
            </Text>
          </View>
        );
      }
      return (
        <FlatList
          data={list}
          extraData={time}
          renderItem={renderItem}
          style={styles.listView}
          keyExtractor={(item) => item.secret}
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

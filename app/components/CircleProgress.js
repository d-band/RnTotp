import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    position: 'absolute',
    top: 0
  }
});

export default class CircleProgress extends Component {
  propTypes: {
    color: React.PropTypes.string,
    bgcolor: React.PropTypes.string,
    radius: React.PropTypes.number,
    percent: React.PropTypes.number
  }
  constructor(props) {
    super(props);
    this.state = this.compute(this.props.percent);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.compute(nextProps.percent));
  }
  compute(percent) {
    let degree = percent * 3.6 + 'deg';
    let color = this.props.color;
    if (percent >= 50) {
      color = this.props.bgcolor;
      degree = (percent - 50) * 3.6 + 'deg';
    }
    return { percent, degree, color };
  }
  render() {
    return (
      <View style={[styles.circle,{
        width:this.props.radius*2,
        height: this.props.radius*2,
        borderRadius:this.props.radius,
        backgroundColor: this.props.bgcolor
      }]}>
        <View style={[styles.loader,{
          left: 0,
          width: this.props.radius,
          height: this.props.radius * 2,
          backgroundColor: this.props.color,
          borderTopLeftRadius: this.props.radius,
          borderBottomLeftRadius: this.props.radius
        }]}/>
        <View style={[styles.loader,{
          left:this.props.radius,
          width: this.props.radius,
          height: this.props.radius * 2,
          backgroundColor: this.state.color,
          borderTopRightRadius: this.props.radius,
          borderBottomRightRadius: this.props.radius,
          transform: [{
            translateX: -this.props.radius / 2
          }, {
            rotate:this.state.degree
          }, {
            translateX: this.props.radius / 2
          }]
        }]}/>
      </View>
    );
  }
}

CircleProgress.defaultProps = {
  color: '#3c80f7',
  bgcolor: '#e3e3e3'
};

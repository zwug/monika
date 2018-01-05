import React from 'react';
import { Text, View, Animated, StyleSheet, Easing, Button } from 'react-native';
import { Audio } from 'expo';

const size = 200;
const borderWidth = 16;

const styles = StyleSheet.create({
  circle: {
    borderColor: '#ffff00',
    borderRadius: size / 2,
    borderWidth,
    height: size,
    position: 'relative',
    width: size,
  },
  cover: {
    borderColor: '#212121',
    borderBottomWidth: (size / 2),
    bottom: -borderWidth,
    left: -2 * borderWidth,
    height: size,
    position: 'absolute',
    width: size + (2 * borderWidth),
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: (size / 2) - 50,
    zIndex: 2,
  },
  duration: {
    alignItems: 'center',
    paddingTop: 25,
    zIndex: 3,
  },
  durationText: {
    color: '#fff',
    fontSize: 56,
  },
});

export default class Timer extends React.Component {
  static defaultProps = {
    duration: 3,
  }

  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      rotateAnim: new Animated.Value(0),
      secondsLeft: props.duration,
    };
    this.state.rotateAnim.addListener(this.onSecondsLeftUpdate);

    Audio.setIsEnabledAsync(true)
    .then(() => {
      this.sound = new Audio.Sound();
      return this.sound.loadAsync(require('./horn.mp3'));
    }).then(() => {console.log('loaded');})
  }

  componentWillReceiveProps({ duration }) {
    if (duration === this.props.duration) {
      return;
    }

    Animated.timing(
      this.state.rotateAnim,
      {
        toValue: 0,
        duration: 200,
      },
    ).start();

    this.setState({
      isRunning: false,
      secondsLeft: duration,
    });
  }

  onSecondsLeftUpdate = ({ value }) => {
    const secondsLeft = this.props.duration * (1 - value);
    this.setState({
      secondsLeft,
    });

    if (secondsLeft == 0) {
      return this.sound.playAsync()
      .then(() => {
        return this.sound.setPositionAsync(0);
      });
    }
  }

  onTimeEnd = () => {
    this.setState({
      isRunning: false,
      secondsLeft: this.props.duration,
    });

    Animated.timing(
      this.state.rotateAnim,
      {
        toValue: 0,
        duration: 200,
      },
    ).start();
  }

  onStartPress = () => {
    Animated.timing(
      this.state.rotateAnim,
      {
        toValue: 1,
        duration: this.props.duration * 1000,
        easing: Easing.linear,
      },
    ).start(this.onTimeEnd);

    this.setState({
      isRunning: true,
    });
  }

  render() {
    const spin = this.state.rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View style={styles.circle}>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{this.state.secondsLeft.toFixed(1)}</Text>
        </View>
        {!this.state.isRunning &&
          <View style={styles.button}>
            <Button onPress={this.onStartPress} title={'Начать'} />
          </View>
        }
        <Animated.View style={styles.cover} />
        <Animated.View style={[styles.cover, { transform: [{ rotate: spin }] }]} />
      </View>
    );
  }
}

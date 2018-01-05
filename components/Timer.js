import React from 'react';
import { Text, View, Animated, StyleSheet, Easing, TouchableOpacity } from 'react-native';
import { Audio } from 'expo';

const size = 200;
const borderWidth = 16;
const yellow = '#ffff00';

const styles = StyleSheet.create({
  circleContainer: {
    height: size,
    position: 'relative',
    width: size,
    alignItems: 'center',
  },
  circle: {
    borderColor: yellow,
    borderRadius: size / 2,
    borderWidth,
    height: size,
    position: 'absolute',
    width: size,
    top: 0,
    left: 0,
  },
  cover: {
    borderColor: '#212121',
    borderBottomWidth: (size / 2) + 15,
    bottom: -15,
    left: -15,
    right: -15,
    height: size + 30,
    position: 'absolute',
    width: size + (2 * borderWidth),
  },
  startButton: {
    backgroundColor: yellow,
    borderRadius: 4,
    padding: 20,
    zIndex: 2,
    marginTop: 30,
  },
  stopButton: {
    backgroundColor: '#ff0000',
    borderRadius: 4,
    padding: 10,
    zIndex: 2,
    marginTop: 30,
  },
  buttonText: {
    color: '#000',
    fontSize: 24,
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

    this.setTime(duration);
  }

  setTime = (duration) => {
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
      console.log('playAsync');
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

  onResetPress = () => {
    this.setTime(this.props.duration);
  }

  renderControls() {
    if (this.state.isRunning) {
      return (
        <TouchableOpacity style={styles.stopButton} onPress={this.onResetPress}>
          <Text style={styles.buttonText}>Сброс</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.startButton} onPress={this.onStartPress}>
        <Text style={styles.buttonText}>Начать</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const spin = this.state.rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View style={styles.circleContainer}>
        <View style={styles.circle} />
        <View style={styles.duration}>
          <Text style={styles.durationText}>{this.state.secondsLeft.toFixed(1)}</Text>
        </View>
        {this.renderControls()}
        <Animated.View style={styles.cover} />
        <Animated.View style={[styles.cover, { transform: [{ rotate: spin }] }]} />
      </View>
    );
  }
}

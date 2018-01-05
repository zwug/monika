import React from 'react';
import { StyleSheet, View } from 'react-native';
import Timer from './components/Timer';
import Navigation from './components/Navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fffff2',
    fontSize: 200,
  },
  round: {
    flex: 1,
    flexBasis: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    flexShrink: 20,
    height: 100,
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 30,
    };
  }

  onRoundDurationChange = (duration) => {
    this.setState({
      duration,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.round}>
          <Timer duration={this.state.duration} />
        </View>
        <View style={styles.navigation}>
          <Navigation onRoundDurationChange={this.onRoundDurationChange} />
        </View>
      </View>
    );
  }
}

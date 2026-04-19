import React from 'react';
import {View, StyleSheet} from 'react-native';

const SolidLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: 'black',
  },
});

export default SolidLine;

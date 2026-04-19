import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AppRoundButton = ({onPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.roundPlusButton}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundPlusButton: {
    borderWidth: 1,
    borderColor: '#52A49A',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 16,
    color: '#52A49A',
  },
});

export default AppRoundButton;

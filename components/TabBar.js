import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {getBottomSpace} from 'react-native-iphone-x-helper';

import ThemeConstants from '../constants/Theme';
import {ThemeContext} from '../context';

const TabBar = ({ state, descriptors, navigation }) => {
  const {theme} = useContext(ThemeContext);
  const { routes, index: activeRouteIndex } = state;
  
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: ThemeConstants[theme].background},
      ]}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const { options } = descriptors[route.key]; 
        const tintColor = isRouteActive ? '#fff' : '#fff'; 

       
        const icon = options.tabBarIcon && options.tabBarIcon({ focused: isRouteActive, tintColor });
        const label = options.tabBarLabel || route.name;

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.item, isRouteActive && styles.itemActive]}
            onPress={() => navigation.navigate(route.name)} 
            onLongPress={() => {
              if (options.onTabLongPress) {
                options.onTabLongPress({ route });
              }
            }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
     
            {icon}

         
            <Text style={{ color: tintColor, fontSize: 12 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: getBottomSpace(),
  },

  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
  },

  itemActive: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  lable: {
    color: '#fff',
    fontSize: 12,
  },
});

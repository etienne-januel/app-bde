import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

export default Home = () => {
  return (
    <View style={style.bigContainer}>
      <View style={style.main}>
        <NavigationContainer>
          <DrawerScreen />
        </NavigationContainer>
      </View>
    </View>
  );
};

const HomeFeed = () => {
  return <View />;
};

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="HomeFeed">
    <Drawer.Screen name="HomeFeed" component={HomeFeed} />
    <Drawer.Screen name="Events" component={EventsScreen} />
  </Drawer.Navigator>
);

const style = StyleSheet.create({
  bigContainer: {
    flex: 1,
  },
  main: {
    flex: 4,
    width: '100%',
    justifyContent: 'flex-start',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: '#E7EEF5',
  },
});

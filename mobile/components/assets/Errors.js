import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AuthenticationFormErrors = (props) => {
  return (
    <View style={style.container}>
      {props.errors.map((error, index) => (
        <Text style={style.item} key={index}>
          {error}
        </Text>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    color: 'red',
  },
});

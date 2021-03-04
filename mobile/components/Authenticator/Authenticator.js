import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from './Login';
import { ResetPasswordScreen } from './ResetPassword';
import { RegisterScreen } from './Register';
import { RegisterStep2Screen } from './RegisterStep2';
import { RegisterStep3Screen } from './RegisterStep3';

export default Authenticator = (props) => {
  return (
    <NavigationContainer>
      <AuthStackScreen {...props} />
    </NavigationContainer>
  );
};

const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen
      name="LoginScreen"
      children={(oldprops) => <LoginScreen {...oldprops} {...props} />}
    />
    <AuthStack.Screen
      name="ResetPasswordScreen"
      component={ResetPasswordScreen}
    />
    <AuthStack.Screen
      name="RegisterScreen"
      children={(oldprops) => <RegisterScreen {...oldprops} {...props} />}
    />
    <AuthStack.Screen
      name="RegisterStep2Screen"
      children={(oldprops) => <RegisterStep2Screen {...oldprops} {...props} />}
    />
    <AuthStack.Screen
      name="RegisterStep3Screen"
      children={(oldprops) => <RegisterStep3Screen {...oldprops} {...props} />}
    />
  </AuthStack.Navigator>
);

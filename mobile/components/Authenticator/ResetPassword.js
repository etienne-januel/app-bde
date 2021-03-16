import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { Loader } from '../assets/Loader';
import { ArrowLeftButton } from '../assets/Navigation';

export const ResetPasswordScreen = (props) => {
  return <ResetPassword {...props} />;
};

const ResetPassword = (props) => {
  const [userInfo, setUserInfo] = useState({
    mail: 'etienne.januel@laplateforme.io',
  });
  const [isLoading, setLoading] = useState(false);

  handleForm = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const submitForm = () => {
    const errors = new Array();

    if (userInfo.mail == '') {
      errors.push('mail is empty');
    } else {
      if (!userInfo.mail.includes('.') || !userInfo.mail.includes('@')) {
        errors.push('mail format is invalid');
      }
    }

    if (errors.length > 0) {
      console.log(errors);
    } else {
      console.log('gud');
      setLoading(true);
    }
  };

  return (
    <View style={style.container}>
      <SafeAreaView>
        <View style={style.titleContainer}>
          <ArrowLeftButton {...props.navigation} />
          <Text style={style.title}>Mot de passe oublié</Text>
          {isLoading ? <Loader /> : <View style={{width:36}}/>}
        </View>
        <View style={style.formContainer}>
          <View>
            <Text style={style.formLabel}>Addresse mail</Text>
            <TextInput
              style={style.formInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              value={userInfo.mail}
              onChangeText={(text) => {
                handleForm('mail', text);
              }}
            />
          </View>

          <TouchableOpacity
            style={style.formButton}
            onPress={() => {
              submitForm();
            }}
          >
            <Text style={style.formButtonText}>
              Réinitialiser le mot de passe
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#F0F0F0',
    marginTop: Platform.OS === 'android' ? 20 : 0
  },
  titleContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#707070',
    fontSize: 18,
    textAlign: 'center',
  },
  formContainer: {
    width: Dimensions.get('window').width - 40,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 21,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#664BFB',
    marginBottom: 4,
  },
  formInput: {
    borderRadius: 50,
    borderColor: '#664BFB',
    borderWidth: 2,
    color: '#707070',
    padding: 12,
    fontSize: 16,
  },
  formLink: {
    textDecorationStyle: 'solid',
    textDecorationColor: '#664BFB',
    textDecorationLine: 'underline',
    color: '#664BFB',
    fontSize: 16,
    textAlign: 'center',
  },
  formButton: {
    marginTop: 20,
    backgroundColor: '#FF6464',
    padding: 12,
    borderRadius: 21,
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

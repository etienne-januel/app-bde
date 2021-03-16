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
  Button,
} from 'react-native';
import axios from 'axios';
import { Loader } from '../assets/Loader';
import { ArrowLeftButton } from '../assets/Navigation';
import Lock from '../assets/images/lock.svg';
import { Visibility } from '../assets/Buttons';
import { AuthenticationFormErrors } from '../assets/Errors';

export const RegisterStep3Screen = (props) => {
  return <RegisterStep3 {...props} />;
};

const RegisterStep3 = (props) => {
  const [userInfo, setUserInfo] = useState({
    mail: props.userInfo.mail,
    username: props.userInfo.mail.split('@')[0],
    verificationCode: props.userInfo.verificationCode,
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  handleForm = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const submitForm = () => {
    let errorsMock = [];

    !(userInfo.password == userInfo.passwordConfirm) &&
      errorsMock.push('Les mots de passe doivent correspondre');

    if (!errorsMock.length > 0) {
      setLoading(true);
      axios
        .post(
          'http://localhost:8080/register/3',
          { userInfo },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          setLoading(false);
          console.log(response.data);
          if (response.data.http_code == 200) {
            props.fetchUserInfo('flat', userInfo);
            props.navigation.push('RegisterStep4Screen');
          } else {
            errorsMock.push(response.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          errorsMock.push(error);
        });
    }
    setErrors(errorsMock);
  };

  return (
    <View style={style.container}>
      <SafeAreaView>
        <View style={style.titleContainer}>
          <ArrowLeftButton {...props.navigation} />
          <Text style={style.title}>Informations de connexion</Text>
          {isLoading ? <Loader /> : <View style={{ width: 36 }} />}
        </View>
        <View style={style.formContainer}>
          <View>
            <Text style={style.formLabel}>Addresse mail</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={userInfo.mail}
                editable={false}
              />
              <Lock style={style.inputDecoration} width={24} height={24} />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={style.formLabel}>Nom d'utilisateur</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={userInfo.username}
                editable={false}
              />
              <Lock style={style.inputDecoration} width={24} height={24} />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={style.formLabel}>Mot de passe</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                secureTextEntry={passwordVisibility}
                value={userInfo.password}
                onChangeText={(text) => {
                  handleForm('password', text);
                }}
              />
              <Visibility
                style={style.inputDecoration}
                setVisibility={setPasswordVisibility}
                visibility={passwordVisibility}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={style.formLabel}>Mot de passe (confirmation)</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                secureTextEntry={passwordVisibility}
                value={userInfo.passwordConfirm}
                onChangeText={(text) => {
                  handleForm('passwordConfirm', text);
                }}
              />
              <Visibility
                style={style.inputDecoration}
                setVisibility={setPasswordVisibility}
                visibility={passwordVisibility}
              />
            </View>
          </View>

          {errors.length > 0 && <AuthenticationFormErrors errors={errors} />}

          <TouchableOpacity
            style={style.formButton}
            onPress={() => {
              submitForm();
            }}
          >
            <Text style={style.formButtonText}>Valider ces informations</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Button
        title="dev errors"
        onPress={() => {
          setErrors([]);
        }}
      />
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
    marginTop: Platform.OS === 'android' ? 20 : 0,
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
  loader: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  formContainer: {
    width: Dimensions.get('window').width - 40,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 21,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  formText: {
    fontSize: 16,
    color: '#707070',
    textAlign: 'center',
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
  inputDecoration: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  digitContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  formDigit: {
    borderRadius: 12,
    borderColor: '#707070',
    color: '#707070',
    borderWidth: 1,
    width: 42,
    height: 52,
    textAlign: 'center',
    fontSize: 20,
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

import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Loader } from '../assets/Loader';
import Warning from '../assets/images/warning.svg';

export const LoginScreen = (props) => {
  return <Login {...props} />;
};

const Login = (props) => {
  const [userInfo, setUserInfo] = useState({
    username: 'john.doe',
    password: 'toto13010',
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

  handleForm = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const submitForm = () => {
    const errorsArray = new Array();

    if (userInfo.username == '') {
      errorsArray.push('username is empty');
    } else {
      if (!userInfo.username.includes('.')) {
        errorsArray.push('username format is invalid');
      }
    }

    if (userInfo.password == '') {
      errorsArray.push('password is empty');
    }

    if (!errorsArray.length > 0) {
      setLoading(true);
      axios
        .post('http://localhost:8080/login', userInfo, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          console.log(response);
          setLoading(false);
          if (response.data.http_code == 200) {
            props.fetchUserInfo('jwt', response.data.jwt);
          } else if (
            response.data.http_code == 401 ||
            response.data.http_code == 400
          ) {
            errorsArray.push(response.data.message);
            setErrors(errorsArray);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          errorsArray.push(error);
          setErrors(errorsArray);
        });
    } else {
      setErrors(errorsArray);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.titleContainer}>
        <Text style={style.title}>Connexion</Text>
        {isLoading && (
          <View style={style.loader}>
            <Loader />
          </View>
        )}
      </View>
      <View style={style.formContainer}>
        <View>
          <Text style={style.formLabel}>Nom d'utilisateur</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={style.formInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              value={userInfo.username}
              onChangeText={(text) => {
                handleForm('username', text);
              }}
            />
            {errors.length > 0 && (
              <Warning style={style.inputWarning} width={24} height={24} />
            )}
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={style.formLabel}>Mot de passe</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={style.formInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              secureTextEntry={true}
              value={userInfo.password}
              onChangeText={(text) => {
                handleForm('password', text);
              }}
            />
            {errors.length > 0 && (
              <Warning style={style.inputWarning} width={24} height={24} />
            )}
          </View>
        </View>

        <Pressable
          style={{ marginTop: 20 }}
          onPress={() => {
            props.navigation.push('ResetPasswordScreen');
          }}
        >
          <Text style={style.formLink}>Mot de passe oublié ?</Text>
        </Pressable>

        <Pressable
          style={{ marginTop: 20 }}
          onPress={() => {
            props.navigation.push('RegisterScreen');
          }}
        >
          <Text style={style.formLink}>Créer un compte</Text>
        </Pressable>

        <TouchableOpacity
          style={style.formButton}
          onPress={() => {
            submitForm();
          }}
        >
          <Text style={style.formButtonText}>Connexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#F0F0F0',
  },
  titleContainer: {
    width: Dimensions.get('window').width - 40,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 24,
  },
  loader: {
    position: 'absolute',
    right: 10,
    top: 20,
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
    borderRadius: 21,
    borderColor: '#664BFB',
    borderWidth: 2,
    color: '#707070',
    padding: 12,
    fontSize: 16,
    position: 'relative',
  },
  inputWarning: {
    position: 'absolute',
    top: 10,
    right: 20,
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

import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
} from 'react-native';
import axios from 'axios';
import { Loader } from '../assets/Loader';
import { ArrowLeftButton } from '../assets/Navigation';
import Warning from '../assets/images/warning.svg';

export const RegisterScreen = (props) => {
  return <Register {...props} />;
};

const Register = (props) => {
  const [userInfo, setUserInfo] = useState({
    mail: 'etienne.januel@laplateforme.io',
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleForm = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const submitForm = () => {
    let errorsArray = new Array();

    if (userInfo.mail == '') {
      errorsArray.push('mail is empty');
    } else {
      if (!userInfo.mail.includes('.') || !userInfo.mail.includes('@')) {
        errorsArray.push('mail format is invalid');
      }
    }

    if (!errorsArray.length > 0) {
      setLoading(true);
      axios
        .post('http://localhost:8080/register/1', userInfo, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          setLoading(false);
          if (response.data.http_code == 200) {
            props.fetchUserInfo('flat', userInfo);
            props.navigation.push('RegisterStep2Screen');
          } else if (
            response.data.http_code == 400 ||
            response.data.http_code == 401
          ) {
            errorsArray.push(response.data.message);
            setErrors(errorsArray);
          }
        })
        .catch((error) => {
          setLoading(false);
          errorsArray.push(error);
          setErrors(errorsArray);
        });
    } else {
      setErrors(errorsArray);
    }
  };

  return (
    <View style={style.container}>
      <SafeAreaView>
        <View style={style.titleContainer}>
          <ArrowLeftButton {...props.navigation} />
          <Text style={style.title}>Vérification de l'email</Text>
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
                onChangeText={(text) => {
                  handleForm('mail', text);
                }}
              />
              {errors.length > 0 && (
                <Warning style={style.inputWarning} width={24} height={24} />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={style.formButton}
            onPress={() => {
              submitForm();
            }}
          >
            <Text style={style.formButtonText}>Vérifier l'addresse mail</Text>
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
    borderRadius: 21,
    borderColor: '#664BFB',
    borderWidth: 2,
    color: '#707070',
    padding: 12,
    fontSize: 16,
  },
  inputWarning: {
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

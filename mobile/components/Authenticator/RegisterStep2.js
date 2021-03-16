import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  Platform,
} from 'react-native';
import axios from 'axios';
import { Loader } from '../assets/Loader';
import { ArrowLeftButton } from '../assets/Navigation';

export const RegisterStep2Screen = (props) => {
  return <RegisterStep2 {...props} />;
};

const RegisterStep2 = (props) => {
  const [digits, setDigits] = useState(['5', '9', '2', '1', '1', '4']);
  const [userInfo, setUserInfo] = useState({
    mail: props.userInfo.mail,
    verificationCode: digits.join(''),
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const textInputRefs = [];

  const isNumeric = (str) => {
    if (typeof str == 'number') return true;
    if (typeof str != 'string') return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  };
  /*
Prevent default sur le textinput sinon tt marche
*/
  handleForm = (index, value) => {
    let digitsArray = digits;
    let trueIndex = index;
    for (let i = 5; i >= 0; i--) {
      if (!isNumeric(digits[i])) {
        trueIndex = i;
      }
    }

    textInputRefs[trueIndex].focus();

    if (!isNumeric(digits[trueIndex])) {
      if (
        value.key == 'Backspace' &&
        textInputRefs[trueIndex - 1] != undefined
      ) {
        textInputRefs[trueIndex - 1].focus();
      }
      if (isNumeric(value.key)) {
        digitsArray[trueIndex] = value.key;
      } else {
      }
    } else {
      if (value.key == 'Backspace') {
        digitsArray[trueIndex] = '';
      } else if (isNumeric(value.key)) {
        digitsArray[trueIndex] = value.key;
      }
    }
    setDigits(digitsArray);
    if (isNumeric(digits[trueIndex]) && textInputRefs[trueIndex + 1]) {
      textInputRefs[trueIndex + 1].focus();
    }
    if (trueIndex == 5) {
      let trueDigits = 0;
      digits.forEach((digit) => isNumeric(digit) && trueDigits++);
      if (trueDigits) {
        let userInfoMock = userInfo;
        userInfoMock.verificationCode = digits.join('');
        setUserInfo(userInfoMock);
        submitForm();
      }
    }
  };

  const submitForm = () => {
    let errorsMock = [];
    axios
      .post(
        'http://localhost:8080/register/2',
        { userInfo },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        if (response.data.http_code == 200) {
          props.fetchUserInfo('flat', userInfo);
          props.navigation.push('RegisterStep3Screen');
        } else if (
          response.data.http_code == 400 ||
          response.data.http_code == 401
        ) {
          errorsMock.push(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        errorsMock.push(error);
      });

    setErrors(errorsMock);
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
          <Text style={style.formText}>
            Un email contenant un code à 6 chiffres à été envoyé à l’adresse
            indiquée.
          </Text>
          <Text style={[style.formText, { marginTop: 10 }]}>
            Saisis ce code dans le champ ci-dessous afin de poursuivre ton
            inscription !
          </Text>
          <View>
            <View style={style.digitContainer}>
              <TextInput
                ref={(input) => {
                  textInputRefs[0] = input;
                }}
                autoFocus={true}
                keyboardType={'numeric'}
                style={style.formDigit}
                maxLength={1}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={digits[0]}
                onKeyPress={({ nativeEvent }) => {
                  handleForm(0, nativeEvent);
                }}
                blurOnSubmit={false}
              />
              <TextInput
                ref={(input) => {
                  textInputRefs[1] = input;
                }}
                style={style.formDigit}
                keyboardType={'numeric'}
                maxLength={1}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={digits[1]}
                onKeyPress={({ nativeEvent }) => {
                  handleForm(1, nativeEvent);
                }}
                blurOnSubmit={false}
              />
              <TextInput
                ref={(input) => {
                  textInputRefs[2] = input;
                }}
                style={style.formDigit}
                keyboardType={'numeric'}
                maxLength={1}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={digits[2]}
                onKeyPress={({ nativeEvent }) => {
                  handleForm(2, nativeEvent);
                }}
                blurOnSubmit={false}
              />
              <TextInput
                ref={(input) => {
                  textInputRefs[3] = input;
                }}
                style={style.formDigit}
                keyboardType={'numeric'}
                maxLength={1}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={digits[3]}
                onKeyPress={({ nativeEvent }) => {
                  handleForm(3, nativeEvent);
                }}
                blurOnSubmit={false}
              />
              <TextInput
                ref={(input) => {
                  textInputRefs[4] = input;
                }}
                style={style.formDigit}
                keyboardType={'numeric'}
                maxLength={1}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={digits[4]}
                onKeyPress={({ nativeEvent }) => {
                  handleForm(4, nativeEvent);
                }}
                blurOnSubmit={false}
              />
              <TextInput
                ref={(input) => {
                  textInputRefs[5] = input;
                }}
                style={style.formDigit}
                keyboardType={'numeric'}
                maxLength={1}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={digits[5]}
                onKeyPress={({ nativeEvent }) => {
                  handleForm(5, nativeEvent);
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Button
        title="dev Submit"
        onPress={() => {
          submitForm();
        }}
      />
      <Button
        title="dev Digits"
        onPress={() => {
          console.log(digits);
        }}
      />
      <Button
        title="dev userInfo"
        onPress={() => {
          // console.log(textInputRefs[0].viewConfig);
          console.log(userInfo);
        }}
      />
      <Button
        title="dev errors"
        onPress={() => {
          console.log(errors);
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
    borderRadius: 21,
    borderColor: '#664BFB',
    borderWidth: 2,
    color: '#707070',
    padding: 12,
    fontSize: 16,
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
    borderWidth: 1.5,
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

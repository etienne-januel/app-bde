import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { Loader } from '../assets/Loader';
import { ArrowLeftButton } from '../assets/Navigation';
import Warning from '../assets/images/warning.svg';

export const RegisterStep2Screen = (props) => {
  return <RegisterStep2 {...props} />;
};

const RegisterStep2 = (props) => {
  const [digits, setDigits] = useState([]);
  const [userInfo, setUserInfo] = useState({
    mail: props.userInfo.mail,
    verificationCode: digits.join(''),
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const textInputRefs = [];

  handleForm = (index, value) => {
    console.log(digits[index], ' => ', value);
    if(digits[index] == '' || !digits[index])
    {
      console.log('soit vide soit null');
    } else {
      console.log('ya un char');
    }

    let digitsArray = digits;
    digitsArray[index] = value;
    setDigits(digitsArray);

    // if (!digits[index]) {
    //   if (Number.isInteger(parseInt(value, 10))) {
    //     let verificationCodeArray = digits;
    //     verificationCodeArray[index] = value;
    //     setDigits(verificationCodeArray);

    //     if (parseInt(digits[index], 10)) {
    //       if (textInputRefs[index + 1]) {
    //         textInputRefs[index + 1].focus();
    //       } else {
    //         let trueDigit = 7;
    //         digits.forEach((digit) => {
    //           if (Number.isInteger(digit)) {
    //             trueDigit--;
    //           }
    //         });
    //         if (trueDigit) {
    //           Keyboard.dismiss();
    //           setUserInfo({ ...userInfo, verificationCode: digits.join('') });
    //           // submitForm();
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   let verificationCodeArray = digits;
    //   verificationCodeArray[index] = value;
    //   setDigits(verificationCodeArray);
    // }
  };

  const submitForm = () => {
    const errorsArray = new Array();

    if (digits == '') {
      errors.push('verificationCodeArray is empty');
    }

    if (!errorsArray.length > 0) {
      setLoading(true);
      axios
        .post('http://localhost:8080/register/2', userInfo, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          setLoading(false);
          if (response.data.http_code == 200) {
            props.navigation.push('RegisterStep3Screen');
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
                onChangeText={(text) => {
                  handleForm(0, text);
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
                onChangeText={(text) => {
                  handleForm(1, text);
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
                onChangeText={(text) => {
                  handleForm(2, text);
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
                onChangeText={(text) => {
                  handleForm(3, text);
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
                onChangeText={(text) => {
                  handleForm(4, text);
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
                onChangeText={(text) => {
                  handleForm(5, text);
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Button
        style={{
          padding: 5,
          marginTop: 50,
        }}
        title="dev"
        onPress={() => {
          console.log(digits);
          // submitForm();
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

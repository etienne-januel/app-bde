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
import { AuthenticationFormErrors } from '../assets/Errors';
// import DocumentPicker from 'react-native-document-picker';

export const RegisterStep4Screen = (props) => {
  return <RegisterStep4 {...props} />;
};

const RegisterStep4 = (props) => {
  const [userInfo, setUserInfo] = useState({
    mail: props.userInfo.mail,
    username: props.userInfo.mail.split('@')[0],
    verificationCode: props.userInfo.verificationCode,
    password: props.userInfo.password,
    passwordConfirm: props.userInfo.passwordConfirm,
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

  // const pickFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //       //There can me more options as well
  //       // DocumentPicker.types.allFiles
  //       // DocumentPicker.types.images
  //       // DocumentPicker.types.plainText
  //       // DocumentPicker.types.audio
  //       // DocumentPicker.types.pdf
  //     });
  //     //Printing the log realted to the file
  //     console.log('res : ' + JSON.stringify(res));
  //     console.log('URI : ' + res.uri);
  //     console.log('Type : ' + res.type);
  //     console.log('File Name : ' + res.name);
  //     console.log('File Size : ' + res.size);
  //     //Setting the state to show single file attributes
  //     // this.setState({ singleFile: res });
  //   } catch (err) {
  //     //Handling any exception (If any)
  //     if (DocumentPicker.isCancel(err)) {
  //       //If user canceled the document selection
  //       alert('Canceled from single doc picker');
  //     } else {
  //       //For Unknown Error
  //       alert('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // }

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
          'http://localhost:8080/register/4',
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
          <Text style={style.title}>Informations personnelles</Text>
          {isLoading ? <Loader /> : <View style={{ width: 36 }} />}
        </View>
        <View style={style.formContainer}>
          <View>
            <Text style={style.formLabel}>Promotion</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={userInfo.grade}
                onChangeText={(text) => {
                  handleForm('grade', text);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={style.formLabel}>Date de naissance</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={userInfo.birthDate}
                onChangeText={(text) => {
                  handleForm('birthDate', text);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={style.formLabel}>Image de profil</Text>
            <View>
              <TextInput
                style={style.formInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                value={userInfo.avatar}
                onChangeText={(text) => {
                  handleForm('avatar', text);
                }}
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
      {/* <Button
        title="dev pickFile"
        onPress={() => {
          pickFile();
        }}
      /> */}
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

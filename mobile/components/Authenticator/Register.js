import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import { Loader } from '../assets/Loader';
import { ArrowLeftButton } from '../assets/Navigation';
import Warning from '../assets/images/warning.svg';
import { AuthenticationFormErrors } from '../assets/Errors';

export const RegisterScreen = (props) => {
  return <Register {...props} />;
};

const Register = (props) => {
  const [userInfo, setUserInfo] = useState({
    mail: 'etienne.januel@laplateforme.io',
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleForm = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const submitForm = (force = false) => {
    let errorsMock = [];

    (userInfo.mail == '' && errorsMock.push('Le champ mail est vide')) ||
      ((!userInfo.mail.includes('.') || !userInfo.mail.includes('@')) &&
        errorsMock.push('mail format is invalid'));

    if (!errorsMock.length > 0) {
      setLoading(true);
      axios
        .post(
          'http://localhost:8080/register/1',
          { userInfo },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          setLoading(false);
          console.log(response.data);
          if (response.data.http_code == 200) {
            if (response.data.status == 'exist') {
              setModalVisible(true);
            } else {
              props.fetchUserInfo('flat', userInfo);
              props.navigation.push('RegisterStep2Screen');
            }
          } else if (
            response.data.http_code == 400 ||
            response.data.http_code == 401
          ) {
            for (const [key, value] of Object.entries(response.data.message)) {
              errorsMock.push(value);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          errorsMock.push(error);
        });
    }
    setErrors(errorsMock);
  };

  const submitModal = (action) => {
    setModalVisible(!modalVisible);
    switch (action) {
      case 0:
        props.fetchUserInfo('flat', userInfo);
        props.navigation.push('RegisterStep2Screen');
        break;
      case 1:
        submitForm(true);
        break;
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
            </View>
          </View>

          {errors.length > 0 && <AuthenticationFormErrors errors={errors} />}

          <TouchableOpacity
            style={style.formButton}
            onPress={() => {
              submitForm();
            }}
          >
            <Text style={style.formButtonText}>Vérifier l'addresse mail</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View style={style.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={style.modalContainer}>
                  <Text style={style.modalTitle}>
                    Adresse mail déjà enregistrée
                  </Text>
                  <TouchableOpacity
                    style={style.modalButton}
                    onPress={() => submitModal(0)}
                  >
                    <Text style={style.modalButtonText}>
                      Saisir le code reçu
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={style.modalButton}
                    onPress={() => submitModal(1)}
                  >
                    <Text style={style.modalButtonText}>
                      Générer un nouveau code
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
      <Button title={'dev submit'} onPress={() => submitModal(0)} />
      <Button title={'dev errors'} onPress={() => console.log(errors)} />
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0ae',
  },
  modalContainer: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: 'white',
    borderRadius: 21,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: '#707070',
    alignSelf: 'center',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#FF6464',
    padding: 12,
    borderRadius: 21,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

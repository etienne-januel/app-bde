import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';

import Authenticator from './components/Authenticator/Authenticator';
import Home from './components/Home/Home';

export default App = () => {
  const [userInfo, setUserInfo] = useState({
    id: '',
    mail: '',
    username: '',
    firstname: '',
    lastname: '',
    birthdate: '',
  });
  const [isLogged, setLogged] = useState(false);

  fetchUserInfo = (type, data) => {
    if (type == 'jwt') {
      let decoded = jwtDecode(data);
      let decodedUser = decoded.data;

      setUserInfo({
        id: decodedUser.id,
        mail: decodedUser.mail,
        username: decodedUser.mail.split('@')[0],
        firstname: decodedUser.firstname,
        lastname: decodedUser.lastname,
        birthdate: decodedUser.birth_date,
      });

      setLogged(true);
    }
    if (type == 'flat') {
      setUserInfo(data);
    }
    if (type == 'debug') {
      console.log('debug');
      console.log(data);
    }
  };

  return isLogged ? (
    <Home userInfo={userInfo} />
  ) : (
    <Authenticator userInfo={userInfo} fetchUserInfo={fetchUserInfo} />
  );
};

import React from 'react';
import { TouchableOpacity } from 'react-native';

import ArrowLeftSvg from './images/arrow-left.svg';

export const ArrowLeftButton = (navigation) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <ArrowLeftSvg width={24} height={24} />
    </TouchableOpacity>
  );
};

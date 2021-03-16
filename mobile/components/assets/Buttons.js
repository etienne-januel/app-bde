import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import VisibilityOnSvg from './images/visibility-on.svg';
import VisibilityOffSvg from './images/visibility-off.svg';

export const Visibility = (props) => {
  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => {
        props.setVisibility(!props.visibility);
      }}
    >
      {props.visibility ? (
        <VisibilityOnSvg width={24} height={24} />
      ) : (
        <VisibilityOffSvg width={24} height={24} />
      )}
    </TouchableOpacity>
  );
};

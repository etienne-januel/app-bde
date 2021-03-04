import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';

const FadingDot = (props) => {
  // const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for top: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(props.animationRef, {
          toValue: 1,
          duration: 600 - props.animationDelay,
          delay: props.animationDelay,
          useNativeDriver: true,
        }),
        Animated.timing(props.animationRef, {
          toValue: .2,
          duration: 200,
          useNativeDriver: true,
        })
        
      ])
    ).start();
  }, [props.animationRef]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: props.animationRef // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export const Loader = () => {
  const fade1Anim = useRef(new Animated.Value(.2)).current;
  const fade2Anim = useRef(new Animated.Value(.2)).current;
  const fade3Anim = useRef(new Animated.Value(.2)).current;
  return (
    <View style={style.container}>
      <FadingDot style={style.dot} animationRef={fade1Anim} animationDelay={0}/>
      <FadingDot style={style.dot} animationRef={fade2Anim} animationDelay={200}/>
      <FadingDot style={style.dot} animationRef={fade3Anim} animationDelay={400}/>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 32,
    height: '100%',
    marginRight: 4
  },
  dot: {
    backgroundColor: '#664BFB',
    padding: 4,
    width: 8,
    height: 8,
    borderRadius: 8,
  },
});

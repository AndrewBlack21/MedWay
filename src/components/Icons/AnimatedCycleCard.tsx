import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleProp, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./AnimatedCycleCardStyle";

interface Props {
  icon: object;
  number: number;
  label: string;
  backgroundColor: string;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedCycleCard({
  icon,
  number,
  label,
  backgroundColor,
  delay = 0,
  style,
}: Props) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.wrapper, style, { opacity, transform: [{ translateY }] }]}
    >
      <View style={[styles.card, { backgroundColor }]}>
        <LottieView
          source={icon}
          autoPlay
          loop
          speed={0.7}
          style={styles.lottie}
        />
        <View>
          <Text style={styles.number}>{number}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

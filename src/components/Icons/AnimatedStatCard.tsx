import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import LottieView from "lottie-react-native";
import styles from "./AnimatedStatCardStyle";

interface Props {
  label: string;
  value: number | string;
  sublabel?: string;
  badge?: string;
  lottieSource: object;
  backgroundColor: string;
  onPress?: () => void;
  lottieSize?: number;
  lottieSpeed?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedStatCard({
  label,
  value,
  sublabel,
  badge,
  lottieSource,
  backgroundColor,
  onPress,
  lottieSize = 52,
  lottieSpeed = 0.8,
  style,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function handlePressIn() {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>{label}</Text>
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            speed={lottieSpeed}
            style={{ width: lottieSize, height: lottieSize }}
          />
        </View>
        <Text style={styles.cardNumber}>{value}</Text>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

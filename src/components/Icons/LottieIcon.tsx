import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./LottieIconStyle";

interface Props {
  source: object;
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  backgroundColor?: string;
  borderRadius?: number;
}

export default function LottieIcon({
  source,
  size = 48,
  autoPlay = true,
  loop = true,
  speed = 1,
  backgroundColor,
  borderRadius = 14,
}: Props) {
  const ref = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay) {
      ref.current?.play();
    }
  }, [autoPlay]);

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: backgroundColor ?? "transparent",
        },
      ]}
    >
      <LottieView
        ref={ref}
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={{ width: 44, height: 44 }}
      />
    </View>
  );
}

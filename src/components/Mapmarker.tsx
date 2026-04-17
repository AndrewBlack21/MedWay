import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Doctor } from "../types";

interface Props {
  doctor: Doctor;
  order?: number;
  onPress?: (doctor: Doctor) => void;
}

export default function MapMarker({ doctor, order, onPress }: Props) {
  const hasOrder = order !== undefined;
  const [tracked, setTracked] = useState(true);

  return (
    <Marker
      coordinate={{ latitude: doctor.lat, longitude: doctor.lng }}
      onPress={() => onPress?.(doctor)}
      tracksViewChanges={tracked}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={[styles.pin, hasOrder && styles.pinOrdered]}
        onLayout={() => {
          if (tracked) setTracked(false);
        }}
      >
        <Text style={styles.pinText}>{hasOrder ? order : "+"}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FF4B8B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pinOrdered: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF4B8B",
  },
  pinText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});

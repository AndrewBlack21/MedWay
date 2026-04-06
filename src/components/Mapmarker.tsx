import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { Doctor } from "../types";

interface Props {
  doctor: Doctor;
  order?: number; // número da parada no roteiro — ausente no mapa geral
  onPress?: (doctor: Doctor) => void;
}

export default function MapMarker({ doctor, order, onPress }: Props) {
  // Cor do pin muda quando tem ordem (tela de roteiro) vs sem ordem (mapa geral)
  const hasOrder = order !== undefined;

  return (
    <Marker
      coordinate={{ latitude: doctor.lat, longitude: doctor.lng }}
      onPress={() => onPress?.(doctor)}
      // tracksViewChanges=false melhora performance quando há muitos pins
      // o pin não precisa re-renderizar após o mount
      tracksViewChanges={false}
    >
      <View style={[styles.pin, hasOrder && styles.pinOrdered]}>
        <Text style={styles.pinText}>{hasOrder ? order : "+"}</Text>
      </View>

      {/* Callout sem tooltip — mais estável no Android */}
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.calloutName}>{doctor.name}</Text>
          <Text style={styles.calloutSpecialty}>{doctor.specialty}</Text>
          {doctor.hours ? (
            <Text style={styles.calloutHours}>Atend.: {doctor.hours}</Text>
          ) : null}
          <Text style={styles.calloutAddress} numberOfLines={2}>
            {doctor.address}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1D9E75",
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
  // Pin com número de ordem fica um pouco maior para o número caber bem
  pinOrdered: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0F6E56",
  },
  pinText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  callout: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: 220,
  },
  calloutName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  calloutSpecialty: {
    fontSize: 12,
    color: "#1D9E75",
    fontWeight: "600",
    marginBottom: 4,
  },
  calloutHours: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  calloutAddress: {
    fontSize: 11,
    color: "#888",
    lineHeight: 15,
  },
});

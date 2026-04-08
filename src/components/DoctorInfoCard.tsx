import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Doctor } from "../types";

interface Props {
  doctor: Doctor | null;
  onClose: () => void;
}

export default function DoctorInfoCard({ doctor, onClose }: Props) {
  if (!doctor) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {doctor.specialty.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.name} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.addressLabel}>Endereço</Text>
        <Text style={styles.address}>{doctor.address}</Text>

        {doctor.hours ? (
          <>
            <Text style={styles.addressLabel}>Atendimento</Text>
            <Text style={styles.address}>{doctor.hours}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E1F5EE",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  badgeText: {
    color: "#0F6E56",
    fontWeight: "700",
    fontSize: 13,
  },
  titleBlock: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 12,
    color: "#1D9E75",
    fontWeight: "600",
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: "#aaa",
    fontWeight: "500",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
    marginTop: 6,
  },
  address: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
});

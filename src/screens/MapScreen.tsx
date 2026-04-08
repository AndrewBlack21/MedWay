import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import styles from "./Mapstyle";

import { Doctor } from "../types";
import { getDoctors } from "../services/doctors";
import MapMarker from "../components/Mapmarker";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Carrega médicos e localização em paralelo de forma independente
      // requestLocation não lança erro — trata internamente e só seta o state se ok
      const [data] = await Promise.all([getDoctors(), requestLocation()]);
      setDoctors(data);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function requestLocation(): Promise<void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch {
      // GPS negado ou indisponível — app continua funcionando sem localização
    }
  }

  function fitMapToDoctors() {
    if (!doctors.length) return;
    mapRef.current?.fitToCoordinates(
      doctors.map((d) => ({ latitude: d.lat, longitude: d.lng })),
      {
        edgePadding: { top: 60, right: 40, bottom: 40, left: 40 },
        animated: true,
      },
    );
  }

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }
    : {
        latitude: -15.78,
        longitude: -47.93,
        latitudeDelta: 20,
        longitudeDelta: 20,
      };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        onMapReady={fitMapToDoctors}
      >
        {doctors.map((doc) => (
          <MapMarker key={doc.id} doctor={doc} />
        ))}
      </MapView>

      <TouchableOpacity style={styles.fitBtn} onPress={fitMapToDoctors}>
        <Text style={styles.fitBtnText}>Ver todos</Text>
      </TouchableOpacity>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {doctors.length} médico{doctors.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Card de info — aparece sobre o mapa ao clicar no pin */}
      <DoctorInfoCard
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />
    </View>
  );
}

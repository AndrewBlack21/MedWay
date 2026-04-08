import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  TextInput,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./Routescreenstyle";

import { Doctor, RouteResult, Coordinates } from "../types";
import { getDoctors } from "../services/doctors";
import { generateRoute, calcDistancesFromStart } from "../services/routing";
import { geocodeAddress } from "../services/geocoding";
import MapMarker from "../components/Mapmarker";

// Import Calender
import CheckInModal from "../components/CheckInModal";
import { VisitLog } from "../types";
import { getLogsByDate, upsertLog } from "../services/visitsLogs";

type DistanceInfo = {
  nearest: Doctor;
  farthest: Doctor;
  distances: Record<string, number>;
};

export default function RouteScreen() {
  const mapRef = useRef<MapView>(null);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);

  // Ponto de partida
  const [startAddress, setStartAddress] = useState("");
  const [startCoords, setStartCoords] = useState<Coordinates | null>(null);
  const [geocodingStart, setGeocodingStart] = useState(false);
  const [usingGPS, setUsingGPS] = useState(false);

  // Info de distâncias
  const [distanceInfo, setDistanceInfo] = useState<DistanceInfo | null>(null);

  // Calendario e Check-in
  const today = new Date().toISOString().split("T")[0];
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [filterSpecialty, setFilterSpecialty] = useState<string>("Todas");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [checkInDoctor, setCheckInDoctor] = useState<Doctor | null>(null);
  const [todayLogs, setTodayLogs] = useState<VisitLog[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      const doctors = await getDoctors();
      setAllDoctors(doctors);
      const specs = [
        "Todas",
        ...Array.from(new Set(doctors.map((d) => d.specialty))),
      ];
      setSpecialties(specs);
      const logs = await getLogsByDate(today);
      setTodayLogs(logs);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  const filteredDoctors = allDoctors.filter((d) => {
    if (excludedIds.has(d.id)) return false;
    if (filterSpecialty !== "Todas" && d.specialty !== filterSpecialty)
      return false;
    return true;
  });

  function toggleExclude(id: string) {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getLogForDoctor(doctorId: string): VisitLog | undefined {
    return todayLogs.find((l) => l.doctor_id === doctorId);
  }

  function onCheckInSaved() {
    getLogsByDate(today)
      .then(setTodayLogs)
      .catch(() => {});
  }

  async function useCurrentLocation() {
    setUsingGPS(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Ative a localização para usar o GPS como ponto de partida.",
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setStartCoords(coords);
      setStartAddress("Minha localização atual");

      // Já calcula distâncias com o GPS
      if (allDoctors.length > 0) {
        const info = calcDistancesFromStart(allDoctors, coords.lat, coords.lng);
        setDistanceInfo(info);
      }
    } catch (e: any) {
      Alert.alert("Erro ao obter localização", e.message);
    } finally {
      setUsingGPS(false);
    }
  }

  async function geocodeStart() {
    if (!startAddress.trim()) return;
    setGeocodingStart(true);
    try {
      const coords = await geocodeAddress(startAddress);
      setStartCoords(coords);

      if (allDoctors.length > 0) {
        const info = calcDistancesFromStart(allDoctors, coords.lat, coords.lng);
        setDistanceInfo(info);
      }
    } catch (e: any) {
      Alert.alert(
        "Endereço não encontrado",
        "Tente ser mais específico ou use o GPS.",
      );
      setStartCoords(null);
      setDistanceInfo(null);
    } finally {
      setGeocodingStart(false);
    }
  }

  async function handleGenerateRoute() {
    if (filteredDoctors.length === 0) {
      Alert.alert("Atenção", "Nenhum médico disponível com os filtros atuais.");
      return;
    }
    setLoading(true);
    try {
      const routeResult = await generateRoute(
        filteredDoctors, // <-- era allDoctors
        startCoords?.lat,
        startCoords?.lng,
      );
      setResult(routeResult);
      setTimeout(fitMap, 300);
    } catch (e: any) {
      Alert.alert("Erro ao gerar roteiro", e.message);
    } finally {
      setLoading(false);
    }
  }

  function fitMap() {
    if (!result?.stops.length) return;
    const coords = result.stops.map((s) => ({
      latitude: s.doctor.lat,
      longitude: s.doctor.lng,
    }));
    if (startCoords)
      coords.push({ latitude: startCoords.lat, longitude: startCoords.lng });
    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 60, right: 40, bottom: 40, left: 40 },
      animated: true,
    });
  }

  function openInMaps(doctor: Doctor) {
    const label = encodeURIComponent(doctor.name);
    const url =
      Platform.OS === "ios"
        ? `maps:0,0?q=${label}@${doctor.lat},${doctor.lng}`
        : `geo:${doctor.lat},${doctor.lng}?q=${doctor.lat},${doctor.lng}(${label})`;
    Linking.openURL(url);
  }

  function extractPolyline(): { latitude: number; longitude: number }[] {
    if (!result?.geojson) return [];
    try {
      const coords = (result.geojson.features[0]?.geometry as any)
        ?.coordinates as [number, number][];
      return coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
    } catch {
      return [];
    }
  }

  const polyline = extractPolyline();

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={!usingGPS}
        key={result ? "with-route" : "no-route"}
      >
        {/* Pin do ponto de partida */}
        {startCoords && (
          <Marker
            coordinate={{
              latitude: startCoords.lat,
              longitude: startCoords.lng,
            }}
            pinColor="#534AB7"
            title="Ponto de partida"
          />
        )}

        {result?.stops.map((stop) => (
          <MapMarker
            key={stop.doctor.id}
            doctor={stop.doctor}
            order={stop.order}
          />
        ))}

        {/* Médicos antes de gerar — sem número */}
        {!result &&
          allDoctors.map((doc) => <MapMarker key={doc.id} doctor={doc} />)}

        {polyline.length > 1 && (
          <Polyline
            coordinates={polyline}
            strokeColor="#1D9E75"
            strokeWidth={3}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* Painel inferior */}
      <View style={styles.panel}>
        {/* Filtro */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={styles.filterToggleBtn}
            onPress={() => setShowFilters((v) => !v)}
          >
            <Text style={styles.filterToggleText}>
              {showFilters ? "▲ Filtros" : "▼ Filtros"}
            </Text>
          </TouchableOpacity>
          {excludedIds.size > 0 && (
            <Text style={styles.filterBadge}>
              {excludedIds.size} excluidos(s)
            </Text>
          )}
        </View>
        {/* Filtro */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Especialidade</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {specialties.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.chip,
                  filterSpecialty === s && styles.chipActive,
                ]}
                onPress={() => {
                  setFilterSpecialty(s);
                  setResult(null);
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    filterSpecialty === s && styles.chipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Excluir do roteiro</Text>
          <ScrollView
            style={{ maxHeight: 180 }}
            showsVerticalScrollIndicator={false}
          >
            {allDoctors.map((d) => {
              const excluded = excludedIds.has(d.id);
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.excludeItem,
                    excluded && styles.excludeItemActive,
                  ]}
                  onPress={() => {
                    toggleExclude(d.id);
                    setResult(null);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.excludeName,
                        excluded && styles.excludeNameActive,
                      ]}
                    >
                      {d.name}
                    </Text>
                    <Text style={styles.excludeSpec}>{d.specialty}</Text>
                  </View>
                  <Text
                    style={[
                      styles.excludeIcon,
                      excluded && styles.excludeIconActive,
                    ]}
                  >
                    {excluded ? "✕" : "−"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* Seção ponto de partida */}
        <View style={styles.startSection}>
          <Text style={styles.sectionLabel}>Ponto de partida</Text>
          <View style={styles.startRow}>
            <TextInput
              style={styles.startInput}
              placeholder="Endereço ou use o GPS"
              placeholderTextColor="#aaa"
              value={startAddress}
              onChangeText={(v) => {
                setStartAddress(v);
                setStartCoords(null);
                setDistanceInfo(null);
              }}
              onSubmitEditing={geocodeStart}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.gpsBtn}
              onPress={useCurrentLocation}
              disabled={usingGPS}
            >
              {usingGPS ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.gpsBtnText}>GPS</Text>
              )}
            </TouchableOpacity>
            {startAddress.trim() && !startCoords && (
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={geocodeStart}
                disabled={geocodingStart}
              >
                {geocodingStart ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.searchBtnText}>OK</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Destaques de distância */}
          {distanceInfo && startCoords && (
            <View style={styles.distanceCards}>
              <View style={[styles.distCard, styles.distCardNearest]}>
                <Text style={styles.distCardLabel}>Mais próximo</Text>
                <Text style={styles.distCardName} numberOfLines={1}>
                  {distanceInfo.nearest.name}
                </Text>
                <Text style={styles.distCardKm}>
                  {distanceInfo.distances[distanceInfo.nearest.id]} km
                </Text>
              </View>
              <View style={[styles.distCard, styles.distCardFarthest]}>
                <Text style={styles.distCardLabel}>Mais distante</Text>
                <Text style={styles.distCardName} numberOfLines={1}>
                  {distanceInfo.farthest.name}
                </Text>
                <Text style={styles.distCardKm}>
                  {distanceInfo.distances[distanceInfo.farthest.id]} km
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Botão gerar roteiro */}
        {!result && (
          <TouchableOpacity
            style={styles.generateBtn}
            onPress={handleGenerateRoute}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateBtnText}>
                {startCoords ? "Gerar roteiro a partir daqui" : "Gerar roteiro"}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Lista de paradas */}
        {result && (
          <>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>Roteiro do dia</Text>
                <Text style={styles.panelSub}>
                  {result.stops.length} visitas · ~{result.total_distance_km} km
                  {startCoords ? " (incl. saída)" : ""}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.regenBtn}
                onPress={() => {
                  setResult(null);
                }}
              >
                <Text style={styles.regenText}>Refazer</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.stopsList}
              showsVerticalScrollIndicator={false}
            >
              {result.stops.map((stop) => {
                const log = getLogForDoctor(stop.doctor.id);
                return (
                  <TouchableOpacity
                    key={stop.doctor.id}
                    style={styles.stopItem}
                    onPress={() => openInMaps(stop.doctor)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.stopNumber,
                        stop.doctor.id === distanceInfo?.nearest.id &&
                          styles.stopNearest,
                        stop.doctor.id === distanceInfo?.farthest.id &&
                          styles.stopFarthest,
                      ]}
                    >
                      <Text style={styles.stopNumberText}>{stop.order}</Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopName}>{stop.doctor.name}</Text>
                      <Text style={styles.stopSpecialty}>
                        {stop.doctor.specialty}
                      </Text>
                      {stop.distance_from_prev_km !== undefined &&
                        stop.distance_from_prev_km > 0 && (
                          <Text style={styles.stopDist}>
                            +{stop.distance_from_prev_km} km
                          </Text>
                        )}
                      {log?.comment ? (
                        <Text style={styles.stopComment}>"{log.comment}"</Text>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.checkInBtn,
                        log?.status === "visited" && styles.checkInVisited,
                        log?.status === "not_visited" &&
                          styles.checkInNotVisited,
                      ]}
                      onPress={() => setCheckInDoctor(stop.doctor)}
                    >
                      <Text style={styles.checkInBtnText}>
                        {log?.status === "visited"
                          ? "✓"
                          : log?.status === "not_visited"
                            ? "✗"
                            : "•••"}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}
        <CheckInModal
          doctor={checkInDoctor}
          date={today}
          onClose={() => setCheckInDoctor(null)}
          onSaved={onCheckInSaved}
        />
      </View>
    </View>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { Doctor, RootStackParamList, CycleSummary } from "../types";
import { getDoctors, deleteDoctor } from "../services/doctors";
import { supabase } from "../lib/supabase";
import DoctorCard from "../components/Doctorcard";
import styles from "./Doctorslistcreenstyle";
import { getCycleSummaries } from "../services/cycleLogs";

type Nav = NativeStackNavigationProp<RootStackParamList, "DoctorsList">;

// Gera conteúdo CSV com separador ponto-e-vírgula (padrão BR para Excel)
function buildCsv(doctors: Doctor[]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = [
    "Nome",
    "Especialidade",
    "Endereço",
    "Horário de Atendimento",
  ].join(";");
  const rows = doctors.map((d) =>
    [
      escape(d.name),
      escape(d.specialty),
      escape(d.address),
      escape(d.hours ?? ""),
    ].join(";"),
  );
  return [header, ...rows].join("\n");
}

export default function DoctorsListScreen() {
  const navigation = useNavigation<Nav>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [cycleSummaries, setCycleSummaries] = useState<
    Record<string, CycleSummary>
  >({});

  async function loadDoctors() {
    try {
      const data = await getDoctors();
      setDoctors(data);
      const summaries = await getCycleSummaries(data.map((d) => d.id));
      data.forEach((d) => {
        if (summaries[d.id]) summaries[d.id].target = d.cycle_target ?? 1;
      });
      setCycleSummaries(summaries);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadDoctors();
    }, []),
  );

  async function handleDelete(id: string) {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (e: any) {
      Alert.alert("Erro ao excluir", e.message);
    }
  }

  function handleEdit(doctor: Doctor) {
    navigation.navigate("DoctorForm", { doctor });
  }

  // async function handleLogout() {
  //   await supabase.auth.signOut();
  // }

  async function handleExportExcel() {
    if (doctors.length === 0) {
      Alert.alert("Atenção", "Nenhum médico cadastrado para exportar.");
      return;
    }

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(
        "Não suportado",
        "Compartilhamento não está disponível neste dispositivo.",
      );
      return;
    }

    setExporting(true);
    try {
      const csv = buildCsv(doctors);
      // BOM UTF-8 garante que o Excel abre com acentos corretamente
      const bom = "\uFEFF";
      const content = bom + csv;

      const fileName = `medicos_${new Date().toISOString().slice(0, 10)}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Exportar lista de médicos",
        UTI: "public.comma-separated-values-text",
      });
    } catch (e: any) {
      Alert.alert("Erro ao exportar", e.message);
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de ações rápidas — linha 1 */}
      {/* <View style={styles.actions}> */}
      {/* Botao para ver o mapa na lista de medico */}
      {/* <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.actionBtnText}>Ver Mapa</Text>
        </TouchableOpacity> */}

      {/* Botao para ver o historico de visita */}
      {/* <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: "#EEF0FE", borderColor: "#AFA9EC" },
          ]}
          onPress={() => navigation.navigate("Calendar")}
        >
          <Text style={{ color: "#3C3489", fontWeight: "600", fontSize: 12 }}>
            📅 Histórico
          </Text>
        </TouchableOpacity> */}

      {/* Botao para gerar o roteiro */}
      {/* <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("Route")}
        >
          <Text style={styles.actionBtnText}>Gerar Roteiro</Text>
        </TouchableOpacity> */}
      {/* </View> */}
      {/* Barra de ações rápidas — linha 2 */}

      {/* Botao para importa os arquivos */}
      <View style={styles.actions}>
        {/* <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnImport]}
          onPress={() => navigation.navigate("Import")}
        >
          <Text style={styles.actionBtnImportText}>Importar Planilha</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnExport]}
          onPress={handleExportExcel}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#FF4B8B" />
          ) : (
            <Text style={styles.actionBtnExportText}>Exportar XLS</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            summary={cycleSummaries[item.id]}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDoctors();
            }}
            tintColor="#FF4B8B"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhum médico cadastrado ainda.
            </Text>
            <Text style={styles.emptyHint}>
              Toque no botão + para adicionar.
            </Text>
          </View>
        }
      />

      {/* Botao para adicionar mais medico  */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("DoctorForm", {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity> */}
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types";
import { parseSpreadsheet, ImportRow } from "../services/Importer";
import { createDoctor } from "../services/doctors";

type Nav = NativeStackNavigationProp<RootStackParamList, "Import">;
type RowStatus = "pending" | "importing" | "done" | "error";

interface RowState {
  row: ImportRow;
  status: RowStatus;
  error?: string;
}

export default function ImportScreen() {
  const navigation = useNavigation<Nav>();
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [rows, setRows] = useState<RowState[]>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handlePickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "text/plain", "*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setFileName(asset.name);
      setRows([]);
      setParseErrors([]);
      setDone(false);

      const preview = await parseSpreadsheet(asset.uri, asset.name);

      setParseErrors(preview.errors);

      if (preview.rows.length === 0) {
        Alert.alert(
          "Nenhum dado encontrado",
          preview.errors.join("\n") ||
            "Verifique se o arquivo está no formato correto.",
        );
        return;
      }

      setRows(preview.rows.map((row) => ({ row, status: "pending" })));
    } catch (e: any) {
      Alert.alert("Erro ao abrir arquivo", e.message);
    }
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setImporting(true);
    setDone(false);

    let successCount = 0;
    let errorCount = 0;

    const pending = rows
      .map((r, i) => ({ ...r, idx: i }))
      .filter((r) => r.status === "pending");

    for (const item of pending) {
      setRows((prev) =>
        prev.map((r, i) =>
          i === item.idx ? { ...r, status: "importing" } : r,
        ),
      );

      try {
        await createDoctor({
          name: item.row.name,
          specialty: item.row.specialty,
          address: item.row.address,
          hours: item.row.hours,
        });
        setRows((prev) =>
          prev.map((r, i) => (i === item.idx ? { ...r, status: "done" } : r)),
        );
        successCount++;
      } catch (e: any) {
        setRows((prev) =>
          prev.map((r, i) =>
            i === item.idx ? { ...r, status: "error", error: e.message } : r,
          ),
        );
        errorCount++;
      }

      // 1.2s entre geocodificações — respeita rate limit do Nominatim
      if (item !== pending[pending.length - 1]) {
        await new Promise((res) => setTimeout(res, 1200));
      }
    }

    setImporting(false);
    setDone(true);

    Alert.alert(
      "Importação concluída",
      `${successCount} médico${successCount !== 1 ? "s" : ""} importado${successCount !== 1 ? "s" : ""}.` +
        (errorCount > 0
          ? `\n${errorCount} com erro — veja os itens em vermelho.`
          : ""),
      [
        {
          text: "Ver médicos",
          onPress: () => navigation.navigate("DoctorsList"),
        },
        { text: "Fechar", style: "cancel" },
      ],
    );
  }

  const doneCount = rows.filter((r) => r.status === "done").length;
  const errorCount = rows.filter((r) => r.status === "error").length;
  const hasRows = rows.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Instruções */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Como preparar o arquivo</Text>
          <Text style={styles.infoStep}>1. Abra o Excel ou Google Sheets</Text>
          <Text style={styles.infoStep}>
            2. Use as colunas abaixo (cabeçalho na linha 1):
          </Text>
          <View style={styles.cols}>
            {["Nome *", "Especialidade", "Endereço *", "Horário"].map((c) => (
              <View key={c} style={styles.colBadge}>
                <Text style={styles.colBadgeText}>{c}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.infoStep}>
            3. Salve como <Text style={styles.infoBold}>.csv</Text> (Arquivo →
            Salvar como → CSV)
          </Text>
          <Text style={styles.infoHint}>
            * obrigatório · Separador vírgula ou ponto-e-vírgula
          </Text>
        </View>

        {/* Botão selecionar */}
        <TouchableOpacity
          style={styles.pickBtn}
          onPress={handlePickFile}
          disabled={importing}
        >
          <Text style={styles.pickBtnIcon}>📄</Text>
          <Text style={styles.pickBtnText}>
            {fileName || "Selecionar arquivo CSV"}
          </Text>
        </TouchableOpacity>

        {/* Erros de parsing */}
        {parseErrors.length > 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxTitle}>Avisos</Text>
            {parseErrors.map((e, i) => (
              <Text key={i} style={styles.errorBoxText}>
                • {e}
              </Text>
            ))}
          </View>
        )}

        {/* Preview */}
        {hasRows && (
          <>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {rows.length} médico{rows.length !== 1 ? "s" : ""} encontrado
                {rows.length !== 1 ? "s" : ""}
              </Text>
              {importing && (
                <Text style={styles.previewSub}>
                  {doneCount}/{rows.length} importados…
                </Text>
              )}
              {done && (
                <Text
                  style={[
                    styles.previewSub,
                    errorCount > 0 && { color: "#E24B4A" },
                  ]}
                >
                  {doneCount} ok{errorCount > 0 ? ` · ${errorCount} erro` : ""}
                </Text>
              )}
            </View>

            {rows.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.rowCard,
                  r.status === "done" && styles.rowDone,
                  r.status === "error" && styles.rowError,
                  r.status === "importing" && styles.rowImporting,
                ]}
              >
                <View style={styles.rowLeft}>
                  <Text style={styles.rowName}>{r.row.name}</Text>
                  <Text style={styles.rowSub}>
                    {r.row.specialty}
                    {r.row.hours ? ` · ${r.row.hours}` : ""}
                  </Text>
                  <Text style={styles.rowAddress} numberOfLines={1}>
                    {r.row.address}
                  </Text>
                  {r.status === "error" && r.error ? (
                    <Text style={styles.rowErrorMsg}>{r.error}</Text>
                  ) : null}
                </View>
                <View style={styles.rowStatus}>
                  {r.status === "importing" && (
                    <ActivityIndicator size="small" color="#1D9E75" />
                  )}
                  {r.status === "done" && (
                    <Text style={styles.statusDone}>✓</Text>
                  )}
                  {r.status === "error" && (
                    <Text style={styles.statusError}>✗</Text>
                  )}
                  {r.status === "pending" && (
                    <Text style={styles.statusPending}>{i + 1}</Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer com botão de importar */}
      {hasRows && !done && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.importBtn, importing && styles.importBtnDisabled]}
            onPress={handleImport}
            disabled={importing}
          >
            {importing ? (
              <View style={styles.importBtnRow}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.importBtnText}>
                  Importando {doneCount + errorCount}/{rows.length}…
                </Text>
              </View>
            ) : (
              <Text style={styles.importBtnText}>
                Importar {rows.length} médico{rows.length !== 1 ? "s" : ""}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.footerHint}>
            Cada endereço será geocodificado — pode levar alguns minutos
          </Text>
        </View>
      )}

      {done && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate("DoctorsList")}
          >
            <Text style={styles.doneBtnText}>Ver lista de médicos</Text>
          </TouchableOpacity>
          {errorCount > 0 && (
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setRows((prev) =>
                  prev.map((r) =>
                    r.status === "error"
                      ? { ...r, status: "pending", error: undefined }
                      : r,
                  ),
                );
                setDone(false);
              }}
            >
              <Text style={styles.retryBtnText}>
                Tentar novamente os {errorCount} com erro
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9f8" },
  content: { padding: 16 },
  infoBox: {
    backgroundColor: "#E1F5EE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#9FE1CB",
    gap: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F6E56",
    marginBottom: 2,
  },
  infoStep: { fontSize: 12, color: "#085041", lineHeight: 18 },
  infoBold: { fontWeight: "700" },
  cols: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginVertical: 4 },
  colBadge: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#5DCAA5",
  },
  colBadgeText: { fontSize: 12, color: "#0F6E56", fontWeight: "600" },
  infoHint: { fontSize: 11, color: "#1D9E75", marginTop: 2 },
  pickBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#1D9E75",
    borderStyle: "dashed",
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  pickBtnIcon: { fontSize: 28 },
  pickBtnText: { fontSize: 14, color: "#1D9E75", fontWeight: "600" },
  errorBox: {
    backgroundColor: "#FAECE7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F0997B",
    gap: 4,
  },
  errorBoxTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#993C1D",
    marginBottom: 4,
  },
  errorBoxText: { fontSize: 12, color: "#712B13", lineHeight: 18 },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  previewTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  previewSub: { fontSize: 12, color: "#1D9E75", fontWeight: "600" },
  rowCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  rowDone: { borderColor: "#9FE1CB", backgroundColor: "#F5FDF9" },
  rowError: { borderColor: "#F0997B", backgroundColor: "#FDF5F3" },
  rowImporting: { borderColor: "#1D9E75" },
  rowLeft: { flex: 1 },
  rowName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  rowSub: { fontSize: 12, color: "#1D9E75", marginBottom: 2 },
  rowAddress: { fontSize: 11, color: "#888" },
  rowErrorMsg: { fontSize: 11, color: "#E24B4A", marginTop: 4 },
  rowStatus: { marginLeft: 12, width: 28, alignItems: "center" },
  statusDone: { fontSize: 20, color: "#1D9E75", fontWeight: "700" },
  statusError: { fontSize: 20, color: "#E24B4A", fontWeight: "700" },
  statusPending: { fontSize: 13, color: "#aaa", fontWeight: "600" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    padding: 16,
    paddingBottom: 34,
    gap: 8,
  },
  importBtn: {
    backgroundColor: "#1D9E75",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  importBtnDisabled: { opacity: 0.7 },
  importBtnRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  importBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  footerHint: { fontSize: 11, color: "#aaa", textAlign: "center" },
  doneBtn: {
    backgroundColor: "#1D9E75",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  retryBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E24B4A",
  },
  retryBtnText: { color: "#E24B4A", fontWeight: "600", fontSize: 13 },
});

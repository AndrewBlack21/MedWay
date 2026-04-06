import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList, DoctorFormData } from "../types";
import { createDoctor, updateDoctor } from "../services/doctors";
import styles from "./Doctorformscreenstyle";

type Nav = NativeStackNavigationProp<RootStackParamList, "DoctorForm">;
type Route = RouteProp<RootStackParamList, "DoctorForm">;

const SPECIALTIES = [
  "Clínico Geral",
  "Cardiologista",
  "Dermatologista",
  "Endocrinologista",
  "Gastroenterologista",
  "Ginecologista",
  "Neurologista",
  "Oncologista",
  "Ortopedista",
  "Pediatra",
  "Psiquiatra",
  "Reumatologista",
  "Urologista",
];

export default function DoctorFormScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const editingDoctor = route.params?.doctor;
  const isEditing = !!editingDoctor;

  const [form, setForm] = useState<DoctorFormData>({
    name: editingDoctor?.name ?? "",
    specialty: editingDoctor?.specialty ?? "",
    address: editingDoctor?.address ?? "",
    hours: editingDoctor?.hours ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [showSpecialties, setShowSpecialties] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Editar Médico" : "Novo Médico",
    });
  }, [isEditing, navigation]);

  function setField(key: keyof DoctorFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      Alert.alert("Atenção", "Nome é obrigatório.");
      return;
    }
    if (!form.specialty.trim()) {
      Alert.alert("Atenção", "Especialidade é obrigatória.");
      return;
    }
    if (!form.address.trim()) {
      Alert.alert("Atenção", "Endereço é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Passa o endereço original para evitar geocoding desnecessário
        // quando o rep editar só nome ou horário sem mudar o endereço
        await updateDoctor(editingDoctor.id, form, editingDoctor.address);
      } else {
        await createDoctor(form);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert(
        "Erro ao salvar",
        e.message ?? "Verifique o endereço e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Nome completo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Dr. João Silva"
          placeholderTextColor="#aaa"
          value={form.name}
          onChangeText={(v) => setField("name", v)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Especialidade *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowSpecialties((v) => !v)}
          activeOpacity={0.7}
        >
          <Text style={form.specialty ? styles.inputText : styles.placeholder}>
            {form.specialty || "Selecione a especialidade"}
          </Text>
        </TouchableOpacity>
        {showSpecialties && (
          <View style={styles.dropdown}>
            {SPECIALTIES.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.dropdownItem}
                onPress={() => {
                  setField("specialty", s);
                  setShowSpecialties(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    form.specialty === s && styles.dropdownSelected,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Endereço completo *</Text>
        <Text style={styles.hint}>
          Inclua rua, número, bairro e cidade para melhor precisão
        </Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Av. Paulista, 1000, Bela Vista, São Paulo - SP"
          placeholderTextColor="#aaa"
          value={form.address}
          onChangeText={(v) => setField("address", v)}
          multiline
          numberOfLines={2}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Horário de atendimento</Text>
        <TextInput
          style={styles.input}
          placeholder="Seg-Sex 08h–12h / 14h–18h"
          placeholderTextColor="#aaa"
          value={form.hours}
          onChangeText={(v) => setField("hours", v)}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>Buscando endereço…</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "Salvar alterações" : "Cadastrar médico"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

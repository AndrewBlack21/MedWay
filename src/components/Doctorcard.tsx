import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Doctor } from "../types";
import styles from "./Doctorcardstyle";
import CycleDots from "./CycleDots";
import { CycleSummary } from "../types";

interface Props {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
  summary?: CycleSummary;
}

// Gera iniciais a partir das palavras do nome da especialidade
// "Clínico Geral" → "CG" | "Cardiologista" → "CA" | "Clínico Geral" !== "Cardiologista"
function getInitials(specialty: string): string {
  const words = specialty.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function DoctorCard({
  doctor,
  onEdit,
  onDelete,
  summary,
}: Props) {
  function confirmDelete() {
    Alert.alert("Excluir médico", `Deseja excluir ${doctor.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => onDelete(doctor.id),
      },
    ]);
  }

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{getInitials(doctor.specialty)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.address} numberOfLines={2}>
          {doctor.address}
        </Text>
        {doctor.hours ? (
          <Text style={styles.hours}>Atend.: {doctor.hours}</Text>
        ) : null}
        {summary && <CycleDots summary={summary} />}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(doctor)}>
          <Text style={styles.btnEditText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={confirmDelete}>
          <Text style={styles.btnDeleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

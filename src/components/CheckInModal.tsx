import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Doctor, VisitStatus } from "../types";
import { upsertLog } from "../services/visitsLogs";
import styles from "./CheckInModalStyle";

interface Props {
  doctor: Doctor | null;
  date: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function CheckInModal({
  doctor,
  date,
  onClose,
  onSaved,
}: Props) {
  const [status, setStatus] = useState<VisitStatus>("visited");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!doctor) return null;

  async function handleSave() {
    setLoading(true);
    try {
      await upsertLog(doctor!.id, date, status, comment.trim() || undefined);
      onSaved();
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>{doctor.name}</Text>
          <Text style={styles.subtitle}>{doctor.specialty}</Text>

          <Text style={styles.label}>Status da visita</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                status === "visited" && styles.statusVisited,
              ]}
              onPress={() => setStatus("visited")}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  status === "visited" && styles.statusVisitedText,
                ]}
              >
                ✓ Visitado
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                status === "not_visited" && styles.statusNotVisited,
              ]}
              onPress={() => setStatus("not_visited")}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  status === "not_visited" && styles.statusNotVisitedText,
                ]}
              >
                ✗ Não visitado
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Comentário (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Médico ausente, reagendado para..."
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Salvar check-in</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

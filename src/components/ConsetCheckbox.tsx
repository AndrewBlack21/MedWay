import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./ConsentCheckboxStyle";

interface Props {
  checked: boolean;
  onToggle: () => void;
  onPressTerms: () => void;
  onPressPrivacy: () => void;
}

export default function ConsetCheckbox({
  checked,
  onToggle,
  onPressTerms,
  onPressPrivacy,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.text}>
            Li e aceito os {""}
            <Text style={styles.link} onPress={onPressTerms}>
              Termo de Uso
            </Text>{" "}
            e a{" "}
            <Text style={styles.link} onPress={onPressPrivacy}>
              Politica de Privacidade
            </Text>{" "}
            (LGPD)
          </Text>
        </View>
      </TouchableOpacity>
      {checked && (
        <View style={styles.consentBadge}>
          <Text style={styles.consentBadgeText}>
            🔒 Consentimento registrado conforme LGPD — Lei nº 13.709/2018
          </Text>
        </View>
      )}
    </View>
  );
}

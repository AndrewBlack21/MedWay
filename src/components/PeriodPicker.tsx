import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { VisitPeriod } from "../types";
import styles from "./PeriodPickerStyle";

const OPTIONS: { key: VisitPeriod; label: string; icon: string }[] = [
  { key: "morning", label: "Manhã", icon: "🌅" },
  { key: "afternoon", label: "Tarde", icon: "🌇" },
  { key: "both", label: "Ambos", icon: "🕐" },
];

interface Props {
  selected: VisitPeriod;
  onChange: (period: VisitPeriod) => void;
}

export default function PeriodPicker({ selected, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map(({ key, label, icon }) => (
        <TouchableOpacity
          key={key}
          style={[styles.btn, selected === key && styles.btnActive]}
          onPress={() => onChange(key)}
        >
          <Text style={styles.icon}>{icon}</Text>
          <Text style={[styles.label, selected === key && styles.labelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

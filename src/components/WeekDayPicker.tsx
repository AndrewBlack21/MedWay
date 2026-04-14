import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WeekDay } from "../types";
import styles from "./WeekDayPickerStyle";

const DAY_LABELS: { key: WeekDay; label: string }[] = [
  { key: "monday", label: "Seg" },
  { key: "tuesday", label: "Ter" },
  { key: "wednesday", label: "Qua" },
  { key: "thursday", label: "Qui" },
  { key: "friday", label: "Sex" },
];

interface Props {
  selected: WeekDay[];
  onChange: (days: WeekDay[]) => void;
}

export default function WeekDayPicker({ selected, onChange }: Props) {
  function toggle(day: WeekDay) {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  }

  return (
    <View style={styles.row}>
      {DAY_LABELS.map(({ key, label }) => {
        const active = selected.includes(key);
        return (
          <TouchableOpacity
            key={key}
            style={[styles.dayBtn, active && styles.dayBtnActive]}
            onPress={() => toggle(key)}
          >
            <Text style={[styles.dayText, active && styles.dayTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

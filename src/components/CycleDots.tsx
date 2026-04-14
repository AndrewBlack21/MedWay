import React from "react";
import { View, Text } from "react-native";
import { CycleSummary } from "../types";
import styles from "./CycleDotsStyle";

interface Props {
  summary: CycleSummary;
}

export default function CycleDots({ summary }: Props) {
  const dots = Array.from({ length: summary.target }, (_, i) => {
    if (i < summary.visited) return "visited";
    if (i < summary.visited + summary.absent) return "absent";
    if (i < summary.visited + summary.absent + summary.failed) return "failed";
    return "pending";
  });

  const dotColor = (type: string) => {
    if (type === "visited") return "#1D9E75";
    if (type === "absent") return "#EF9F27";
    if (type === "failed") return "#E24B4A";
    return "#ddd";
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {dots.map((type, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: dotColor(type) }]}
          />
        ))}
      </View>
      <Text style={styles.label}>
        {summary.visited}/{summary.target} visitas no ciclo
      </Text>
    </View>
  );
}

import React from "react";
import { ScrollView, View } from "react-native";
import VisitCalendar from "../components/VisitCalendar";
import styles from "./CalendarScreenStyle";

export default function CalendarScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <VisitCalendar />
      </View>
    </ScrollView>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getMarkedDates, getLogsByDate } from "../services/visitsLogs";
import { getDoctors } from "../services/doctors";
import { VisitLog, Doctor } from "../types";
import styles from "./VisitCalendarStyle";

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface Props {
  onSelectDay?: (date: string, logs: VisitLog[], doctors: Doctor[]) => void;
}

export default function VisitCalendar({ onSelectDay }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [marked, setMarked] = useState<
    Record<string, { visited: number; not_visited: number }>
  >({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayLogs, setDayLogs] = useState<VisitLog[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDay, setLoadingDay] = useState(false);

  const loadMonth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMarkedDates(year, month);
      setMarked(data);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => {});
  }, []);

  function prevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
  }

  function nextMonth() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
  }

  async function handleSelectDay(day: number) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setLoadingDay(true);
    try {
      const logs = await getLogsByDate(dateStr);
      setDayLogs(logs);
      onSelectDay?.(dateStr, logs, doctors);
    } finally {
      setLoadingDay(false);
    }
  }

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function dotColor(day: number) {
    const d = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const m = marked[d];
    if (!m) return null;
    if (m.visited > 0 && m.not_visited === 0) return "#1D9E75";
    if (m.not_visited > 0 && m.visited === 0) return "#E24B4A";
    return "#EF9F27";
  }

  return (
    <View style={styles.container}>
      {/* Header navegação */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={prevMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTHS[month - 1]} {year}
        </Text>
        <TouchableOpacity
          onPress={nextMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Dias da semana */}
      <View style={styles.weekRow}>
        {DAYS.map((d, i) => (
          <Text key={i} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Grid */}
      {loading ? (
        <ActivityIndicator color="#1D9E75" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.grid}>
          {cells.map((day, i) => {
            if (!day) return <View key={i} style={styles.cell} />;
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() + 1 &&
              year === today.getFullYear();
            const isSelected = dateStr === selectedDate;
            const dot = dotColor(day);

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.cell,
                  isSelected && styles.cellSelected,
                  isToday && styles.cellToday,
                ]}
                onPress={() => handleSelectDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isToday && !isSelected && styles.dayTextToday,
                  ]}
                >
                  {day}
                </Text>
                {dot && <View style={[styles.dot, { backgroundColor: dot }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Legenda */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#1D9E75" }]} />
          <Text style={styles.legendText}>Visitados</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#E24B4A" }]} />
          <Text style={styles.legendText}>Não visitados</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#EF9F27" }]} />
          <Text style={styles.legendText}>Misto</Text>
        </View>
      </View>

      {/* Logs do dia selecionado */}
      {selectedDate && (
        <View style={styles.dayDetail}>
          <Text style={styles.dayDetailTitle}>
            {selectedDate.split("-").reverse().join("/")}
          </Text>
          {loadingDay ? (
            <ActivityIndicator color="#1D9E75" />
          ) : dayLogs.length === 0 ? (
            <Text style={styles.emptyDay}>Nenhuma visita registrada.</Text>
          ) : (
            <ScrollView
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
            >
              {dayLogs.map((log) => {
                const doc = doctors.find((d) => d.id === log.doctor_id);
                return (
                  <View key={log.id} style={styles.logItem}>
                    <View
                      style={[
                        styles.logDot,
                        {
                          backgroundColor:
                            log.status === "visited" ? "#1D9E75" : "#E24B4A",
                        },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.logName}>{doc?.name ?? "—"}</Text>
                      <Text style={styles.logSpecialty}>
                        {doc?.specialty ?? ""}
                      </Text>
                      {log.comment ? (
                        <Text style={styles.logComment}>"{log.comment}"</Text>
                      ) : null}
                    </View>
                    <Text style={styles.logStatus}>
                      {log.status === "visited" ? "✓" : "✗"}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

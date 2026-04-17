import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getMarkedDates, getLogsByDate } from "../services/visitsLogs";
import { getDoctors } from "../services/doctors";
import { VisitLog, Doctor } from "../types";
import styles from "./VisitCalendarStyle";

// Configuração para português
LocaleConfig.locales["pt-br"] = {
  monthNames: [
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
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

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

  const [selected, setSelected] = useState<string | null>(null);
  const [dayLogs, setDayLogs] = useState<VisitLog[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDay, setLoadingDay] = useState(false);

  const loadMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const data = await getMarkedDates(y, m);
      setMarked(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDoctorsList = useCallback(async () => {
    try {
      const docs = await getDoctors();
      setDoctors(docs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadDoctorsList();
  }, [loadDoctorsList]);

  useEffect(() => {
    loadMonth(year, month);
  }, [year, month, loadMonth]);

  async function handleDayPress(dateString: string) {
    setSelected(dateString);
    setLoadingDay(true);
    try {
      const logs = await getLogsByDate(dateString);
      setDayLogs(logs);
      onSelectDay?.(dateString, logs, doctors);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDay(false);
    }
  }

  // Prepara os dados no formato exigido pelo react-native-calendars
  const formattedMarkedDates: any = {};
  Object.keys(marked).forEach((date) => {
    const dots = [];
    if (marked[date].visited > 0)
      dots.push({ key: "visited", color: "#1D9E75" });
    if (marked[date].not_visited > 0)
      dots.push({ key: "not_visited", color: "#E24B4A" });
    formattedMarkedDates[date] = { dots };
  });

  if (selected) {
    formattedMarkedDates[selected] = {
      ...formattedMarkedDates[selected],
      selected: true,
      selectedColor: "#E1F5EE",
      selectedTextColor: "#1D9E75",
    };
  }

  return (
    <View style={styles.container}>
      {loading && !selected ? (
        <ActivityIndicator
          size="large"
          color="#1D9E75"
          style={{ padding: 20 }}
        />
      ) : (
        <Calendar
          markingType={"multi-dot"}
          markedDates={formattedMarkedDates}
          onDayPress={(day: any) => handleDayPress(day.dateString)}
          onMonthChange={(monthData: any) => {
            setYear(monthData.year);
            setMonth(monthData.month);
            setSelected(null);
            setDayLogs([]);
          }}
          theme={{
            todayTextColor: "#1D9E75",
            arrowColor: "#1D9E75",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            dotStyle: { width: 5, height: 5, borderRadius: 3 },
          }}
        />
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#1D9E75" }]} />
          <Text style={styles.legendText}>Visitado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#E24B4A" }]} />
          <Text style={styles.legendText}>Não Visitado</Text>
        </View>
      </View>

      {selected && (
        <View style={styles.dayDetail}>
          <Text style={styles.dayDetailTitle}>
            Visitas em {selected.split("-").reverse().join("/")}
          </Text>

          {loadingDay ? (
            <ActivityIndicator size="small" color="#1D9E75" />
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

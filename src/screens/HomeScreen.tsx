import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { getHomeSummary, HomeSummary } from "../services/homeSummary";
import { supabase } from "../lib/supabase";
import styles from "./HomeScreenStyle";

// Animação
import AnimatedStatCard from "../components/Icons/AnimatedStatCard";
import AnimatedCycleCard from "../components/Icons/AnimatedCycleCard";
import AnimatedQuickCard from "../components/Icons/AnimatedQuickCard";

const anim = {
  doctor: require("../../assets/animations/doctor.json"),
  map: require("../../assets/animations/map.json"),
  check: require("../../assets/animations/check.json"),
  pending: require("../../assets/animations/pending.json"),
  history: require("../../assets/animations/history.json"),
  cycle: require("../../assets/animations/cycle.json"),
  route: require("../../assets/animations/route.json"),
};

type Nav = NativeStackNavigationProp<RootStackParamList, "Home">;

const QUICK_ACCESS = [
  {
    id: "cycle",
    title: "Ciclo de Visitas",
    subtitle: "Acompanhar progresso trimestral",
    color: "#9B6FE8",
    source: anim.cycle,
    route: "DoctorsList",
    delay: 200,
  },
  {
    id: "route",
    title: "Roteiro do Dia",
    subtitle: "Ver agenda de hoje",
    color: "#1D9E75",
    source: anim.route,
    route: "Route",
    delay: 300,
  },
];

const FAB_ACTIONS = [
  {
    id: "import",
    label: "Importar Planilha",
    icon: "📥",
    color: "#FF4B8B",
    route: "Import",
  },
  {
    id: "route",
    label: "Gerar Roteiro",
    icon: "🗺️",
    color: "#9B6FE8",
    route: "Route",
  },
  {
    id: "export",
    label: "Exportar Planilha",
    icon: "📤",
    color: "#EF9F27",
    route: "DoctorsList",
  },
  {
    id: "add",
    label: "Adicionar Médico",
    icon: "👨‍⚕️",
    color: "#1D9E75",
    route: "DoctorForm",
  },
  {
    id: "privacy",
    label: "Privacidade e LGPD",
    icon: "🔒",
    // subtitle: "Gerencie seus dados e consentimento",
    color: "#9B6FE8",
    source: anim.cycle,
    route: "Privacy",
    delay: 400,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [userName, setUserName] = useState("Usuário");

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    try {
      setLoading(true);
      const [sum, { data: userData }] = await Promise.all([
        getHomeSummary(),
        supabase.auth.getUser(),
      ]);
      setSummary(sum);
      if (userData.user?.email) {
        setUserName(userData.user.email.split("@")[0]);
      }
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFabAction(route: string) {
    setFabOpen(false);
    setTimeout(() => {
      if (route === "DoctorForm") {
        (navigation as any).navigate("DoctorForm", {});
      } else {
        (navigation as any).navigate(route);
      }
    }, 200);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>MEDWAY</Text>
          <Text style={styles.headerSub}>Seu assistente de visitas</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saudação */}
        <Text style={styles.greeting}>Olá, {userName}! 👋</Text>
        <Text style={styles.greetingSub}>Veja seu resumo de visitas hoje</Text>

        {/* Cards principais */}
        {loading ? (
          <ActivityIndicator color="#FF4B8B" style={{ marginVertical: 24 }} />
        ) : (
          <>
            <View style={styles.cardsRow}>
              {/* Card Médicos - Agora usando APENAS o componente animado */}
              <AnimatedStatCard
                label="MÉDICOS"
                value={summary?.totalDoctors ?? 0}
                badge={`✓ ${summary?.completedCycle ?? 0} ciclo completo`}
                sublabel="Cadastrados"
                lottieSource={anim.doctor}
                backgroundColor="#FF4B8B"
                onPress={() => navigation.navigate("DoctorsList")}
                lottieSpeed={0.5}
              />

              {/* Card Mapa - Agora usando APENAS o componente animado */}
              <AnimatedStatCard
                label="MAPA"
                value={summary?.todayVisits ?? 0}
                sublabel="Visitas hoje"
                lottieSource={anim.map}
                backgroundColor="#3B82F6"
                onPress={() => navigation.navigate("Map")}
                lottieSpeed={0.8}
                lottieSize={70}
              />
            </View>

            {/* Cards ciclo - Limpos, usando apenas a animação */}
            <View style={styles.cycleRow}>
              <AnimatedCycleCard
                icon={anim.check}
                number={summary?.completedCycle ?? 0}
                label="Ciclo completo"
                backgroundColor="#E1F5EE"
                delay={100}
              />
              <AnimatedCycleCard
                icon={anim.pending}
                number={summary?.pendingCycle ?? 0}
                label="Pendentes"
                backgroundColor="#FAEEDA"
                delay={200}
              />
            </View>
          </>
        )}

        {/* Acesso Rápido - Usando o AnimatedQuickCard! */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        {QUICK_ACCESS.map((item) => (
          <AnimatedQuickCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            lottieSource={item.source}
            accentColor={item.color}
            delay={item.delay}
            onPress={() => navigation.navigate(item.route as any)}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB overlay */}
      {fabOpen && (
        <TouchableOpacity
          style={styles.fabOverlay}
          onPress={() => setFabOpen(false)}
          activeOpacity={1}
        />
      )}

      {/* FAB actions */}
      {fabOpen && (
        <View style={styles.fabActions}>
          {FAB_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.fabActionItem}
              onPress={() => handleFabAction(action.route)}
            >
              <Text style={styles.fabActionLabel}>{action.label}</Text>
              <View
                style={[
                  styles.fabActionIcon,
                  { backgroundColor: action.color },
                ]}
              >
                <Text style={styles.fabActionIconText}>{action.icon}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* FAB principal */}
      <TouchableOpacity
        style={[styles.fab, fabOpen && styles.fabOpen]}
        onPress={() => setFabOpen((v) => !v)}
        activeOpacity={0.9}
      >
        <Text style={styles.fabIcon}>{fabOpen ? "✕" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
}

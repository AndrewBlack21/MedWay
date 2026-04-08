import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";
import { RootStackParamList } from "../types";

import LoginScreen from "../screens/Loginscreen";
import DoctorsListScreen from "../screens/Doctorslistcreen";
import DoctorFormScreen from "../screens/Doctorformscreen";
import MapScreen from "../screens/MapScreen";
import RouteScreen from "../screens/Routescreen";
import ImportScreen from "../screens/Importscreen";
import CalendarScreen from "../screens/CalendarScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerOptions = {
  headerStyle: { backgroundColor: "#1D9E75" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "600" as const },
  headerBackTitle: "Voltar",
};

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerOptions}>
        {!session ? (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="DoctorsList"
              component={DoctorsListScreen}
              options={{ title: "Meus Médicos" }}
            />
            <Stack.Screen
              name="DoctorForm"
              component={DoctorFormScreen}
              options={{ title: "Cadastrar Médico" }}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{ title: "Historico de Visitas" }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ title: "Mapa de Médicos" }}
            />
            <Stack.Screen
              name="Route"
              component={RouteScreen}
              options={{ title: "Roteiro do Dia" }}
            />
            <Stack.Screen
              name="Import"
              component={ImportScreen}
              options={{ title: "Importar Planilha" }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";
import styles from "./Loginstyle";
import ConsentCheckbox from "../components/ConsetCheckbox";
import LegalModal from "../components/LegalModal";
import { TERMS_OF_USE, PRIVACY_POLICY } from "../constants/legalTexts";
import { saveConsent } from "../services/consent";
import { validateEmail, validatePassword } from "../utils/validation";
import {
  checkRateLimit,
  resetRateLimit,
  formatWaitTime,
} from "../utils/rateLimiter";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  async function handleAuth() {
    // Validação de campos
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("E-mail inválido", "Digite um e-mail válido.");
      return;
    }

    // Consentimento obrigatório no cadastro
    if (isRegister && !consentAccepted) {
      Alert.alert(
        "Consentimento necessário",
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar uma conta.",
      );
      return;
    }

    // Rate limiting
    const limit = checkRateLimit("login", email.toLowerCase());
    if (!limit.allowed) {
      Alert.alert(
        "Conta temporariamente bloqueada",
        `Muitas tentativas. Aguarde ${formatWaitTime(limit.waitSeconds!)} e tente novamente.`,
      );
      return;
    }

    // Validação de senha forte apenas no cadastro
    if (isRegister) {
      const pwValidation = validatePassword(password);
      if (!pwValidation.valid) {
        Alert.alert("Senha fraca", pwValidation.errors.join("\n"));
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        await saveConsent();
        Alert.alert(
          "Conta criada!",
          "Verifique seu e-mail para confirmar o cadastro.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        resetRateLimit("login", email.toLowerCase());
      }
    } catch (e: any) {
      Alert.alert("Erro", e.message ?? "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image
              source={require("../../assets/medway.png")}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.subtitle}>Gestão de visitas</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder={isRegister ? "Mínimo 8 caracteres" : "Sua senha"}
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Consentimento LGPD — só no cadastro */}
          {isRegister && (
            <ConsentCheckbox
              checked={consentAccepted}
              onToggle={() => setConsentAccepted((v) => !v)}
              onPressTerms={() => setShowTerms(true)}
              onPressPrivacy={() => setShowPrivacy(true)}
            />
          )}

          <TouchableOpacity
            style={[
              styles.button,
              isRegister && !consentAccepted && { opacity: 0.6 },
            ]}
            onPress={handleAuth}
            disabled={loading || (isRegister && !consentAccepted)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegister ? "Criar conta" : "Entrar"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsRegister((v) => !v);
              setConsentAccepted(false);
            }}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>
              {isRegister
                ? "Já tenho conta — Entrar"
                : "Não tenho conta — Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modais legais */}
      <LegalModal
        visible={showTerms}
        title="Termos de Uso"
        content={TERMS_OF_USE}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setConsentAccepted(true);
          setShowTerms(false);
        }}
        acceptLabel="Li e aceito os Termos"
      />
      <LegalModal
        visible={showPrivacy}
        title="Política de Privacidade"
        content={PRIVACY_POLICY}
        onClose={() => setShowPrivacy(false)}
        onAccept={() => {
          setConsentAccepted(true);
          setShowPrivacy(false);
        }}
        acceptLabel="Li e aceito a Política"
      />
    </KeyboardAvoidingView>
  );
}

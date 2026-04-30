import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PRIVACY_POLICY, TERMS_OF_USE } from "../constants/legalTexts";
import { getConsentRecord, revokeConsent } from "../services/consent";
import LegalModal from "../components/LegalModal";
import styles from "./PrivacyScreenStyle";

export default function PrivacyScreen() {
  const [consentRecord, setConsentRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    loadConsent();
  }, []);

  async function loadConsent() {
    const record = await getConsentRecord();
    setConsentRecord(record);
    setLoading(false);
  }

  function handleRevoke() {
    Alert.alert(
      "Revogar Consentimento",
      "Ao revogar, seus dados serão excluídos em até 30 dias e sua conta será encerrada. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Revogar",
          style: "destructive",
          onPress: async () => {
            await revokeConsent();
            Alert.alert(
              "Consentimento revogado",
              "Seus dados serão removidos em até 30 dias. Entraremos em contato pelo e-mail cadastrado.",
            );
          },
        },
      ],
    );
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF4B8B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status do consentimento */}
      <View style={styles.consentCard}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentIcon}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.consentTitle}>Seu Consentimento LGPD</Text>
            {consentRecord ? (
              <Text style={styles.consentDate}>
                Aceito em {formatDate(consentRecord.acceptedAt)}
              </Text>
            ) : (
              <Text style={styles.consentDate}>Não registrado</Text>
            )}
          </View>
          <View
            style={[
              styles.badge,
              consentRecord ? styles.badgeGreen : styles.badgeRed,
            ]}
          >
            <Text style={styles.badgeText}>
              {consentRecord ? "Ativo" : "Pendente"}
            </Text>
          </View>
        </View>
        {consentRecord && (
          <View style={styles.versionRow}>
            <Text style={styles.versionText}>
              Termos v{consentRecord.termsVersion}
            </Text>
            <Text style={styles.versionDot}>·</Text>
            <Text style={styles.versionText}>
              Privacidade v{consentRecord.privacyVersion}
            </Text>
          </View>
        )}
      </View>

      {/* Seus direitos LGPD */}
      <Text style={styles.sectionTitle}>Seus direitos (Art. 18 LGPD)</Text>
      {[
        {
          icon: "👁️",
          right: "Acesso",
          desc: "Ver todos os dados que temos sobre você",
        },
        {
          icon: "✏️",
          right: "Correção",
          desc: "Corrigir dados incorretos ou incompletos",
        },
        {
          icon: "🗑️",
          right: "Exclusão",
          desc: "Solicitar a remoção dos seus dados",
        },
        {
          icon: "📦",
          right: "Portabilidade",
          desc: "Exportar seus dados em formato aberto",
        },
        {
          icon: "🚫",
          right: "Revogação",
          desc: "Retirar o consentimento a qualquer momento",
        },
        {
          icon: "ℹ️",
          right: "Informação",
          desc: "Saber com quem compartilhamos seus dados",
        },
      ].map((item) => (
        <View key={item.right} style={styles.rightItem}>
          <Text style={styles.rightIcon}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.rightTitle}>{item.right}</Text>
            <Text style={styles.rightDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}

      {/* Contato DPO */}
      <View style={styles.dpoCard}>
        <Text style={styles.dpoTitle}>📧 Encarregado de Dados (DPO)</Text>
        <Text style={styles.dpoText}>
          Para exercer seus direitos ou tirar dúvidas sobre privacidade:
        </Text>
        <Text style={styles.dpoEmail}>privacidade@medway.app</Text>
        <Text style={styles.dpoNote}>Prazo de resposta: até 15 dias úteis</Text>
      </View>

      {/* Documentos */}
      <Text style={styles.sectionTitle}>Documentos legais</Text>

      <TouchableOpacity
        style={styles.docBtn}
        onPress={() => setShowTerms(true)}
      >
        <Text style={styles.docIcon}>📄</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>Termos de Uso</Text>
          <Text style={styles.docSub}>Versão 1.0 — Abril 2025</Text>
        </View>
        <Text style={styles.docArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.docBtn}
        onPress={() => setShowPrivacy(true)}
      >
        <Text style={styles.docIcon}>🔐</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>Política de Privacidade</Text>
          <Text style={styles.docSub}>Versão 1.0 — Abril 2025 · LGPD</Text>
        </View>
        <Text style={styles.docArrow}>›</Text>
      </TouchableOpacity>

      {/* Exportar dados */}
      <Text style={styles.sectionTitle}>Gerenciar meus dados</Text>

      <TouchableOpacity
        style={styles.exportBtn}
        onPress={() =>
          Alert.alert(
            "Exportar dados",
            "Enviaremos um arquivo com todos os seus dados para o e-mail cadastrado em até 5 dias úteis.",
            [
              {
                text: "Solicitar",
                onPress: () => Alert.alert("Solicitação enviada!"),
              },
              { text: "Cancelar", style: "cancel" },
            ],
          )
        }
      >
        <Text style={styles.exportBtnText}>
          📦 Solicitar exportação dos meus dados
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.revokeBtn} onPress={handleRevoke}>
        <Text style={styles.revokeBtnText}>
          ⚠️ Revogar consentimento e excluir conta
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        MedWay está em conformidade com a LGPD (Lei nº 13.709/2018) e com o RGPD
        europeu.
        {"\n"}ANPD: gov.br/anpd
      </Text>

      {/* Modais */}
      <LegalModal
        visible={showTerms}
        title="Termos de Uso"
        content={TERMS_OF_USE}
        onClose={() => setShowTerms(false)}
      />
      <LegalModal
        visible={showPrivacy}
        title="Política de Privacidade"
        content={PRIVACY_POLICY}
        onClose={() => setShowPrivacy(false)}
      />
    </ScrollView>
  );
}

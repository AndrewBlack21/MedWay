import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./LegalModalStyle";

interface Props {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onAccept?: () => void;
  acceptLabel?: string;
}

export default function LegalModal({
  visible,
  title,
  content,
  onClose,
  onAccept,
  acceptLabel = "Li e aceito",
}: Props) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Conteúdo */}
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          <Text style={styles.content}>{content}</Text>
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Botões */}
        <View style={styles.footer}>
          {onAccept && (
            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
              <Text style={styles.acceptBtnText}>{acceptLabel}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeFooterBtn} onPress={onClose}>
            <Text style={styles.closeFooterBtnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

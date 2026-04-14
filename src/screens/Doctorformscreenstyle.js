import { StyleSheet } from "react-native";
import { colors } from "../theme/color";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
    marginTop: 16,
  },
  hint: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 6,
    marginTop: -4,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a1a1a",
    justifyContent: "center",
  },
  inputText: { fontSize: 14, color: "#1a1a1a" },
  placeholder: { fontSize: 14, color: "#aaa" },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  dropdown: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 220,
    overflow: "scroll",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: { fontSize: 14, color: "#333" },
  dropdownSelected: { color: colors.text, fontWeight: "600" },
  button: {
    marginTop: 28,
    backgroundColor: colors.text,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: "700" },
  cancelBtn: {
    marginTop: 28,
    backgroundColor: colors.textthrid,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  cancelText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  cycleRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  cycleBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  cycleBtnActive: {
    borderColor: "#1D9E75",
    backgroundColor: "#E1F5EE",
  },
  cycleBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  cycleBtnTextActive: {
    color: "#0F6E56",
  },
});

export default styles;

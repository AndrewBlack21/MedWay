import { StyleSheet } from "react-native";
import { colors } from "../theme/color";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9f8", backgroundColor: "" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actions: {
    flexDirection: "row",
    gap: 8,
    padding: 14,
    paddingBottom: 6,
  },
  header: {
    backgroundColor: "#FF4B8B",
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#E1F5EE",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9FE1CB",
  },
  actionBtnText: { color: "#0F6E56", fontWeight: "600", fontSize: 12 },
  actionBtnImport: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FAC775",
  },
  actionBtnImportText: { color: "#633806", fontWeight: "600", fontSize: 12 },
  actionBtnExport: {
    backgroundColor: "#EEEDFE",
    borderColor: "#AFA9EC",
  },
  actionBtnExportText: { color: "#FF4B8B", fontWeight: "600", fontSize: 12 },
  list: { padding: 14, paddingBottom: 90 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 16, color: "#555", fontWeight: "500" },
  emptyHint: { fontSize: 13, color: "#aaa", marginTop: 6 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1D9E75",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 32, fontWeight: "300" },
});

export default styles;

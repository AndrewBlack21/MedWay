import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 13,
    color: "#1D9E75",
    fontWeight: "600",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 8,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  statusBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  statusVisited: {
    borderColor: "#1D9E75",
    backgroundColor: "#E1F5EE",
  },
  statusVisitedText: {
    color: "#0F6E56",
  },
  statusNotVisited: {
    borderColor: "#E24B4A",
    backgroundColor: "#FCEBEB",
  },
  statusNotVisitedText: {
    color: "#A32D2D",
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1a1a1a",
    textAlignVertical: "top",
    minHeight: 80,
  },
  saveBtn: {
    backgroundColor: "#1D9E75",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    color: "#aaa",
    fontSize: 14,
  },
});

export default styles;

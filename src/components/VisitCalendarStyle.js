import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendText: {
    fontSize: 11,
    color: "#888",
  },
  dayDetail: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    gap: 8,
  },
  dayDetailTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginBottom: 4,
  },
  emptyDay: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 8,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 3,
    flexShrink: 0,
  },
  logName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  logSpecialty: {
    fontSize: 12,
    color: "#1D9E75",
  },
  logComment: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginTop: 2,
  },
  logStatus: {
    fontSize: 16,
    fontWeight: "700",
    color: "#aaa",
  },
});

export default styles;

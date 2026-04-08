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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  arrow: {
    fontSize: 24,
    color: "#1D9E75",
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#aaa",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  cellSelected: {
    backgroundColor: "#1D9E75",
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: "#1D9E75",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#1D9E75",
    fontWeight: "700",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 2,
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

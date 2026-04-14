import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  dayBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  dayBtnActive: {
    borderColor: "#1D9E75",
    backgroundColor: "#E1F5EE",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  dayTextActive: {
    color: "#0F6E56",
  },
});

export default styles;

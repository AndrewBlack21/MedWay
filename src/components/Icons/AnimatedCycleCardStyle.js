import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lottie: {
    width: 44,
    height: 44,
  },
  number: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  label: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
    marginTop: 2,
  },
});

export default styles;

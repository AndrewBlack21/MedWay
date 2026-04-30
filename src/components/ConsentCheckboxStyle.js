import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: "#FF4B8B",
    borderColor: "#FF4B8B",
  },
  checkmark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  textBlock: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  link: {
    color: "#FF4B8B",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  consentBadge: {
    backgroundColor: "#E1F5EE",
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#1D9E75",
  },
  consentBadgeText: {
    fontSize: 11,
    color: "#0F6E56",
    fontWeight: "500",
    lineHeight: 16,
  },
});

export default styles;

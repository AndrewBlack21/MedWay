import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    gap: 2,
  },
  btnActive: {
    borderColor: "#1D9E75",
    backgroundColor: "#E1F5EE",
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },
  labelActive: {
    color: "#0F6E56",
  },
});

export default styles;

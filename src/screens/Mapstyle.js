import { StyleSheet } from "react-native";
import { colors } from "../theme/color";

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  fitBtn: {
    position: "absolute",
    bottom: 24,
    right: 16,
    backgroundColor: colors.text,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fitBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  badgeText: { color: colors.text, fontWeight: "700", fontSize: 13 },
});

export default styles;

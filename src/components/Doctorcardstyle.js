import { StyleSheet } from "react-native";
import { colors } from "../theme/color";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: "flex-start",
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundsecond,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  badgeText: {
    color: colors.badgeText,
    fontWeight: "700",
    fontSize: 13,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.color,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: colors.textsecond,
    lineHeight: 17,
  },
  hours: {
    fontSize: 12,
    color: colors.textsecond,
    marginTop: 4,
  },
  actions: {
    gap: 6,
    marginLeft: 8,
  },
  btnEdit: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.text,
  },
  btnEditText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  btnDelete: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.textthrid,
  },
  btnDeleteText: {
    fontSize: 12,
    color: colors.textthrid,
    fontWeight: "600",
  },
});

export default styles;

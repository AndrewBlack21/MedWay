import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    fontSize: 13,
    color: "#333",
    lineHeight: 22,
    fontFamily: "System",
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  acceptBtn: {
    backgroundColor: "#FF4B8B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  closeFooterBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  closeFooterBtnText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default styles;

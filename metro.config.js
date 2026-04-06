const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclui react-native-maps do bundle web
// O EAS Update tenta buildar para todas as plataformas incluindo web
// mas react-native-maps só funciona em mobile (iOS e Android)
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

config.resolver.platforms = ["ios", "android"];

module.exports = config;

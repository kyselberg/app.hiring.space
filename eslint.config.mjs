import pluginSecurity from "eslint-plugin-security";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([pluginSecurity.configs.recommended]);

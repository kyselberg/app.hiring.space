export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  app: {
    head: {
      title: "Nuxt App",
      meta: [{ name: "description", content: "Nuxt App" }],
    },
  },

  security: {
    strict: true,
    rateLimiter: false,
    csrf: true,
  },

  css: ["~/assets/css/tailwind.css"],

  modules: [
    "nuxt-zod-i18n",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/i18n",
    "@nuxtjs/html-validator",
    "nuxt-security",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
  ],

  i18n: {
    locales: [{ code: "en", language: "en-GB", iso: "en-GB", file: "en.json" }],
    defaultLocale: "en",
    lazy: false,
    langDir: "locales",
    strategy: "no_prefix",
  },

  htmlValidator: {
    usePrettier: true,
    logLevel: "verbose",
    failOnError: false,
    /** A list of routes to ignore (that is, not check validity for). */
    ignore: [/\.(xml|rss|json)$/],
    options: {
      extends: [
        "html-validate:document",
        "html-validate:recommended",
        "html-validate:standard",
      ],
      rules: {
        "svg-focusable": "off",
        "no-unknown-elements": "error",
        // Conflicts or not needed as we use prettier formatting
        "void-style": "off",
        "no-trailing-whitespace": "off",
        // Conflict with Nuxt defaults
        "require-sri": "off",
        "attribute-boolean-style": "off",
        "doctype-style": "off",
        // Unreasonable rule
        "no-inline-style": "off",
      },
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});

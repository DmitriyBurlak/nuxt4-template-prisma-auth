// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@pinia/nuxt', '@prisma/nuxt'],
  css: ['~/assets/css/main.css'],
	ui: {
    colorMode: false
  },
	icon: {
		provider: 'iconify'
	},
	runtimeConfig: {
		public: {
			baseURL: process.env.NUXT_PUBLIC_BASE_URL,
		},
		MAIL_USER: process.env.NUXT_MAIL_USER,
		MAIL_PASS: process.env.NUXT_MAIL_PASS,
		MAIL_HOST: process.env.NUXT_MAIL_HOST,
		MAIL_PORT: process.env.NUXT_MAIL_PORT,
	},
})
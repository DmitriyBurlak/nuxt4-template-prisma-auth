import { useAuth } from "~/entities/auth"
import type { AuthStore } from './types'

export const useAuthStore = defineStore('auth', {
	state: (): AuthStore => ({
		accessToken: '',
		user: null,
		isInitialized: false,
	}),
	getters: {
		isAuth: (state) => !!state.user,
	},
	actions: {
		async initialize() {
			const auth = useAuth()

			try {
				if (!this.user) {
					await auth.fetchUser()
				}
				this.isInitialized = true
				console.log('Store initialized')
			} catch (error) {
				console.error('Error during store initialization:', error)
				this.isInitialized = true
				this.user = null
			}
    },
	}
})
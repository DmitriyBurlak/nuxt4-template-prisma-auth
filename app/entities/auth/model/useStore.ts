//import { AUTH_CONSTANTS } from '~~/types/auth/auth.constants'
import type { AuthStore } from '../types'
import { useAuth } from "~/entities/auth/model"


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
			console.log('initialize', this.user);
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
			}
    },
	}
})
import { useAuthStore } from './useStore'
import { authApi } from '../index'

import type { AUTH } from '~~/types/auth'

export const useAuth = () => {
	const authStore = useAuthStore()
	const toast = useToast()
	
	const fetchUser = async () => {
		const { data, status } = await authApi.auth.fetchUser()

		if ( status?.value === 'success' ) {
			authStore.user = data.value?.user || null
		}
	}

	const login = async ({ email, password }: AUTH.LoginRequest, remember: boolean) => {
		const { data, status } = await authApi.auth.login({
			email,
			password,
		})

		if ( status?.value === 'success' ) {
			authStore.user = data.value?.user || null
			
			toast.add({ 
				title: 'Добро Пожаловать', 
				color: 'success' 
			})
			navigateTo('/workspace')
			return { result: true }
		}
	}

	const refreshToken = async (): Promise<AUTH.RefreshTokenResponse | null> => {
		const { data, status } = await authApi.auth.refreshToken()
		
		if (status?.value === 'success' && data.value) {
			return data.value
		}
		return null
	}

	const logout = async () => {
		await authApi.auth.logout()

		authStore.user = null
		navigateTo('/')
	}

	return {
		login,
		fetchUser,
		logout,
		refreshToken,
	}
}
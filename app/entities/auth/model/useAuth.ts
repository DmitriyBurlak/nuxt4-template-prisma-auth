import { useAuthStore } from './useStore'
import { auth as authApi } from './index'
import type { AUTH } from '~~/shared/types/auth'

export const useAuth = () => {
	const authStore = useAuthStore()
	const toast = useToast()
	
	const fetchUser = async () => {
		const { data, status } = await authApi.fetchUser()

		if ( status?.value === 'success' ) {
			authStore.user = data.value?.user || null
		} else {
			authStore.user = null
		}
	}

	const login = async ({ email, password }: AUTH.LoginRequest) => {
		const { data, status, error } = await authApi.login({
			email,
			password,
		})

		if (status?.value === 'success') {
			authStore.user = data.value?.user || null
			
			toast.add({ 
				title: 'Добро Пожаловать', 
				color: 'success' 
			})
			navigateTo('/workspace')
			return { result: true }
		}
		
		// Проверяем, не является ли ошибка неподтвержденным email
		if (error?.value?.data?.code === 'EMAIL_NOT_VERIFIED') {
			navigateTo(`/verify-email?email=${encodeURIComponent(email)}`)
			return { result: false, error: error.value }
		}
		
		return { result: false, error: error?.value }
	}

	const logout = async () => {
		await authApi.logout()

		authStore.user = null
		navigateTo('/')
	}

	return {
		login,
		fetchUser,
		logout,
	}
}
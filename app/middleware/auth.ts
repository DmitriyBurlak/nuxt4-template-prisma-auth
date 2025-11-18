import { useAuthStore } from "~/entities/auth"

const PROTECTED_ROUTES = ['/workspace']
const AUTH_ROUTES = ['/sign-in', '/sign-up', '/verify-email', '/forgot-password', '/reset-password']

export default defineNuxtRouteMiddleware(async (to) => {
	const auth = useAuthStore()
	const isProtectedRoute = PROTECTED_ROUTES.some(route => to.path.startsWith(route))
	const isAuthRoute = AUTH_ROUTES.includes(to.path)
  
	if (!auth.isInitialized) {
		try {
			await auth.initialize()
		} catch (error) {
			console.error('Ошибка при инициализации auth store:', error)
			if (isProtectedRoute) {
				return navigateTo('/sign-in')
			}
		}
	}

	if (import.meta.client && auth.isInitialized) {
		if (!auth.isAuth && isProtectedRoute) {
			return navigateTo('/sign-in', {
				external: true,
				replace: true
			})
		}
		
		if (auth.isAuth && isAuthRoute) {
			return navigateTo('/workspace', {
				external: true,
				replace: true
			})
		}
	}
})
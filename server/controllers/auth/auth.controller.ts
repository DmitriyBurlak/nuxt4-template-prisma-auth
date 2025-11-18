import type { H3Event } from 'h3'
import AuthService from '~~/server/services/auth/auth.service'
import { handleApiErrors } from '~~/server/utils/error/errorHandler'

export const register = async (event: H3Event) => {
	try {
		const body = await readBody(event)
		const { message } = await AuthService.register(body)
		return { message }
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const verifyEmail = async (event: H3Event) => {
	try {
		const { token } = await readBody(event)
		return await AuthService.verifyEmail(token)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const resendVerification = async (event: H3Event) => {
	try {
		const { email } = await readBody(event)
		return await AuthService.resendVerification(email)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const login = async (event: H3Event) => {
	try {
		const body = await readBody(event)
		return await AuthService.login(body, event)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const forgotPassword = async (event: H3Event) => {
	try {
		const { email } = await readBody(event)
		return await AuthService.forgotPassword(email)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const resetPassword = async (event: H3Event) => {
	try {
		const { token, newPassword } = await readBody(event)
		return await AuthService.resetPassword(token, newPassword)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const logout = async (event: H3Event) => {
	try {
		return await AuthService.logout(event)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const fetchUser = async (event: H3Event) => {
	try {
		return await AuthService.fetchUser(event)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const updateMe = async (event: H3Event) => {
	try {
		const body = await readBody(event)
		return await AuthService.updateMe(event, body)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

export const changePassword = async (event: H3Event) => {
	try {
		const body = await readBody(event)
		return await AuthService.changePassword(event, body)
	} catch (error) {
		handleApiErrors(event, error)
	}
}

//export const refreshToken = async (event: H3Event) => {
//	try {
//		return await AuthService.refreshToken(event)
//	} catch (error) {
//		handleApiErrors(event, error)
//	}
//}
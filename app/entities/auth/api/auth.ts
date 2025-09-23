import { useApi } from '~/shared/lib/api'
import type { AUTH } from '~~/types/auth'

export const register = (body: AUTH.RegisterRequest) => {
	return useApi<AUTH.RegisterResponse>({urlPath: 'api/auth/register', options: { method: 'POST', body }, isShowMessageError: true})
}

export const verifyEmail = (body: AUTH.VerifyEmailRequest) => {
	return useApi<AUTH.VerifyEmailResponse>({urlPath: 'api/auth/verify-email', options: { method: 'POST', body }, isShowMessageError: true })
}

export const login = async (body: AUTH.LoginRequest) => {
	return await useApi<AUTH.LoginResponse>({urlPath: 'api/auth/login', options: { method: 'POST', body }, isShowMessageError: true })
}

export const fetchUser = async () => {
	return await useApi<AUTH.FetchUserResponse>({urlPath: 'api/auth/me', options: { method: 'GET' }})
}

export const updateMe = async (body: AUTH.UpdateMeParams) => {
	return await useApi<AUTH.FetchUserResponse>({urlPath: 'api/auth/update-me', options: { method: 'PUT', body }})
}

export const changePasswordUser = async (body: AUTH.ChangePasswordParams) => {
	return await useApi<AUTH.ChangePasswordResponse>({urlPath: 'api/auth/change-password', options: { method: 'PATCH', body }, isShowMessageError: true })
}

export const logout = async () => {
	return await useApi<AUTH.LogoutResponse>({urlPath: 'api/auth/logout', options: { method: 'POST' }})
}

export const forgotPassword = async (email: string) => {
	return await useApi<AUTH.ForgotPasswordResponse>({urlPath: 'api/auth/forgot-password', options: { method: 'POST', body: { email } }})
}

export const resetPassword = async (body: AUTH.ResetPasswordRequest) => {
	return await useApi<AUTH.ResetPasswordResponse>({urlPath: 'api/auth/reset-password', options: { method: 'POST', body }})
}

export const refreshToken = async () => {
	return await useApi<AUTH.RefreshTokenResponse>({urlPath: 'api/auth/refresh-token', options: { method: 'POST' }})
}
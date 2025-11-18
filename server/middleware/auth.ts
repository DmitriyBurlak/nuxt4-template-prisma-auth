import AuthService from '~~/server/services/auth/auth.service'
import { verifyAccessToken } from "~~/server/utils/jwt.utils";
import { AUTH_CONSTANTS } from '~~/shared/types/auth/auth.constants'
import { InvalidSessionError } from "~~/server/utils/error/index";
import { createErrorResponse } from "~~/server/utils/error/errorHandler";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
	
	const publicPaths = [
		'/api/auth/register',
    '/api/auth/login',
    '/api/auth/refresh-token',
    '/api/auth/verify-email',
    '/api/auth/resend-verification',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/logout',
		'/api/sitemap.urls',
		'/api/public-contact', //forms обратной связи
  ];

	if (!event.path.startsWith('/api/') || path.includes('_nuxt_icon')) {
    return;
  }

	// Пропускаем публичные пути
	if (publicPaths.includes(path)) return

	const accessToken = getCookie(event, AUTH_CONSTANTS.ACCESS_TOKEN_KEY)
	const refreshToken = getCookie(event, AUTH_CONSTANTS.REFRESH_TOKEN_KEY)

	try {
		if (!accessToken && !refreshToken) {
			throw new InvalidSessionError('No authentication tokens provided')
		}

		if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken) as { userId: string, clientId?: string, roles: string[] }
        event.context.user = { id: decoded.userId, clientId: decoded?.clientId || undefined, roles: decoded.roles }
        return
      } catch (jwtError) {
				const jwtErrorStringify = JSON.parse(JSON.stringify(jwtError))
				
				if (jwtErrorStringify?.name === 'AccessTokenExpiredError') {
					if (!refreshToken) throw new AccessTokenExpiredError('Access token expired')

					const newTokens = await AuthService.refreshToken(event)
					// Устанавливаем новый контекст
					event.context.user = { id: newTokens.userId, clientId: newTokens?.clientId || undefined, roles: newTokens?.roles }
					return
				}
				throw jwtError
      }
    }
	} catch (error) {
		const errorResponse = createErrorResponse(error)
    
    if (error instanceof AppError) {
      event.node.res.statusCode = error.statusCode
    } else {
      event.node.res.statusCode = 401
    }
    
    // Отправляем ошибку в нужном формате
    event.node.res.setHeader('Content-Type', 'application/json')
    event.node.res.end(JSON.stringify(errorResponse))
    
    // Прерываем выполнение
    throw error
  }
})
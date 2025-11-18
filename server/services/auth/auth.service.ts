import prisma from '~~/lib/prisma'
import UserService from '~~/server/services/users/users.service'
import TokenService from './token.service'
import { compare, hash } from 'bcrypt'
import { sendVerificationEmail, sendPasswordResetEmail } from '~~/server/utils/email.utils'
import { generateAccessToken } from "~~/server/utils/jwt.utils";
import type { H3Event } from 'h3'
import type { AUTH } from '~~/shared/types/auth'
import type { USERS } from '~~/shared/types/users'
import { AUTH_CONSTANTS } from '~~/shared/types/auth/auth.constants'
import { EmailNotVerifiedError } from '~~/server/utils/error'

const SALT_ROUNDS = 10
const accessTokenLife = '15m'
const refreshTokenLife =  '7d'

const deleteAuthCookie = (event: H3Event) => {
	deleteCookie(event, AUTH_CONSTANTS.ACCESS_TOKEN_KEY)
  deleteCookie(event, AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
}

export class AuthService {
  async register({ email, password, fullname }: AUTH.RegisterRequest): Promise<AUTH.RegisterResponse> {
		const userCreated = await UserService.createClientUser({
			email,
			password,
			fullname,
		});
		
		const periodWork = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
		const createToken = await TokenService.createToken(userCreated.id, 'VERIFICATION', periodWork)

		if (createToken.token) {
			await sendVerificationEmail(userCreated.email, createToken.token)
		}

    return { message: 'Регистрация прошла успешно. Проверьте email для подтверждения.' }
  }

  async verifyEmail(token: string): Promise<AUTH.VerifyEmailResponse> {
		const verifi = await prisma.token.findFirst({
			where: { token: String(token) },
		})

    if (!verifi || verifi?.type !== 'VERIFICATION' || verifi?.expiresAt && verifi?.expiresAt < new Date()) {
      throw new ValidationError('Недействительный или истекший токен верификации')
    }

    await prisma.user.update({
      where: { id: verifi?.userId },
      data: {
        emailVerified: new Date(),
				isActive: true,
      }
    })
		
		await prisma.token.delete({
			where: { id: verifi?.id }
		})

    return { message: 'Email успешно подтвержден' }
  }

  async login(credentials: AUTH.LoginRequest, event: H3Event): Promise<AUTH.LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      include: { roles: { include: { role: true } } }
    })
		
    if (!user) {
		  throw new InvalidCredentialsError('Введен неверный логин или пароль')
		}
			
		const validPassword = await compare(credentials.password, user?.password)

    if (!validPassword) {
      throw new InvalidCredentialsError('Введен неверный логин или пароль')
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedError('Email не подтверждён. Проверьте вашу почту')
    }

		if (!user.isActive) {
      throw new ForbiddenError('Пользователь не активен')
    }

		const accessToken = generateAccessToken({ userId: user.id, roles: user.roles.map(ur => ur.role.name) }, accessTokenLife)
		const refreshToken = generateAccessToken({ userId: user.id }, refreshTokenLife)
		
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 дней 24 часа
				userAgent: getHeader(event, 'user-agent'),
      	ip: getHeader(event, 'x-forwarded-for'),
      }
    })

		await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      }
    })

		// Установка refreshToken в cookie
		setCookie(event, AUTH_CONSTANTS.REFRESH_TOKEN_KEY, refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60,
		})

		setCookie(event, AUTH_CONSTANTS.ACCESS_TOKEN_KEY, accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60,
		})

		const roles = user.roles.map(ur => ur.role.name)
		
    return {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        phone: user.phone || '',
        avatar: user.avatar || '',
				createdAt: user.createdAt.toISOString(),
				roles,
      }
    }
  }

	async fetchUser(event: H3Event): Promise<AUTH.FetchUserResponse> {
		const userContext = event.context.user

		if (!userContext) {
			throw new InvalidSessionError('Не авторизован')
		}

		const user = await UserService.getOneUser(userContext.id, true)
		
		if (user) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					lastLogin: new Date(),
				}
			})
		}

		return { user }
	}

  async refreshToken(event: H3Event): Promise<{ userId: string, clientId?: string, roles: string[] }> {
		const refreshToken = getCookie(event, AUTH_CONSTANTS.REFRESH_TOKEN_KEY)
		
		if (!refreshToken) {
			throw new AuthenticationError('Ошибка авторизации')
		}

    const session = await prisma.session.findUnique({
      where: { refreshToken: String(refreshToken) },
      include: {
        user: {
          include: { roles: { include: { role: true } }}
        }
      }
    })
		
    if (!session) {
      throw new InvalidSessionError('Сессия не найдена')
    }

    if (session.expiresAt < new Date()) {
			await prisma.session.deleteMany({ where: { userId: session.user.id } });
      throw new SessionExpiredError('Токен истек')
    }
		
		const accessToken = generateAccessToken({ userId: session.user.id, roles: session.user.roles.map(ur => ur.role.name) }, accessTokenLife)
		const newRefreshToken = generateAccessToken({ userId: session.user.id }, refreshTokenLife)

		await prisma.session.update({
			where: { id: session.id },
			data: {
				refreshToken: newRefreshToken,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			}
		})

		await prisma.user.update({
      where: { id: session.userId },
      data: {
        lastLogin: new Date(),
      }
    })

		setCookie(event, AUTH_CONSTANTS.REFRESH_TOKEN_KEY, newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60,
		})

		setCookie(event, AUTH_CONSTANTS.ACCESS_TOKEN_KEY, accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60,
		})

		return { userId: session.user.id, roles: session.user.roles.map(ur => ur.role.name) }
  }

  async forgotPassword(email: string): Promise<{ message: string}> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new NotFoundError('Пользователь не найден')
    }

		const periodWork = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 час
		const createToken = await TokenService.createToken(user.id, 'PASSWORD_RESET', periodWork)
    
		if (createToken.token) {
    	await sendPasswordResetEmail(email, createToken.token)
		}

    return { message: 'Инструкции по сбросу пароля отправлены на email' }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string}> {
		const verifi = await prisma.token.findFirst({
			where: { token: String(token) },
		})

    if (!verifi || verifi?.type !== 'PASSWORD_RESET' || verifi?.expiresAt && verifi?.expiresAt < new Date()) {
      throw new ValidationError('Недействительный или истекший токен сброса пароля')
    }

    const hashedPassword = await hash(newPassword, SALT_ROUNDS)

    await prisma.user.update({
      where: { id: verifi.userId },
      data: {
        password: hashedPassword,
				updatedAt: new Date(),
      }
    })

		await prisma.token.delete({
			where: { id: verifi?.id }
		})

    return { message: 'Пароль успешно изменен' }
  }

	async changePassword(event: H3Event, data: AUTH.ChangePasswordParams): Promise<{ message: string}> {
		const userContext = event.context.user

		if (!userContext) {
			throw new InvalidSessionError('Не авторизован')
		}

		const user = await prisma.user.findUnique({
      where: { id: userContext.id },
      select: { password: true, id: true }
    });

		if (!user) {
			throw new NotFoundError('Пользователь не найден')
		}

		const validPassword = await compare(data.oldPass, user?.password)
		if (!validPassword) {
      throw new InvalidCredentialsError('Пароль введен не верно')
    }

    const hashedPassword = await hash(data.newPass, SALT_ROUNDS)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
				updatedAt: new Date(),
      }
    })

    return { message: 'Пароль успешно изменен' }
  }

	async updateMe(event: H3Event, data: Partial<USERS.UserBase>): Promise<{ user: USERS.UserBase}> {
		const userContext = event.context.user

		if (!userContext) {
			throw new InvalidSessionError('Не авторизован')
		}

		const user = await UserService.updateUser(userContext.id, data)
		return { user }
	}

	async resendVerification(email: string): Promise<{ message: string }> {
		const user = await prisma.user.findUnique({ 
			where: { email } 
		})

		if (!user) {
			throw new ValidationError('Пользователь с таким email не найден')
		}

		if (user.emailVerified) {
			throw new ValidationError('Email уже подтвержден')
		}

		// Удаляем старые токены верификации
		await prisma.token.deleteMany({
			where: {
				userId: user.id,
				type: 'VERIFICATION'
			}
		})

		const periodWork = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
		const createToken = await TokenService.createToken(user.id, 'VERIFICATION', periodWork)
		
		if (createToken.token) {
			await sendVerificationEmail(user.email, createToken.token)
		}

		return { message: 'Письмо успешно отправлено! Проверьте вашу почту.' }
	}

  async logout(event: H3Event): Promise<{ message: string }> {
		const refreshToken = getCookie(event, AUTH_CONSTANTS.REFRESH_TOKEN_KEY)

		if (!refreshToken) {
			return { message: 'Выход выполнен успешно' }
    }

    const session = await prisma.session.findUnique({ where: { refreshToken } })
		deleteAuthCookie(event)
    if (!session) { throw new NotFoundError('Сессия не найдена') }

    await prisma.session.delete({ where: { refreshToken } })
    return { message: 'Выход выполнен успешно' }
  }
}

export default new AuthService() 
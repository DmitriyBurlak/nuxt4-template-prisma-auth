import prisma from "~~/lib/prisma";
import jwt from 'jsonwebtoken'
import { AccessTokenExpiredError, InvalidSessionError } from './error/index'

// Интерфейс для кастомных полей в токене
interface CustomJwtPayload extends jwt.JwtPayload {
  userId: string
  roles?: string[]
}

const JWT_SECRET = process.env.JWT_SECRET || 'access_token'

// Генерация Access Token
export function generateAccessToken(payload: CustomJwtPayload, expiresIn: string): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn || '15m' }
)}

// Верификация Access Token
export function verifyAccessToken(token: string): CustomJwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomJwtPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
			//срок действия токена истек, делаем рефреш
			throw new AccessTokenExpiredError('Token expired')
    }
    // Все остальные ошибки
		throw new InvalidSessionError('Invalid token')
  }
}

// Дополнительная функция для проверки ролей пользователя
export async function verifyUserRoles(
  userId: string,
  requiredRoles: string[]
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  })

  if (!user) return false

  // Преобразуем роли в массив строк
  const userRoles = user.roles.map(role => role.name)
  // Проверяем наличие хотя бы одной из требуемых ролей
  return requiredRoles.some(role => userRoles.includes(role))
}
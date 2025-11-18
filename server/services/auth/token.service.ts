import prisma from '~~/lib/prisma'
import { randomBytes } from 'crypto'

export class TokenService {
  async createToken(userId: string, typeToken: 'VERIFICATION' | 'PASSWORD_RESET', expiresAt: Date): Promise<{ token: string }> {
    const newToken = randomBytes(32).toString('hex')

		return await prisma.token.create({
      data: {
        token: newToken,
				type: typeToken,
        userId,
        expiresAt,
      },
			select: {
				token: true
			}
    })
  }
}

export default new TokenService() 
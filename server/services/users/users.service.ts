import prisma from '~~/lib/prisma'
import { NotFoundError, InvalidSessionError } from '~~/server/utils/error'
import { hash } from 'bcrypt'
import { RoleUsersEnum } from '~~/shared/types/users/enum'
import type { AUTH } from '~~/shared/types/auth'
import type { USERS } from '~~/shared/types/users'

const SALT_ROUNDS = 10

const UserBaseFields = {
	id: true,
	fullname: true,
	email: true,
	phone: true,
	avatar: true,
	createdAt: true,
	roles: {
		select: {
			role: {
				select: {
					name: true,
				}
			}
		}
	}
};

export class UserService {
	async getOneUser(id: string | undefined, isFetchUser?: boolean): Promise<USERS.UserBase> {
		const user = await prisma.user.findUnique({
			where: { id },
			include: { roles: { include: { role: true } } },
		})

		if (!user && isFetchUser) {
			throw new InvalidSessionError('Пользователь не найден')
		} else if (!user) {
			throw new NotFoundError('Пользователь не найден')
		}

		return {
			id: user.id,
			email: user.email,
			fullname: user.fullname,
			phone: user.phone || '',
			avatar: user.avatar || '',
			createdAt: user.createdAt.toISOString(),
			roles: user.roles.map(ur => ur.role.name)
		}
	}

	async createUser({ email, password, fullname, roleName }: AUTH.RegisterRequest & { roleName: RoleUsersEnum }): Promise<USERS.UserBase> {
		const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      throw new ValidationError('Пользователь с таким email уже существует')
    }

		const hashedPassword = await hash(password, SALT_ROUNDS)

		const user = await prisma.user.create({
      data: {
				fullname,
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: {
              connect: { name: roleName }
            }
          }
        },
      },
			select: UserBaseFields
    })

		return {
			id: user.id,
			email: user.email,
			fullname: user.fullname,
			phone: user.phone || '',
			avatar: user.avatar || '',
			roles: user.roles.map(ur => ur.role.name)
		}
	}

	//Нужен для расширения функционала в будущем
	async createClientUser(data: AUTH.RegisterRequest): Promise<USERS.UserBase> {
		const userCreated = await this.createUser({ email: data.email, password: data.password, fullname: data.fullname, roleName: RoleUsersEnum.CLIENT })

		return {
			...userCreated,
		}
	}

	async updateUser(
		userId?: string,
		data: Partial<USERS.UserBase> & { isActive?: boolean },
	): Promise<USERS.UserBase> {
		const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
				id: true, 
			}
    });

		if (!user) {
			throw new NotFoundError('Пользователь не найден')
		}

		// Обновляем базовые данные пользователя
		const updateData: Record<string, unknown> = {};
		if (data.fullname) updateData.fullname = data.fullname;
		if (data.email) updateData.email = data.email;
		if (data.phone !== undefined) updateData.phone = data.phone ? data.phone.replace(/\D/g, '') : null;
		if (data.avatar !== undefined) updateData.avatar = data.avatar;
		if (data.isActive !== undefined) updateData.isActive = data.isActive;

		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: updateData,
			select: UserBaseFields,
		})
		const roles = updatedUser.roles.map(ur => ur.role.name)

		return {
			...updatedUser,
			createdAt: updatedUser.createdAt.toISOString(),
			roles: roles as RoleUsersEnum[],
		}
	}
}

export default new UserService() 
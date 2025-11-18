import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import { hashSync } from 'bcrypt';

async function clear() {
	// Удаляем данные в правильном порядке из-за внешних ключей
	await prisma.userRole.deleteMany()
	await prisma.user.deleteMany()
	await prisma.role.deleteMany()
}

async function up() {
	await clear()

	// Создаем роли
	const adminRole = await prisma.role.create({
		data: {
			name: 'ADMIN',
			description: 'Администратор системы'
		}
	})

	await prisma.role.create({
		data: {
			name: 'CLIENT',
			description: 'Клиент пользователь'
		}
	})

	await prisma.user.create({
		data: {
			fullname: 'Бурлак Дмитрий',
			email: 'dmshade25@gmail.com',
			password: hashSync('qwerty123', 10),
			phone: '',
			isActive: true,
			emailVerified: new Date(),
			roles: {
				create: {
					roleId: adminRole.id
				}
			}
		}
	})
}

async function main() {
	try {
		await up()
	} catch (error) {
		console.error('Error during seeding:', error)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
}

main()
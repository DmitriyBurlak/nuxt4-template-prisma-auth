import UserService from '~~/server/services/users/users.service'
import { handleApiErrors } from '~~/server/utils/error/errorHandler'
import type { H3Event } from 'h3'

export const createClientUser = async (event: H3Event) => {
	try {
		const body = await readBody(event)
		return await UserService.createClientUser(body)
	} catch (error) {
		handleApiErrors(event, error)
	}
}
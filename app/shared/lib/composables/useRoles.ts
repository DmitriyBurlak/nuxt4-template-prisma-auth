import { useAuthStore } from '~/entities/auth'
import { RoleUsersEnum } from '~~/shared/types/users/enum'

export const useRoles = () => {
	const authStore = useAuthStore()
	
	// Получаем роли текущего пользователя
	const userRoles = computed(() => authStore.user?.roles || [])
	
	// Проверяем, есть ли у пользователя определенная роль
	const hasRole = (role: RoleUsersEnum) => {
		return userRoles.value.includes(role)
	}
	
	// Проверяем, есть ли у пользователя хотя бы одна из указанных ролей
	const hasAnyRole = (roles: RoleUsersEnum[]) => {
		return userRoles.value.some(role => roles.includes(role))
	}
	
	// Проверяем, есть ли у пользователя все указанные роли
	const hasAllRoles = (roles: RoleUsersEnum[]) => {
		return roles.every(role => userRoles.value.includes(role))
	}
	
	// Проверяем, является ли пользователь администратором
	const isAdmin = computed(() => hasRole(RoleUsersEnum.ADMIN))
	
	// Проверяем, является ли пользователь сотрудником
	const isEmployee = computed(() => hasRole(RoleUsersEnum.EMPLOYEE))
	
	// Проверяем, является ли пользователь клиентом
	const isClient = computed(() => hasRole(RoleUsersEnum.CLIENT))
	
	return {
		userRoles,
		hasRole,
		hasAnyRole,
		hasAllRoles,
		isAdmin,
		isEmployee,
		isClient,
		RoleUsersEnum
	}
} 
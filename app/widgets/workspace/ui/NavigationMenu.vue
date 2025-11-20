
<template>
	<div class="p-3 rounded-xl min-w-[250px] h-full bg-white shadow-sm border border-neutral-200">
		<UNavigationMenu
			orientation="vertical"
			:items
			class="data-[orientation=vertical]:w-48 !w-full"
			:ui="{
				separator: 'my-2 border-t border-neutral-200',
			}"
		/>
	</div>
</template>

<script setup lang="ts">
import { useRoles } from '~/shared/lib/composables/useRoles'
import { RoleUsersEnum } from '~~/shared/types/users/enum'
import type { NavigationMenuItem } from '@nuxt/ui'

interface NavigationMenuItemWithRoles extends NavigationMenuItem {
	allowedRoles?: RoleUsersEnum[]
	children?: NavigationMenuItem[]
}

const emit = defineEmits<{
	(event: 'select'): void,
}>()

const handleMenuSelect = () => {
	emit('select')
}

const { hasAnyRole } = useRoles()

// Функция для проверки доступа к пункту меню
const hasAccess = (allowedRoles?: RoleUsersEnum[]) => {
	if (!allowedRoles || allowedRoles.length === 0) return true
	return hasAnyRole(allowedRoles)
}

const filterMenuItems = (menuItems: NavigationMenuItemWithRoles[][]): NavigationMenuItem[][] => {
	return menuItems.map(group => 
		group
			.filter(item => {
				if (item.children) {
					const filteredChildren = item.children.filter(child => 
						hasAccess((child as NavigationMenuItemWithRoles).allowedRoles)
					)
					return filteredChildren.length > 0 && hasAccess(item.allowedRoles)
				}
				return hasAccess(item.allowedRoles)
			})
			.map(item => {
				if (item.children) {
					const filteredChildren = item.children.filter(child => 
						hasAccess((child as NavigationMenuItemWithRoles).allowedRoles)
					)
					return { ...item, children: filteredChildren }
				}
				return item
			})
	).filter(group => group.length > 0)
}

const allMenuItems = ref<NavigationMenuItemWithRoles[][]>([
	[
		{
      label: 'Дашборд',
      icon: 'i-lucide-chart-no-axes-combined',
      to: '/workspace',
			allowedRoles: [RoleUsersEnum.ADMIN, RoleUsersEnum.EMPLOYEE, RoleUsersEnum.CLIENT],
			onSelect() {
        handleMenuSelect()
      }
    },
    {
      label: 'Профиль',
      icon: 'i-heroicons-user-circle',
      to: '/workspace/profile',
			allowedRoles: [RoleUsersEnum.ADMIN, RoleUsersEnum.EMPLOYEE, RoleUsersEnum.CLIENT],
			onSelect() {
        handleMenuSelect()
      }
    },
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/DmitriyBurlak/nuxt4-template-prisma-auth',
      target: '_blank',
			allowedRoles: [RoleUsersEnum.ADMIN, RoleUsersEnum.CLIENT]
    },
  ]
])

const items = computed<NavigationMenuItem[][]>(() => filterMenuItems(allMenuItems.value as NavigationMenuItemWithRoles[][]))
</script>

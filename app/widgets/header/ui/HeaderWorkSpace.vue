<template>
	<header>
		<div class="py-1 px-3 m-1 rounded-xl h-auto bg-white shadow-sm border border-neutral-200 flex justify-between items-center">
			<RouterLink to="/">
				<img src="/assets/images/logo.svg" alt="logo" class="size-10 rounded-full">
			</RouterLink>

			<ProfileDropDown />
		</div>

		<div class="p-2 px-4 m-1 rounded-xl h-auto bg-white shadow-sm border border-neutral-200 lg:hidden flex justify-between">
			<UDrawer
				v-model:open="isOpenMenu"
				direction="left"
				:handle="false"
				title="Меню навигации"
				description="Навигационное меню приложения"
				:ui="{ 
					content: '!p-0',
					title: 'sr-only',
					description: 'sr-only'
				}"
			>
				<div class="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 duration-300 cursor-pointer">
					<UIcon
						name="i-lucide-align-left"
						class="w-4 h-4"
					/>
					Menu
				</div>

				<template #content>
					<NavigationMenu
						@select="handleMenuSelect"
					/>
				</template>
			</UDrawer>
		</div>
	</header>
</template>

<script setup lang="ts">
import ProfileDropDown from './elements/ProfileDropDown.vue';
import { NavigationMenu } from '~/widgets/workspace';

const isOpenMenu = ref(false)

// Обработчик выбора пункта меню - закрываем drawer
const handleMenuSelect = () => {
	isOpenMenu.value = false
}
</script>
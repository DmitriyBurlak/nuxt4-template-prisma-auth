<template>
	<header>
		<div class="flex justify-between items-center !py-1 px-4 md:px-8 lg:px-14 border-b-1">
			<!-- Десктопная навигация -->
			<nav class="hidden md:flex gap-4 lg:gap-6 items-center">
				<RouterLink to="/">
					<img src="https://avatars.githubusercontent.com/u/58446735?v=4" alt="logo" class="w-[40px] lg:w-[50px] rounded-full">
				</RouterLink>

				<NuxtLink 
					v-for="link in headerLinks" 
					:key="link.path"
					:to="link.path"
					class="cursor-pointer text-sm lg:text-base"
				>
					{{ link.title }}
				</NuxtLink>
			</nav>

			<!-- Мобильная навигация -->
			<div class="flex items-center gap-2 md:hidden">
				<HeaderBurgerMenu :links="headerLinks" />

				<RouterLink to="/">
					<img src="https://avatars.githubusercontent.com/u/58446735?v=4" alt="logo" class="w-[40px] lg:w-[50px] rounded-full">
				</RouterLink>
			</div>

			<div>
				<NButton
					v-if="!authStore.isAuth"
					color="neutral"
					variant="link"
					size="md"
					class="text-sm px-2 md:px-2.5 py-1 md:py-1.5"
					to="/sign-in"
				>
					<span class="hidden sm:inline">Войти</span>
					<span class="sm:hidden">Вход</span>
				</NButton>

				<ProfileDropDown v-else />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/entities/auth/model"
import { HeaderBurgerMenu, ProfileDropDown } from './elements';
import { NButton } from '~/shared/ui';

const authStore = useAuthStore()

const headerLinks = ref([
	{
		title: 'Новости',
		path: '/news',
		icon: 'i-heroicons-briefcase',
	},
	{
		title: 'О нас',
		path: '/about_us',
		icon: 'i-heroicons-briefcase',
	},
	{
		title: 'Контакты',
		path: 'contacts',
		icon: 'i-heroicons-envelope',
	},
])
</script>
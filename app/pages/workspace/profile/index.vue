<template>
	<div class="space-y-6">
		<div>
			<h3 class="text-neutral-900">Мой профиль</h3>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			<UserProfileCard
				:user="auth.user" 
				class="lg:col-span-1"
			/>

			<EditProfileForm 
				:user="auth.user"
				class="lg:col-span-2"
				@change-password="isOpen = !isOpen"
				@update:user="handleUserUpdate"
			/>
		</div>

		<ChangePassword v-model="isOpen" />
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/entities/auth"
import { UserProfileCard } from '~/entities/users';
import { ChangePassword, EditProfileForm } from '~/features/users';
import { z } from 'zod';
import type { USERS } from '~~/shared/types/users';

const auth = useAuthStore()
const isOpen = ref(false)

const schema = z.object({
	fullname: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	email: z.string().email('Неверный формат email'),
	phone: z.string()
    .optional()
    .or(z.literal('')),
	avatar: z.string()
		.optional()
    .or(z.literal('')),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	fullname: undefined,
	email: undefined,
	phone: undefined,
	avatar: undefined,
})
const initialData = ref<Partial<Schema>>({});

const setState = (userInfo: USERS.UserBase | null) => {
	if (!userInfo) return
	const { phone, email, fullname, avatar } = userInfo
	
	state.fullname = fullname 
	state.email = email 
	state.phone = phone || undefined
	state.avatar = avatar || undefined
	initialData.value = { ...state };
}

const handleUserUpdate = (user: USERS.UserBase) => {
	auth.user = user
}

watch(() => auth.user, (newVal) => {
	setState(newVal)
}, { immediate: true })

</script>
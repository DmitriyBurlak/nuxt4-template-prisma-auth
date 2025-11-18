<template>
	<div class="relative py-[100px] flex flex-col items-center justify-center overflow-hidden">
		<div class="text-center">
			<h1 class="text-gradient">Сброс пароля</h1>
			<p class="text-neutral-600 max-w-xl mx-auto">
				Введите новый пароль для вашего аккаунта
			</p>
		</div>

		<div class="p-10 border-white/10 rounded-2xl w-full max-w-md bg-gray-100 mt-10">
			<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
				<NFormField label="Новый пароль" name="newPassword" required>
					<NPasswordInput v-model="state.newPassword" placeholder="Введите новый пароль" class="!w-full" />
				</NFormField>

				<NFormField label="Подтверждение пароля" name="confirmPassword" required>
					<NPasswordInput v-model="state.confirmPassword" placeholder="Подтвердите новый пароль" class="!w-full" />
				</NFormField>

				<div class="pt-4">
					<NButton
						type="submit"
						color="secondary"
						glow-type
						size="lg"
						class="w-full flex justify-center"
					>
						Сменить пароль
					</NButton>
				</div>
			</UForm>

			<div class="mt-8 text-neutral-400 text-sm text-center">
				Вспомнили пароль?
				<NuxtLink to="/sign-in" class="text-blue-500 font-semibold hover:text-blue-400 ml-1 transition duration-400">Войти</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { auth as authApi } from '~/entities/auth';
import { NButton, NFormField, NPasswordInput } from '~/shared/ui';
import { z } from 'zod';

definePageMeta({ 
	middleware: ['auth'],
})

const route = useRoute();
const toast = useToast();

const schema = z.object({
  newPassword: z.string('Обязательное поле').min(8, 'Пароль должен содержать минимум 8 символов'),
  confirmPassword: z.string('Обязательное поле')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  newPassword: undefined,
  confirmPassword: undefined,
})

const onSubmit = async () => {
	try {
		const token = route.query.token as string
		if (!token) {
			toast.add({ 
				title: 'Ошибка', 
				description: 'Неверная ссылка для сброса пароля',
				color: 'error' 
			})
			return
		}

		const { status } = await authApi.resetPassword({ token, newPassword: state.newPassword || '' })

		if (status.value === 'success') {
			toast.add({ 
				title: 'Пароль успешно изменен!', 
				color: 'success' 
			})
			navigateTo('/sign-in')
		}
	} catch (error: unknown) {
		toast.add({ 
			title: 'Ошибка', 
			description: 'Не удалось изменить пароль',
			color: 'error' 
		})
	}
}
</script> 
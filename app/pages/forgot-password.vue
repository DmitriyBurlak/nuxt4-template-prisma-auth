<template>
	<div class="relative py-[100px] pt-[140px] flex flex-col items-center justify-center overflow-hidden">
		<div class="text-center">
			<h1 class="text-gradient">Восстановление пароля</h1>
			<p class="text-neutral-600 max-w-xl mx-auto">
				Введите ваш email, и мы отправим вам инструкции по сбросу пароля.
			</p>
		</div>

		<div class="max-w-md w-full">
			<div class="!p-10 !mt-10 border-white/10 rounded-2xl w-full block-with-glow bg-gray-100">
				<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
					<NFormField label="Email" name="email" required>
						<NInput v-model="state.email" class="w-full" placeholder="Введите email" app-color />
					</NFormField>

					<div class="pt-4">
						<NButton
							type="submit"
							color="secondary"
							glow-type
							size="lg"
							class="w-full flex justify-center"
						>
							Отправить
						</NButton>
					</div>
				</UForm>

				<div class="mt-8 text-neutral-400 text-sm text-center">
					Вспомнили пароль?
					<NuxtLink to="/sign-in" class="text-blue-500 font-semibold hover:text-blue-400 ml-1 transition duration-400">Войти</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { auth as authApi } from '~/entities/auth';
import { NButton, NInput, NFormField } from '~/shared/ui';
import { z } from 'zod';

useHead({ title: 'Восстановление пароля' });

definePageMeta({ 
	middleware: ['auth'],
})

const toast = useToast();

const schema = z.object({
  email: z.string('Обязательное поле').email('Неверный формат email'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
})

const onSubmit = async () => {
	const { status } = await authApi.forgotPassword(state.email || '')
		
	if (status.value === 'success') {
		toast.add({ 
			title: 'Инструкции отправлены!', 
			description: 'Проверьте вашу почту',
			color: 'success' 
		})
		navigateTo('/sign-in')
		return
	}
}
</script>
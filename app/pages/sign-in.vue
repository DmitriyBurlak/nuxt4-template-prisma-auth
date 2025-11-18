<template>
	<div class="relative py-[100px] pt-[80px] md:pt-[140px] flex flex-col items-center justify-center overflow-hidden">
		<div class="text-center">
			<h1>Войти</h1>
		</div>

		<div class="px-3 py-6 sm:p-6 md:p-10 !mt-6 border-white/10 rounded-2xl max-w-lg w-full bg-gray-100">
			<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
				<NFormField label="Email" name="email" required>
					<NInput v-model="state.email" class="w-full" placeholder="Введите email" />
				</NFormField>

				<NFormField label="Пароль" name="password" class="!w-full" required>
					<NPasswordInput v-model="state.password" placeholder="Введите пароль" class="!w-full" />
				</NFormField>

				<div class="flex items-center justify-end">
					<NuxtLink to="/forgot-password" class="text-blue-500 text-sm font-semibold hover:text-blue-400 transition duration-400">Забыли пароль?</NuxtLink>
				</div>

				<div class="pt-4">
					<NButton
						type="submit"
						color="secondary"
						size="lg"
						class="w-full flex justify-center"
					>
						Авторизоваться
					</NButton>
				</div>
			</UForm>

			<div class="flex flex-col gap-4 pt-6">
				<div class="mt-2 text-neutral-400 text-sm">
					У вас еще нет учетной записи?
					<NuxtLink to="/sign-up" class="text-blue-500 font-semibold hover:text-blue-400 ml-1 transition duration-400">Зарегистрируйтесь</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuth } from '~/entities/auth';
import { useRoute } from 'vue-router';
import { NButton, NInput, NFormField, NPasswordInput } from '~/shared/ui';
import { z } from 'zod';

useHead({ title: 'Войти' });

definePageMeta({ 
	middleware: ['auth'],
})

const route = useRoute();
const toast = useToast();
const auth = useAuth()

const success = ref(route.query.success as string)

if (success.value) {
	toast.add({ 
		title: 'Email успешно подтвержден!', 
		color: 'success' 
	})
}

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
  remember: undefined
})

const schema = z.object({
  email: z.string().nonempty('Обязательное поле').email('Неверный формат email'),
  password: z.string().nonempty('Обязательное поле').min(8, 'Пароль должен содержать минимум 8 символов'),
  remember: z.boolean().optional(),
})

const onSubmit = async () => {
	await auth.login({ email: state.email || '', password: state.password || '' })
}
</script>
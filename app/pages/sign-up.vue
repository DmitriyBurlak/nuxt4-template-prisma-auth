<template>
	<div class="relative py-[100px] pt-[80px] md:pt-[140px] flex flex-col items-center justify-center overflow-hidden">
		<div class="text-center">
			<h1>Создать аккаунт</h1>
		</div>

		<div class="px-3 py-6 sm:p-6 md:p-10 !mt-6 border-white/10 rounded-2xl max-w-lg w-full bg-gray-100">
			<UForm
				:state="state"
				:schema="schema"
				class="space-y-4"
				@submit="onSubmit"
			>
				<div class="grid grid-cols-2 gap-4">
					<NFormField label="Имя" name="fullname" class="col-span-2" required>
						<NInput v-model="state.fullname" class="w-full" placeholder="Введите имя" app-color />
					</NFormField>

					<NFormField label="Email" name="email" class="col-span-2" required>
						<NInput v-model="state.email" type="email" class="w-full" placeholder="Введите email" app-color />
					</NFormField>

					<NFormField label="Пароль" name="password" required class="col-span-2 sm:col-span-1">
						<NPasswordInput v-model="state.password" placeholder="Введите пароль" class="!w-full" app-color />
					</NFormField>

					<NFormField label="Повторить пароль" name="password_confirm" required class="col-span-2 sm:col-span-1">
						<NPasswordInput v-model="state.password_confirm" placeholder="Введите пароль" class="!w-full" app-color />
					</NFormField>
				</div>

				<NFormField name="accepted">
					<div class="flex items-start">
						<NCheckbox v-model="state.accepted" class="mr-2 cursor-pointer" app-color />
						<span class="text-neutral-700 text-sm">
							Я даю согласие на обработку своих персональных данных и соглашаюсь c 
							<span class="text-blue-600 hover:text-blue-400 transition duration-400">
								политикой конфиденциальности
							</span>
						</span>
					</div>
				</NFormField>

				<div class="pt-4">
					<NButton
						type="submit"
						color="secondary"
						glow-type
						size="lg"
						class="w-full flex justify-center"
					>
						Зарегистрироваться
					</NButton>
				</div>

				<div class="mt-6 text-neutral-400 text-sm text-center">
					У вас уже есть учетная запись?
					<NuxtLink to="/sign-in" class="text-blue-500 font-semibold hover:text-blue-400 ml-1 transition duration-400">Войти</NuxtLink>
				</div>
			</UForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { auth as authApi } from '~/entities/auth';
import { NButton, NCheckbox, NInput, NFormField, NPasswordInput } from '~/shared/ui';
import { z } from 'zod';

useHead({ title: 'Регистрация' });

definePageMeta({ 
	middleware: ['auth'],
})

const toast = useToast()

const schema = z.object({
	fullname: z.string().nonempty('Обязательное поле').min(2, 'Имя должно содержать минимум 2 символа'),
	email: z.string().nonempty('Обязательное поле').email('Неверный формат email'),
	password: z.string().nonempty('Обязательное поле').min(8, 'Пароль должен содержать минимум 8 символов'),
	password_confirm: z.string().nonempty('Обязательное поле').nonempty('обязательное поле'),
	accepted: z.boolean({ message: 'Необходимо принять условия использования'}).refine(val => val === true, {
		message: 'Необходимо принять условия использования'
	})
}).refine(data => data.password === data.password_confirm, {
	message: 'Пароли не совпадают',
	path: ['password_confirm'] // Указывает, к какому полю привязать ошибку
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	fullname: '',
	email: '',
	password: '',
	password_confirm: '',
	accepted: false
})

const clearState = () => {
	state.fullname = ''
	state.email = ''
	state.password = ''
	state.password_confirm = ''
	state.accepted = false
}

const onSubmit = async () => {
	const { data, status } = await authApi.register({
		fullname: state.fullname || '',
		email: state.email || '',
		password: state.password || '',
	})

	if ( status?.value === 'success' ) {
		toast.add({ 
			title: data.value?.message || 'Регистрация прошла успешно. Проверьте email для подтверждения.', 
			color: 'success' 
		})
		clearState()
		navigateTo('/sign-in')
	}
}

</script>
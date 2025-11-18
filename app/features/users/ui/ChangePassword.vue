<template>
	<div
		ref="formContainer"
		class="overflow-hidden"
		:class="{ 'transition-all duration-500 ease-in-out': !skipTransition }"
		:style="{ maxHeight: showPasswordForm ? formHeight + 'px' : '0' }"
	>
		<UForm
			:state="state"
			:schema="schema"
			class="bg-white shadow-sm border border-neutral-200 p-6 rounded-xl"
			@submit="onSubmit"
		>
			<div class="grid gap-4">
				<NFormField label="Текущий пароль" name="password_old">
					<NInput v-model="state.password_old" type="password" class="w-full" placeholder="Введите пароль" app-color />
				</NFormField>
			
				<NFormField label="Новый пароль" name="password">
					<NInput v-model="state.password" type="password" class="w-full" placeholder="Введите пароль" app-color />
				</NFormField>

				<NFormField label="Подтвердите пароль" name="password_confirm">
					<NInput v-model="state.password_confirm" type="password" class="w-full" placeholder="Введите пароль" app-color />
				</NFormField>
			</div>

			<div class="pt-8 flex justify-end">
				<NButton
					type="submit"
					color="secondary"
					variant="outline"
					size="md"
				>
					Обновить пароль
				</NButton>
			</div>
		</UForm>
	</div>
</template>

<script setup lang="ts">
import { NButton, NInput, NFormField } from '~/shared/ui';
import { auth as authApi } from '~/entities/auth';
import { z } from 'zod';

const showPasswordForm = defineModel({ type: Boolean })
const formHeight = ref(0)
const formContainer = ref<HTMLElement | null>(null)
const toast = useToast()
const skipTransition = ref(false)

const schema = z.object({
	password_old: z.string('обязательное поле').nonempty('обязательное поле'),
	password: z.string('обязательное поле').nonempty('обязательное поле').min(8, 'Пароль должен содержать минимум 8 символов'),
	password_confirm: z.string('обязательное поле').nonempty('обязательное поле'),
}).refine(data => data.password === data.password_confirm, {
  message: 'Пароли не совпадают',
  path: ['password_confirm'] // Указывает, к какому полю привязать ошибку
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	password_old: undefined,
	password: undefined,
	password_confirm: undefined,
})

const clearState = () => {
	state.password = undefined
	state.password_old = undefined
	state.password_confirm = undefined
}

const onSubmit = async () => {
	if (!state.password_old || !state.password) return
	
	const { status, data } = await authApi.changePasswordUser({ oldPass: state.password_old, newPass: state.password })
	
	if (status.value === 'success') {
		toast.add({ 
			title: data.value?.message, 
			color: 'success' 
		})
		clearState()
		return
	}
}

let resizeObserver: ResizeObserver | null = null

const updateHeight = () => {
	if (formContainer.value) {
		formHeight.value = formContainer.value.scrollHeight + 10
	}
}

watch(() => showPasswordForm.value, (newVal) => {
	if (newVal) {
		skipTransition.value = false
		nextTick(() => {
			updateHeight()
			
			if (formContainer.value && !resizeObserver) {
				resizeObserver = new ResizeObserver(() => {
					if (showPasswordForm.value) {
						skipTransition.value = true
						updateHeight()
						setTimeout(() => {
							skipTransition.value = false
						}, 50)
					}
				})
				resizeObserver.observe(formContainer.value)
			}
		})
	} else {
		skipTransition.value = false
		// Отключаем наблюдатель при закрытии
		if (resizeObserver) {
			resizeObserver.disconnect()
			resizeObserver = null
		}
	}
})

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect()
		resizeObserver = null
	}
})

</script>

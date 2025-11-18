<template>
	<UCard 
		class="lg:col-span-2"
		:ui="{
			root: 'bg-white shadow-sm ring-1 ring-neutral-200',
			body: 'p-6'
		}"
	>
		<template #header>
			<div class="flex items-center gap-2">
				<UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-neutral-600" />
				<h4 class="text-lg font-semibold text-neutral-900">Личные данные</h4>
			</div>
		</template>

		<UForm
			:state="state"
			:schema="schema"
			class="space-y-5"
			@submit="onSubmit"
		>
			<div class="grid gap-5 md:grid-cols-2">
				<NFormField label="ФИО" name="fullname" class="md:col-span-2">
					<NInput 
						v-model="state.fullname" 
						class="w-full" 
						placeholder="Введите ваше полное имя"
						leading-icon="i-heroicons-user"
					/>
				</NFormField>

				<NFormField label="Телефон" name="phone">
					<BInputMask
						v-model="state.phone"
						mask="+7 (###) ###-##-##"
						placeholder="Ваш телефон"
					/>
				</NFormField>

				<NFormField label="Email" name="email">
					<NInput 
						v-model="state.email" 
						type="email" 
						disabled 
						class="w-full" 
						placeholder="Ваш email"
						leading-icon="i-heroicons-envelope"
					/>
				</NFormField>
			</div>

			<hr class="border-0 h-px bg-neutral-200" />

			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<UButton
					variant="ghost"
					color="neutral"
					icon="i-heroicons-lock-closed"
					@click="emit('change-password')"
				>
					Изменить пароль
				</UButton>

				<div class="flex gap-3 w-full sm:w-auto">
					<UButton
						type="button"
						variant="soft"
						color="neutral"
						@click="resetForm"
						class="flex-1 sm:flex-none"
					>
						Отменить
					</UButton>

					<NButton
						type="submit"
						color="secondary"
						variant="outline"
						size="md"
						class="flex-1 sm:flex-none"
					>
						Сохранить изменения
					</NButton>
				</div>
			</div>
		</UForm>
	</UCard>
</template>

<script setup lang="ts">
import { auth as authApi } from '~/entities/auth';
import { NButton, NInput, NFormField, BInputMask} from '~/shared/ui'
import { getChangedFields, lightMask } from '~/shared/lib/helpers'
import { z } from 'zod'
import type { USERS } from '~~/shared/types/users'

interface Props {
	user: USERS.UserBase | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'change-password': []
	'update:user': [user: USERS.UserBase]
}>()

const toast = useToast()

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

const initialData = ref<Partial<Schema>>({})

const onSubmit = async () => {
	const params = getChangedFields<Partial<Schema>>(state, initialData.value)

	if (Object.keys(params).length === 0) {
		toast.add({ 
			title: 'Нет изменений для сохранения', 
			color: 'error' 
		})
    return
  }

	const { data } = await authApi.updateMe(params as Partial<USERS.UserBase>)

	if (data.value?.user?.id) {
		emit('update:user', data.value.user)

		toast.add({ 
			title: 'Данные успешно изменены', 
			color: 'success' 
		})
	}
}

const formatPhone = (phone: string | null | undefined): string | undefined => {
	if (!phone) return undefined
	const mask = '+7 (###) ###-##-##'
	return lightMask(phone, mask)
}

const setState = (userInfo: USERS.UserBase | null) => {
	if (!userInfo) return
	const { phone, email, fullname, avatar } = userInfo
	
	state.fullname = fullname 
	state.email = email 
	state.phone = formatPhone(phone)
	state.avatar = avatar || undefined
	initialData.value = { ...state }
}

const resetForm = () => {
	setState(props.user)
	toast.add({ 
		title: 'Изменения отменены', 
		color: 'neutral' 
	})
}

watch(() => props.user, (newVal) => {
	setState(newVal)
}, { immediate: true })
</script>


<template>
	<UCard 
		class="lg:col-span-1"
		:ui="{
			root: 'bg-white shadow-sm ring-1 ring-neutral-200',
			body: 'p-6'
		}"
	>
		<div class="flex flex-col gap-4 items-center">
			<UAvatar
				:alt="user?.fullname"
				size="3xl"
				class="w-24 h-24 ring-4 ring-blue-100"
			/>

			<div class="text-center">
				<h4 class="text-xl font-semibold text-neutral-900">
					{{ user?.fullname }}
				</h4>
				<p class="text-sm text-gray-600 mt-1">
					{{ user?.email }}
				</p>
			</div>

			<hr class="w-full border-0 h-px bg-neutral-200" />

			<div class="w-full space-y-3">
				<div class="flex items-center gap-3 text-sm">
					<UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-500" />
					<span class="text-neutral-700">Аккаунт активен</span>
				</div>
				<div class="flex items-center gap-3 text-sm">
					<UIcon name="i-heroicons-calendar" class="w-5 h-5 text-blue-500" />
					<span class="text-neutral-700">Дата регистрации: {{ user?.createdAt ? calendarHelper.format(user?.createdAt) : 'Не указана' }}</span>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { USERS } from '~~/shared/types/users';
import { useCalendarHelper } from "~/shared/lib/composables/useCalendarHelper";

const calendarHelper = useCalendarHelper()

interface Props {
	user: USERS.UserBase | null
}

defineProps<Props>()
</script>


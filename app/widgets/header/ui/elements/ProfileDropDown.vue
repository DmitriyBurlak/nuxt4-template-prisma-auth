<template>
	<div
    class="relative inline-block"
	>
		<UDropdownMenu
			v-model:open="isOpen"
			:items="items"
			:modal="true"
			:arrow="true"
			:content="{
				onFocusOutside: ((event) => console.log('event', event))
			}"
			:ui="{
				content: 'w-48'
			}"
		>
			<UAvatar
				:alt="authStore.user?.fullname"
				size="md"
				class="w-8 h-8 md:w-10 md:h-10"
			/>
		</UDropdownMenu>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/entities/auth/model"
import { authModel } from "~/entities/auth"
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const useAuth = authModel.useAuth()

const isOpen = ref(false)

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Личный кабинет',
      icon: 'i-lucide-monitor',
			to: '/workspace'
    },
  ],
  [
    {
      label: 'Выход',
      icon: 'i-lucide-log-out',
			onSelect() {
				useAuth.logout()
			}
    }
  ]
])

</script>
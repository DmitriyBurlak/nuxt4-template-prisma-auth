<script setup lang="ts">
import { useAuthStore } from '~/entities/auth';

const authStore = useAuthStore();
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-neutral-900 mb-2">
			Добро пожаловать {{ authStore?.user?.fullname }}!
		</h3>

		<div class="pt-8 text-1xl flex flex-col gap-1">
			Закрытая страница
			<span>Доступ только для авторизованных пользователей</span>
		</div>
	</div>
</template>
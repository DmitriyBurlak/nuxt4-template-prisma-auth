<template>
	<div>
		<UButton
			icon="i-heroicons-bars-3"
			variant="ghost"
			aria-label="Открыть меню"
			class="xl md:hidden"
			@click="isOpenMenu = true"
		/>

		<USlideover
			v-model:open="isOpenMenu"
			side="left"
			title="Меню навигации"
			description="Навигационное меню приложения"
			:ui="{ 
				title: 'sr-only',
				description: 'sr-only'
			}"
		>
			<template #content>
				<div class="p-4">
					<div class="flex justify-end">
						<UButton
							icon="i-heroicons-x-mark"
							variant="ghost"
							aria-label="Открыть меню"
							class="max-w-max"
							@click="isOpenMenu = false"
						/>
					</div>

					<USeparator class="py-4" />

					<nav class="flex flex-col gap-2">
						<ULink
							v-for="(item, index) in links"
							:key="index"
							class="rounded-lg transition-colors text-base hover:text-green-400 cursor-pointer"
							@click="handleMobileNavClick(item.path)"
						>
							<div class="flex items-center gap-3">
								<UIcon :name="item?.icon || ''" class="w-5 h-5 flex-shrink-0" />
								<span>{{ item?.title || '' }}</span>
							</div>
						</ULink>
					</nav>

					<USeparator class="py-4" />

					<div class="space-y-3">
						<ULink
							to="tel:+79199999999"
							class="flex items-center gap-2 hover:text-green-400"
						>
							<UIcon name="i-heroicons-phone" class="w-5 h-5" />
							+7 (919) 99-99-999
						</ULink>

						<ULink
							to="mailto:test@mail.ru"
							class="flex items-center gap-2 hover:text-green-400"
						>
							<UIcon name="i-heroicons-envelope" class="w-5 h-5" />
							test@mail.ru
						</ULink>

						<div class="flex items-start gap-2">
							<UIcon name="i-heroicons-map-pin" class="w-5 h-5 mt-0.5" />
							<p>г. Москва, ул. Пушечная, д. 3, офис 10</p>
						</div>
						
						<div class="flex items-center gap-2">
							<UIcon name="i-heroicons-clock" class="w-5 h-5" />
							<p>Пн-Пт: 9:00-18:00</p>
						</div>
					</div>
				</div>
			</template>
		</USlideover>
	</div>
</template>

<script setup lang="ts">
const { links } = defineProps<{ links: Array<{ title: string; path: string; }> }>()
const isOpenMenu = ref(false)

const handleMobileNavClick = (path: string) => {
	isOpenMenu.value = false
	navigateTo(path)
}

</script>
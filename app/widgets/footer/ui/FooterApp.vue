<template>
	<footer class="pt-12 pb-10 bg-gray-300">
		<div class="container layout mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-left pb-10">
			<!-- Блок 1: Описание и соцсети -->
			<div>
				<div class="text-xl font-bold text-gray-600 mb-3 text-gradient ">Site Name</div>
				<div class="text-base text-neutral-500 mb-6">
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry
				</div>
			</div>

			<div>
				<div class="text-xl font-bold text-gray-600 mb-3">Услуги</div>
				<ul class="space-y-2 text-neutral-500">
					<li>Услуга 1</li>
					<li>Услуга 2</li>
					<li>Услуга 3</li>
					<li>Услуга 4</li>
				</ul>
			</div>

			<div>
				<div class="text-xl font-bold text-gray-600 mb-3">Меню</div>
				<ul class="space-y-2 text-neutral-500">
					<li
						v-for="link in companyLinks" 
						:key="link.path"
					>
						<NuxtLink 
							class="hover:text-neutral-800 transition cursor-pointer"
							:to="link.path"
						>
							{{ link.title }}
						</NuxtLink>
					</li>
				</ul>
			</div>

			<div>
				<div class="text-xl font-bold text-gray-600 mb-3">Контакты</div>
				<ul class="space-y-3 text-neutral-500">
					<li class="flex items-center gap-2">
						<span class="inline-block">
							<UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
						</span>
						г. Москва, ул. Пушечная, д. 3, офис 10
					</li>
					<ULink
						to="tel:+79199999999"
						class="flex items-center gap-2 text-neutral-500 hover:text-neutral-800"
					>
						<UIcon name="i-heroicons-phone" class="w-5 h-5" />
						+7 (919) 99-99-999
					</ULink>

					<ULink
						to="mailto:test@mail.ru"
						class="flex items-center gap-2 text-neutral-500 hover:text-neutral-800"
					>
						<UIcon name="i-heroicons-envelope" class="w-5 h-5" />
						test@mail.ru
					</ULink>

					<li class="flex items-center gap-2">
						<span class="inline-block">
							<UIcon name="i-heroicons-clock" class="w-5 h-5" />
						</span>
						Пн–Пт: 9:00 – 18:00
					</li>
				</ul>
			</div>
		</div>

		<!--<div class="container py-6 flex justify-center md:justify-end text-sm">
			<ULink
				to="/others/policy"
				class=" text-neutral-500 hover:text-neutral-800"
			>
				Политика конфиденциальности
			</ULink>
		</div>-->

		<div class="pt-6 text-center text-sm border-t-1">
			© 2023 Site Name. All rights reserved.
		</div>
	</footer>
</template>

<script setup lang=ts>
const companyLinks = ref([
	{
		title: 'О нас',
		path: '/about_us',
		icon: 'i-heroicons-briefcase',
	},
	{
		title: 'Новости',
		path: '/news',
		icon: 'i-heroicons-briefcase',
	},
	{
		title: 'Контакты',
		path: '/contacts',
		icon: 'i-heroicons-envelope',
	}
])
</script>
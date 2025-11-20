<script setup lang="ts">
import { NButton } from '~/shared/ui';

</script>

<template>
	<section class="container py-16 space-y-12">
		<div class="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-10 py-12 text-white shadow-2xl shadow-slate-900/30">
			<p class="text-sm tracking-[0.3em] uppercase text-slate-300">Nuxt 4 + Prisma + Auth</p>
			<h1 class="mt-4 text-4xl font-semibold leading-tight sm:text-5xl pt-4">
				Готовый шаблон для безопасных корпоративных кабинетов и публичных сайтов.
			</h1>
			<p class="mt-6 text-lg text-slate-200 sm:text-xl">
				Проект демонстрирует отработанную архитектуру авторизации, управление профилем и удобную структуру модулей.
				Используйте его как стартовую точку.
			</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<NButton
					to="https://github.com/DmitriyBurlak/nuxt4-template-prisma-auth"
					target="_blank"
					class="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
				>
					Посмотреть функционал
				</NButton>
			</div>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
				<h2 class="text-2xl font-semibold text-slate-900">Основные модули</h2>
				<ul class="mt-6 space-y-3 text-slate-600">
					<li class="flex items-start gap-3">
						<span class="mt-1 inline-block h-2 w-2 rounded-full bg-lime-500"></span>
						<div>
							<p class="font-medium text-slate-900">JWT авторизация</p>
							<p>Готовая серверная утилита для выдачи и валидации токенов.</p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 inline-block h-2 w-2 rounded-full bg-lime-500"></span>
						<div>
							<p class="font-medium text-slate-900">Управление профилем</p>
							<p>Компоненты для редактирования данных.</p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 inline-block h-2 w-2 rounded-full bg-lime-500"></span>
						<div>
							<p class="font-medium text-slate-900">Набор страниц</p>
							<p>Готовые примеры публичных разделов: новости, контакты, о компании.</p>
						</div>
					</li>
				</ul>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
				<h2 class="text-2xl font-semibold text-slate-900">Что даёт шаблон</h2>
				<p class="mt-6 text-slate-600">
					Быстрый старт проектов без долгой настройки инфраструктуры: CI/CD на GitLab, единый стиль интерфейса,
					подключенные серверные утилиты и продуманная файловая структура.
				</p>
				<div class="mt-8 grid gap-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
					<span class="rounded-xl bg-slate-100 px-4 py-3 text-slate-900">SSR + SSG</span>
					<span class="rounded-xl bg-slate-100 px-4 py-3 text-slate-900">Tailwind Ready</span>
					<span class="rounded-xl bg-slate-100 px-4 py-3 text-slate-900">Prisma ORM</span>
					<span class="rounded-xl bg-slate-100 px-4 py-3 text-slate-900">Готовый CI</span>
				</div>
			</div>
		</div>
	</section>
</template>
<template>
	<div class="flex flex-col flex-1 min-h-screen relative m-auto overflow-x-hidden w-full">
		<HeaderApp />
		<div class="flex-1 w-full">
			<slot />
		</div>
		<FooterApp class="mt-auto" />
	</div>
</template>

<script setup lang="ts">
import { HeaderApp } from '~/widgets/header';
import { FooterApp } from '~/widgets/footer';
</script>
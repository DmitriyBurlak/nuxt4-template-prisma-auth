<template>
	<div class="flex flex-col gap-1 h-screen relative m-auto bg-gray-50">
		<HeaderWorkSpace />

		<div class="flex flex-1 overflow-hidden pb-2 w-full">
			<NavigationMenu class="hidden lg:block !m-1 !mt-0" />
			<div class="flex-1 p-6 overflow-y-auto overflow-x-hidden">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { HeaderWorkSpace } from '~/widgets/header';
import { NavigationMenu } from '~/widgets/workspace';
</script>
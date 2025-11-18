<template>
	<NuxtPage />
</template>

<script setup>
definePageMeta({ 
	middleware: ['auth'],
	layout: 'workspace'
})
</script>
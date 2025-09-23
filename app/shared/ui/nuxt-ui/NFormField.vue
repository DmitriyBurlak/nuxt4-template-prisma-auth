<template>
	<UFormField
		:label
		:name
		:description
		:required
		:disabled
		:hint
		:help
		:error
		:ui="{
			error: 'text-red-700',
			label: 'text-neutral-800',
		}">
		<slot />
	</UFormField>
</template>

<script setup lang="ts">

interface Props {
  label?: string
  name: string
	description?: string
  disabled?: boolean
	required?: boolean
	hint?: string
	help?: string
	error?: string
}

withDefaults(defineProps<Props>(), {
	label: undefined,
	description: '',
	disabled: false,
	required: false,
	appColor: false,
	hint: undefined,
	help: undefined,
	error: undefined,
})
</script>
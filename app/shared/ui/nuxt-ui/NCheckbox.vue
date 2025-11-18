<template>
  <UCheckbox 
		:label
		:size
		:color="color"
    :variant
		:indicator
		:disabled
		:required
		:icon
    :ui="{
      label: '!text-neutral-700',
      indicator: `flex items-center justify-center size-full text-inverted  ${appColor && 'bg-transparent text-blue-500'}`,
			base: `${appColor && 'ring-1 ring-inset ring-neutral-300 hover:ring-neutral-400 transition duration-200'}`,
    }"
  />
</template>


<script setup lang="ts">

interface Props {
  label?: string
  color?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
  variant?: 'card' | 'list'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  indicator?: 'start' | 'end' | 'hidden'
	icon?: string
  disabled?: boolean
	required?: boolean
	appColor?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'secondary',
	label: '',
	variant: 'list',
	size: 'md',
	indicator: 'start',
	icon: '',
	disabled: false,
	required: false,
	appColor: false,
})
</script>

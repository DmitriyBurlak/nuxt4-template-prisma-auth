<template>
  <UInput 
		:label
		:placeholder
		:type
		:color="color"
    :variant
		:size
		:disabled
		:required
		:autocomplete
		:icon
		:leading
		:leading-icon="leadingIcon"
		:trailing-icon="trailingIcon"
		:avatar
		:loading
		:loading-icon="loadingIcon"
		:ui="{
			base: [
				'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-neutral-100 focus:outline-none border-0',
				'bg-white',
				'text-neutral-900 placeholder:text-neutral-400',
				'!ring-1 ring-inset ring-neutral-300',
				'hover:ring-1 hover:ring-neutral-400',
				'focus:ring-2 focus:ring-blue-500',
				'transition duration-200',
			],
			leading: 'pl-3',
			trailing: 'pr-3',
		}"
  />
</template>


<script setup lang="ts">

interface Props {
	type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'number' | 'range' | 'color' | 'checkbox' | 'radio' | 'file' | 'hidden' | 'button' | 'reset' | 'submit'
	placeholder?: string
  label?: string
  color?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
  variant?: 'outline' | 'soft' | 'subtle' | 'ghost' | 'none'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
	required?: boolean
	autocomplete?: 'on' | 'off'
	icon?: string
	leading?: boolean
	leadingIcon?: string
	trailingIcon?: string
	loading?: boolean
	loadingIcon?: string
	avatar?: {
		src: string
	} | undefined
	appColor?: boolean
}

withDefaults(defineProps<Props>(), {
	type: 'text',
	placeholder: '',
  color: 'secondary',
	label: '',
	variant: 'subtle',
	size: 'md',
	icon: '',
	disabled: false,
	required: false,
	appColor: false,
	autocomplete: 'off',
	leadingIcon: '',
	trailingIcon: '',
	loadingIcon: '',
	avatar: undefined
})
</script>
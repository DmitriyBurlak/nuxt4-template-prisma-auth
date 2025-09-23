<template>
  <UButton 
		:icon
    :color
    :variant
		:label
		:avatar
		:size
		:to
		:target
		:loading
		:disabled
		:trailing-icon
		:type
    :ui="{ base: `transition-all duration-300  active:scale-90`}"
  >
		<span>
			<slot/>
		</span>
  </UButton>
</template>


<script setup lang="ts">
import { UButton } from '#components'

interface Props {
  color?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
  icon?: string
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
  label?: string
  avatar?: { src: string; alt?: string }
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  to?: string
  target?: string
  loading?: boolean
  disabled?: boolean
  trailingIcon?: string
	type?: 'submit' | 'button' | 'reset'
}

defineProps<Props>()
</script>
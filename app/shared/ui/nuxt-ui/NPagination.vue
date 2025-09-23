<template>
	<UPagination
		:total
		:active-color="activeColor"
		:variant
		:active-variant="activeVariant"
		:color
		:size
	/>
</template>


<script setup lang="ts">

interface Props {
  total: number
	activeColor?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
  color?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
 	variant?: 'outline' | 'soft' | 'subtle' | 'ghost' | 'link' | 'solid'
	activeVariant?: 'outline' | 'soft' | 'subtle' | 'ghost' | 'link' | 'solid'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
	activeColor: 'secondary',
	color: 'neutral',
	variant: 'outline',
	activeVariant: 'outline',
	size: 'md',
})
</script>

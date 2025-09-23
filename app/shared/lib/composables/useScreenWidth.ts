import { computed, onMounted, onUnmounted, ref } from 'vue'

export const useScreenWidth = (screenWidth: number = 768) => {
	const isCurrentWidth = ref(false)
	const innerWidth = ref(0)
	const isMobile = computed(() => innerWidth.value < 768)
	const isTable = computed(() => innerWidth.value < 1024)

	const checkScreenWidth = () => {
		isCurrentWidth.value = window.innerWidth < screenWidth
		innerWidth.value = window.innerWidth
	}

	onMounted(() => {
		checkScreenWidth()
		window.addEventListener('resize', checkScreenWidth)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', checkScreenWidth)
	})

	return {
		checkScreenWidth,
		isMobile,
		isTable,
		isCurrentWidth,
		innerWidth
	}
}
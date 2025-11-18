<template>
	<div class="w-full">
		<UInput 
			v-model="password"
			:label
			:placeholder
			:type="show ? 'text' : 'password'"
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
				root: 'w-full',
				leading: 'pl-3',
				trailing: 'pr-3',
			}"
		>
			<template #trailing>
				<UButton
					color="neutral"
					variant="link"
					size="sm"
					:icon="show ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
					:aria-label="show ? 'Hide password' : 'Show password'"
					:aria-pressed="show"
					aria-controls="password"
					@click="show = !show"
				/>
			</template>
		</UInput>
		<p v-if="isShowStrength && passwordStrength" class="mt-2 text-sm" :class="strengthClass">
			{{ passwordStrength }}
		</p>
	</div>
</template>


<script setup lang="ts">
const show = ref(false)
const password = defineModel({ type: String })

const hasLength = computed(() => password.value.length >= 8);
const hasNumber = computed(() => /\d/.test(password.value));
const hasSpecial = computed(() => /[!@#$%^&*]/.test(password.value));
const hasUppercase = computed(() => /[A-Z]/.test(password.value));

const passwordStrength = computed(() => {
  if (!password.value) return '';
  
  const strength = [
    hasLength.value,
    hasNumber.value,
    hasSpecial.value,
    hasUppercase.value
  ].filter(Boolean).length;
  
  const messages = [
    'Очень слабый',
    'Слабый',
    'Средний',
    'Сильный',
    'Очень сильный'
  ];
  
  return `Надежность пароля: ${messages[strength]}`;
});

const strengthClass = computed(() => {
  if (!password.value) return 'text-gray-500';
  
  const strength = [
    hasLength.value,
    hasNumber.value,
    hasSpecial.value,
    hasUppercase.value
  ].filter(Boolean).length;
  
  const classes = [
    'text-rose-400',
    'text-amber-400',
    'text-amber-300',
    'text-emerald-400',
    'text-emerald-300'
  ];
  
  return classes[strength];
});

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
	isShowStrength?: boolean
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
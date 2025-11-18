<template>
	<div
		class="app-input"
		:class="[{
			'active': stateInput.isFocus,
			'disabled': disabled,
		}]"
	>
		<label
			v-if="label"
			class="label"
		>
			{{ label }}
		</label>

		<div class="app-input__wrapper">
			<input
				v-model="stateInput.value"
				:autocomplete="autocomplete ? 'on' : 'off'"
				:placeholder
				:disabled
				:class="[
					'text-neutral-900 placeholder:text-neutral-400',
					'relative block w-full px-2.5 py-[6px] rounded-md disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-neutral-100 !disabled:text-neutral-500 disabled:!text-neutral-500 focus:outline-none border-0',
					'bg-white',
					'!ring-1 ring-inset ring-neutral-300',
					`${stateInput.isFocus && 'focus:!ring-2 focus:!ring-blue-500'}`,
					'hover:ring-1 hover:ring-neutral-400',
					'transition duration-200',
				]"
				@focus="addFocus"
				@blur="removePicker"
				@input="updateValue"
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { lightMask } from '~/shared/lib/helpers';

const modelValue = defineModel({ type: String })
const emit = defineEmits(['update:modelValue', 'update:value', 'input', 'blur'])

const props = withDefaults(
	defineProps<{
		value?: string | number,
		placeholder?: string,
		label?: string,
		mask?: string,
		type?: string,
		name?: string,
		autocomplete?: boolean,
		disabled?: boolean,
		offValidation?: boolean
	}>(),
	{
		placeholder: '',
		label: '',
		mask: '',
		type: '',
		name: '',
		error: '',
		value: '',
	},
)

interface StateInput {
	value: string
	validValue: string
	isFocus: boolean
}

const stateInput: StateInput = reactive({
	value: '',
	validValue: '',
	isFocus: false,
})

stateInput.value = modelValue.value || ''

const checkMask = (value: string) => {
	if (!props.mask) {
		return value
	}
	return lightMask(value, props.mask)
}

const updateValue = (event: Event) => {
	let value = (event.target as HTMLInputElement).value
	value = checkMask(value)
	stateInput.value = value

	if (stateInput.validValue !== value) {
		stateInput.validValue = value
		emit('update:modelValue', value)
		emit('update:value', value)
		emit('input', value)
	}
}

const addFocus = () => {
	stateInput.isFocus = true
}

const removePicker = () => {
	stateInput.isFocus = false
	stateInput.value = modelValue.value || ''
	stateInput.validValue = modelValue.value || ''
	emit('blur')
}
</script>

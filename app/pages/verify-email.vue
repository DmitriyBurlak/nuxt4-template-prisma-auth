<template>
	<div class="relative py-[100px] pt-[140px] flex flex-col items-center justify-center overflow-hidden">
		<div v-if="isVerifying" class="flex flex-col gap-4 items-center">
			<UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-500 animate-spin" />
			<p class="text-neutral-300">Подтверждение email...</p>
		</div>
		
		<template v-else>
			<!-- Если есть токен в URL - показываем результат верификации -->
			<div v-if="state.token" class="text-center max-w-2xl">
				<div v-if="verificationSuccess" class="flex flex-col gap-4 items-center">
					<UIcon name="i-heroicons-check-circle" class="w-20 h-20 text-green-500" />
					<h1 class="text-gradient">Email успешно подтвержден!</h1>
					<p class="text-neutral-600">
						Ваш адрес электронной почты был успешно подтвержден. Теперь вы можете войти в систему.
					</p>
					<NButton
						color="secondary"
						glow-type
						size="lg"
						class="mt-6"
						@click="navigateTo('/sign-in')"
					>
						Перейти ко входу
					</NButton>
				</div>
				
				<div v-else class="flex flex-col gap-4 items-center">
					<UIcon name="i-heroicons-x-circle" class="w-20 h-20 text-red-500" />
					<h1 class="text-gradient">Ошибка подтверждения</h1>
					<p class="text-neutral-600">
						{{ verificationError || 'Не удалось подтвердить email. Возможно, ссылка устарела или уже была использована.' }}
					</p>
					<div>
						<NButton
							color="secondary"
							glow-type
							size="lg"
							class="mt-6"
							@click="state.token = ''"
						>
							Отправить повторно
						</NButton>
					</div>
				</div>
			</div>

			<div v-if="!state.token" class="w-full max-w-xl">
				<div class="text-center mb-4">
					<h1 class="text-gradient">Подтверждение электронной почты</h1>
					<p class="text-neutral-600 mt-4 text-base">
						Мы отправили вам письмо с ссылкой для подтверждения вашего адреса электронной почты.
					</p>
					<p class="text-neutral-600 mt-2 text-base">
						Если письмо не пришло, проверьте папку "Спам" или запросите повторную отправку.
					</p>
				</div>

				<div class="block-with-glow">
					<div class="p-10! border-white/10 rounded-2xl bg-gray-100">
						<UForm
							:state="state"
							:schema="resendSchema"
							class="space-y-4"
							@submit="onResendEmail"
						>
							<NFormField label="Email" name="email" required>
								<NInput 
									v-model="state.email" 
									type="email" 
									class="w-full" 
									placeholder="Введите ваш email" 
									app-color 
									:disabled="isResending"
								/>
							</NFormField>

							<div class="pt-4">
								<NButton
									type="submit"
									color="secondary"
									glow-type
									size="lg"
									class="w-full flex justify-center"
									:loading="isResending"
									:disabled="isResending"
								>
									{{ isResending ? 'Отправка...' : 'Отправить письмо повторно' }}
								</NButton>
							</div>
						</UForm>

						<div class="mt-6 text-neutral-600 text-sm text-center">
							Уже подтвердили email?
							<NuxtLink to="/sign-in" class="text-neutral-600 font-semibold hover:text-blue-400 ml-1 transition duration-400">
								Войти
							</NuxtLink>
						</div>
					</div>
				</div>

				<UAlert
					icon="i-heroicons-exclamation-triangle"
					color="warning"
					variant="soft"
					title="Проблемы с получением письма?"
					description="Если вы используете VPN, он может блокировать отправку писем. Попробуйте отключить VPN и запросить письмо повторно."
					class="mt-6"
				/>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { auth as authApi } from '~/entities/auth';
import { NButton, NInput, NFormField } from '~/shared/ui';
import { z } from 'zod';

useHead({ title: 'Подтверждение email' });

definePageMeta({ 
	middleware: ['auth'],
})

const route = useRoute();
const toast = useToast();

const state = reactive({
	email: (route.query.email as string) || '',
	token: (route.query.token as string) || '',
})

const isVerifying = ref(false);
const verificationSuccess = ref(false);
const verificationError = ref('');
const isResending = ref(false);

const resendSchema = z.object({
	email: z.string().min(1, 'Обязательное поле').email('Неверный формат email'),
})

const verifyEmail = async () => {
	if (!state.token) return;
	
	isVerifying.value = true;
	verificationError.value = '';
	verificationSuccess.value = false;

	try {
		const { data, error: apiError } = await authApi.verifyEmail({ token: state.token });
		if (apiError.value) {
			verificationSuccess.value = false;
			verificationError.value = apiError.value.data?.message || 'Ошибка при подтверждении email';
			return;
		}

		if (data.value) {
			verificationSuccess.value = true;
			toast.add({ 
				title: data.value.message || 'Email успешно подтвержден!', 
				color: 'success' 
			});
			
			setTimeout(() => {
				navigateTo('/sign-in');
			}, 3000);
		}
	} catch (e) {
		console.error('verifyEmail catch error', e);
		verificationSuccess.value = false;
		verificationError.value = 'Произошла неизвестная ошибка при подтверждении email';
	} finally {
		isVerifying.value = false;
	}
}

// Повторная отправка письма
const onResendEmail = async () => {
	if (!state.email) return;
	
	isResending.value = true;
	
	try {
		const { data } = await authApi.resendVerification({ 
			email: state.email 
		});

		if (data.value) {
			toast.add({ 
				title: data.value.message || 'Письмо успешно отправлено! Проверьте вашу почту.', 
				color: 'success' 
			});
			navigateTo('/sign-in');
		}
	} catch (e) {
		console.error('resendVerification catch error', e);
		toast.add({ 
			title: 'Произошла ошибка при отправке письма', 
			color: 'error' 
		});
	} finally {
		isResending.value = false;
	}
}

onMounted(async() => {
	if (state.token) {
		await nextTick()
		verifyEmail();
	}
})

</script>
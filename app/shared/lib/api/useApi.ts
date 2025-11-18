import { useFetch, useRuntimeConfig, type UseFetchOptions } from 'nuxt/app'
import { useAuth } from '~/entities/auth'
import type { ResponseDto } from './types'

export function useApi<ResponseT, MappedResponseT = ResponseT>(
	{
		urlPath,
		options,
		isShowMessageError,
		server = false, // Добавляем параметр для SSR
	}: {
		urlPath: string,
		options: UseFetchOptions<ResponseDto<ResponseT>, MappedResponseT>,
		isShowMessageError?: boolean,
		server?: boolean // Позволяет включать SSR
	}
) {
	const config = useRuntimeConfig()
	const baseURL = config.public.baseURL
	const isClient = import.meta.client
	const authController = useAuth()
	const toast = useToast();

	const headers = server ? useRequestHeaders(['cookie']) : {}

	// Конфиг для useFetch
  const fetchOptions: UseFetchOptions<ResponseDto<ResponseT>, MappedResponseT> = {
    baseURL,
    ...options,
    credentials: 'include',
		headers,
    server, // выполнение на сервере - true
    async onResponseError({ response }) {
      if (!isClient) return
      
      const codeError = response._data?.code
			
      if (isShowMessageError) {
        toast.add({ 
          title: 'Ошибка', 
          description: response._data?.message || 'Произошла непредвиденная ошибка',
          color: 'error' 
        })
      }

      // Обработка ошибок авторизации
      switch (codeError) {
				case 'EMAIL_NOT_VERIFIED':
          // Не разлогиниваем пользователя, просто перекидываем на страницу верификации
          // Email будет передан через query параметр на странице sign-in
          break
          
        case 'INVALID_SESSION':
        case 'SESSION_EXPIRED':
        case 'REFRESH_TOKEN_EXPIRED':
        case 'INVALID_TOKEN':
        case 'AUTHENTICATION_ERROR':
          authController.logout()
          break
      }
    }
  }

	return useFetch(urlPath, fetchOptions)
}
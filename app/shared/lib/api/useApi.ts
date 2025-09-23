import { useFetch, useRuntimeConfig, type UseFetchOptions } from 'nuxt/app'
import { authModel } from '~/entities/auth'
import type { ResponseDto } from './types'
//import { useAuthStore } from 'entities/auth/model'
//import { AUTH_CONSTANTS } from '~~/types/auth/auth.constants'

/**
 * Дженерики необязательны
 * ResponseT - тип ответа сервера (то что приходит в response.data).
 * MappedResponseT - результат функции transform. Тип ответа будет результатом выполнения transform,
 * 	применится автоматически.
 *
 *
 * 	Когда юзается transform - не надо прокидывать generic!!!
 * */

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
	const authController = authModel.useAuth()
	const toast = useToast();
	//const authStore = useAuthStore()

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
        //case 'ACCESS_TOKEN_EXPIRED':
        //  if (await refreshToken()) {
        //    return fetchResult.refresh()
        //  }
        //  break
          
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

	//const fetchResult = useFetch(urlPath, fetchOptions)
  //return fetchResult
	return useFetch(urlPath, fetchOptions)
}
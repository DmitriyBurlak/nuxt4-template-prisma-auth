import type { H3Event } from 'h3';
import { AppError } from './AppError';

// Функция для преобразования ошибок в стандартный формат
export function createErrorResponse(error: unknown) {
  // Обработка кастомных ошибок
  if (error instanceof AppError) {
    return {
      status: 'error',
      code: error.code,
			statusCode: error.statusCode,
      message: error.message,
      ...(error.details && { details: error.details })
    }
  }
  
  // Обработка ошибок H3
  if (error instanceof Error && 'statusCode' in error) {
    const h3Error = error as any
    return {
      status: 'error',
      code: 'H3_ERROR',
			statusCode: error.statusCode,
      message: h3Error.message || 'Unknown error',
      ...(h3Error.data && { details: h3Error.data })
    }
  }
  
  // Неизвестные ошибки
  return {
    status: 'error',
    code: 'INTERNAL_ERROR',
		statusCode: 500,
    message: 'Internal server error'
  }
}

export const handleApiErrors = (event: H3Event, error: unknown) => {
	const errorResponse = createErrorResponse(error)

	// Устанавливаем статус код
	if (error instanceof AppError) {
		event.node.res.statusCode = error.statusCode
	} else if (error instanceof Error && 'statusCode' in error) {
		event.node.res.statusCode = (error as any).statusCode || 500
	} else {
		event.node.res.statusCode = 500
	}
	
	// Отправляем ошибку в нужном формате
	event.node.res.setHeader('Content-Type', 'application/json')
	event.node.res.end(JSON.stringify(errorResponse))

	throw error
}
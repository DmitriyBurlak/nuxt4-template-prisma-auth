import { AppError } from './AppError';

// Ошибка валидации
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// Базовая ошибка аутентификации
export class AuthenticationError extends AppError {
  constructor(message: string, code: string = 'AUTHENTICATION_ERROR') {
    super(message, 401, code);
  }
}

// Неверные учетные данные
export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'Invalid email or password') {
    super(message, 'INVALID_CREDENTIALS');
  }
}

// Недействительная сессия
export class InvalidSessionError extends AuthenticationError {
  constructor(message: string = 'Invalid session') {
    super(message, 'INVALID_SESSION');
  }
}
//разлогиниваем

// Email не подтвержден
export class EmailNotVerifiedError extends AuthenticationError {
  constructor(message: string = 'Email не подтверждён. Проверьте вашу почту') {
    super(message, 'EMAIL_NOT_VERIFIED');
  }
}

// Сессия истекла
export class SessionExpiredError extends AuthenticationError {
  constructor(message: string = 'Session expired. Please login again') {
    super(message, 'SESSION_EXPIRED');
  }
}
//разлогиниваем

// Токен доступа истек
export class AccessTokenExpiredError extends AuthenticationError {
  constructor(message: string = 'Access token expired. Please refresh') {
    super(message, 'ACCESS_TOKEN_EXPIRED');
  }
}

// Запрещено (нет прав)
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Не найдено
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// Конфликт (дубликат)
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

// Этот статус код идеально подходит для случаев, когда операция не может быть выполнена из-за сбоя в зависимом сервисе
export class DependencyError extends AppError {
  constructor(message: string = 'Failed Dependency', code: string = 'FAILED_DEPENDENCY') {
    super(message, 424, code);
  }
}

export class EmailSendError extends DependencyError {
  constructor(message: string = 'Ошибка отправки письма') {
    super(message, 'EMAIL_SEND_FAILED');
  }
}

// Ошибка сервера
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}
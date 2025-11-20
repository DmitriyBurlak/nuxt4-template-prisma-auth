# nuxt4-template-prisma-auth

Приложение разработано как шаблон и пример работы авторизациии и управление профилем.
Проект можно использовать как стартовую точку для корпоративных кабинетов и публичных сайтов с закрытой частью.

- **Пример работы приложения** — https://nuxt-template.dmitriyburlak.ru/

## Технологический стек

- **Nuxt 4 + Vue 3** — SPA/SSR-слой, модульная структура `entities / features / widgets`.
- **Pinia** — состояние авторизации и пользователя (`app/entities/auth/model/useStore.ts`).
- **@nuxt/ui + @nuxt/icon** — готовые UI-компоненты и иконки.
- **Prisma 6 + PostgreSQL** — слой данных, миграции и сиды (`prisma/schema.prisma`).
- **JWT + httpOnly cookies** — хранение access/refresh токенов, middleware-защита (`server/middleware/auth.ts`).
- **Nodemailer** — отправка писем для верификации и сброса пароля (`server/utils/email.utils.ts`).
- **Docker** — билд и запуск в контейнере (`Dockerfile`, `docker-compose.yml`).

## Ключевые возможности

- Регистрация с подтверждением email.
- Вход с проверкой статуса пользователя и ролей.
- Автоматическое продление access-токена по refresh-токену и ведение таблицы `sessions`.
- Страницы `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`, кабинет `workspace/profile`.
- Управление профилем и смена пароля из личного кабинета.
- UI для навигации: хедер/футер, workspace-навигация, базовые формы и элементы.

## Архитектура

### Frontend (папка `app`)
- **Страницы** (`app/pages`) разделены на публичные и рабочие (`workspace/**`).
- **Компонентный подход**: `entities` (логика домена), `features` (форма/операция), `widgets` (крупные блоки), `shared` (UI и утилиты).
- **API-слой** — универсальный `useApi` оборачивает `useFetch`, автоматически добавляет baseURL, cookie и обработку ошибок/авторизации.
- **Плагины и middleware** (`app/plugins/check-auth.ts`, `app/middleware/auth.ts`) обеспечивают ленивую и SSR-инициализацию пользователя.

### Сервер (папка `server`)
- **Маршруты** описаны через `h3`-роутер (`server/api/[...].ts`) и сгруппированы в контроллеры `server/controllers/**`.
- **Сервисы** реализуют бизнес-логику (регистрация, refresh, смена пароля)
- **Middleware `server/middleware/auth.ts`** защищает все приватные `/api/**` маршруты, валидирует токены и подменяет access-cookie при истечении срока.
- **Утилиты**: кастомные ошибки, JWT-хелперы, email-шаблоны, вспомогательные функции для запросов.

### База данных (`prisma/schema.prisma`)
- **Модели**: `User`, `Role`, `UserRole`, `Session`, `Token`.
- **Особенности**: soft-валидация активности, хранение истории refresh-токенов, TTL для верификационных/ресет токенов, связка пользователей и ролей.
- **Миграции**: лежат в `prisma/migrations`, schema управляется Prisma CLI, сиды (`prisma/seed.mts`) добавляют тестовые данные/роли.


## Работа авторизации

1. **Регистрация** (`POST /api/auth/register`)
   - создаёт пользователя, генерирует `Token` типа `VERIFICATION`, отправляет письмо.
2. **Верификация email** (`POST /api/auth/verify-email`)
   - активирует пользователя, очищает токен, разрешает вход.
3. **Вход** (`POST /api/auth/login`)
   - сверяет пароль, проверяет `emailVerified/isActive`, создаёт сессию, ставит httpOnly cookies `access_token` (15 мин) и `refresh_token` (7 дн).
4. **Доступ к приватным маршрутам**
   - middleware берёт access-cookie; при истечении вызывает `AuthService.refreshToken`, обновляет сессию и cookie.
5. **Сброс пароля** (`forgot/reset-password`)
   - создаёт токен `PASSWORD_RESET` на 1 час, отправляет ссылку на письмо, обновляет пароль после подтверждения.
6. **Выход** (`POST /api/auth/logout`)
   - удаляет сессию и чистит cookies на сервере.

## Структура каталогов

```
app/                 # фронтенд-слой Nuxt
  pages/             # страницы (public + workspace)
  entities/, features/, widgets/  # слои FSD
  shared/            # UI-компоненты, API, хелперы
server/              # контроллеры, сервисы, middleware, utils
prisma/              # схема, миграции, seed-скрипты
lib/prisma.ts        # инициализация Prisma Client
docker-compose.yml   # инфраструктурный запуск
Dockerfile           # production-билд образа
```

## Переменные окружения

| Переменная | Описание |
| ---------- | -------- |
| `DATABASE_URL` | строка подключения к PostgreSQL (`postgresql://user:pass@host:port/db?schema=public`). |
| `JWT_SECRET` | секрет для подписи JWT (access и refresh). |
| `NUXT_PUBLIC_BASE_URL` | базовый URL фронтенда, используется в `useApi` и email-ссылках. |
| `NUXT_MAIL_HOST`, `NUXT_MAIL_PORT`, `NUXT_MAIL_USER`, `NUXT_MAIL_PASS` | параметры SMTP для Nodemailer. |
| `NODE_ENV` | режим работы приложения. |

# Discover Kazakhstan - Frontend

React + TypeScript + Vite приложение для туристического сайта Казахстана.

## Требования

- Node.js (v18 или выше)
- npm или yarn

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Настройте переменные окружения в `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Запуск

Для запуска в режиме разработки:
```bash
npm run dev
```

Для сборки продакшен версии:
```bash
npm run build
```

Для предварительного просмотра продакшен сборки:
```bash
npm run preview
```

## Структура API

Фронтенд ожидает следующие эндпоинты от Django бэкенда:

### Аутентификация
- `POST /api/auth/register/` - Регистрация пользователя
- `POST /api/auth/login/` - Вход пользователя (возвращает access и refresh токены)
- `POST /api/auth/logout/` - Выход пользователя
- `GET /api/auth/user/` - Получение текущего пользователя (требует токен)

### Отели
- `GET /api/hotels/` - Список всех отелей
- `GET /api/hotels/:id/` - Детали отеля
- `GET /api/hotels/:id/reviews/` - Отзывы для отеля

### Направления
- `GET /api/destinations/` - Список направлений
- `GET /api/destinations/:id/` - Детали направления

### Бронирования
- `GET /api/bookings/` - Список бронирований пользователя (требует токен)
- `POST /api/bookings/` - Создание бронирования (требует токен)
- `PATCH /api/bookings/:id/` - Обновление бронирования (требует токен)
- `POST /api/bookings/:id/cancel/` - Отмена бронирования (требует токен)

### Отзывы
- `POST /api/reviews/` - Создание отзыва (требует токен)

## Аутентификация

Приложение использует JWT токены для аутентификации:
- Access токен сохраняется в localStorage
- Токен отправляется в заголовке `Authorization: Bearer <token>`

## Технологии

- React 19
- TypeScript
- Vite
- React Router v6
- Tailwind CSS
- Lucide Icons

## API Service

Вся логика работы с API инкапсулирована в `/src/services/api.ts`. Этот сервис:
- Обрабатывает все HTTP запросы к бэкенду
- Автоматически добавляет токен аутентификации
- Обрабатывает ошибки

## Структура проекта

```
src/
├── components/       # Переиспользуемые компоненты
├── contexts/        # React контексты (AuthContext)
├── pages/           # Страницы приложения
├── services/        # API сервисы
├── types/           # TypeScript типы
├── App.tsx          # Основной компонент
└── main.tsx         # Точка входа
```



- Все запросы к API проходят через сервис в `src/services/api.ts`
- Аутентификация управляется через `AuthContext`
- Для добавления новых API эндпоинтов, расширьте `ApiService` класс
- Типы данных находятся в `src/types/index.ts`

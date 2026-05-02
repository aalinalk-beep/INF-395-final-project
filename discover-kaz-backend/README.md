---
# Discover Kazakhstan - Backend Documentation

## Оглавление
1.  [Обзор проекта](#1-обзор-проекта)
2.  [Технологический стек](#2-технологический-стек)
3.  [Настройка локального окружения](#3-настройка-локального-окружения)
4.  [Запуск приложения](#4-запуск-приложения)
5.  [Структура проекта](#5-структура-проекта)
6.  [Документация по API эндпоинтам](#6-документация-по-api-эндпоинтам)
    - [Аутентификация](#61-аутентификация)
    - [Отели и Отзывы](#62-отели-и-отзывы)
    - [Направления](#63-направления)
    - [Бронирования](#64-бронирования)
7.  [Панель администратора](#7-панель-администратора)

---

## 1. Обзор проекта

Это бэкенд-сервис для туристического приложения "Discover Kazakhstan". Он предоставляет REST API для управления пользователями, отелями, направлениями, отзывами и бронированиями. Бэкенд построен на Django и Django REST Framework и использует JWT для аутентификации.

## 2. Технологический стек

-   **Фреймворк**: Django
-   **API**: Django REST Framework
-   **Аутентификация**: djangorestframework-simplejwt (JWT токены)
-   **CORS**: django-cors-headers
-   **База данных**: SQLite 
-   **Язык**: Python 3

## 3. Настройка локального окружения

### Предварительные требования
-   Python 3.8+
-   `pip` (менеджер пакетов Python)
-   `virtualenv` (рекомендуется)

### Шаги по установке

1.  **Клонируйте репозиторий:**
    ```bash
    git clone <your-repository-url>
    cd discover-kaz-backend
    ```

2.  **Создайте и активируйте виртуальное окружение:**
    ```bash
    # Создание .venv
    python -m venv .venv

    # Активация на macOS / Linux
    source .venv/bin/activate

    # Активация на Windows
    .\.venv\Scripts\activate
    ```

3.  **Установите зависимости:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Примените миграции базы данных:**
    Эта команда создаст таблицы в базе данных на основе моделей Django.
    ```bash
    python manage.py migrate
    ```

5.  **Создайте суперпользователя:**
    Это необходимо для доступа к панели администратора Django.
    ```bash
    python manage.py createsuperuser
    ```
    Следуйте инструкциям в терминале для создания пользователя.

## 4. Запуск приложения

Для запуска сервера для разработки выполните команду:
```bash
python manage.py runserver
```
Сервер будет доступен по адресу `http://127.0.0.1:8000/`.

## 5. Структура проекта

```
discover-kaz-backend/
├── .venv/                  # Виртуальное окружение
├── discover_kaz_backend/   # Главная конфигурация проекта
│   ├── settings.py         # Настройки проекта
│   └── urls.py             # Корневая маршрутизация URL
├── users/                  # Приложение для пользователей и аутентификации
├── hotels/                 # Приложение для отелей и отзывов
├── destinations/           # Приложение для туристических направлений
├── bookings/               # Приложение для бронирований
├── manage.py               # Утилита для управления проектом
└── requirements.txt        # Список зависимостей
```

## 6. Документация по API эндпоинтам

**Базовый URL:** `http://localhost:8000/api`

### 6.1. Аутентификация

Эндпоинты для управления пользователями и сессиями.

#### `POST /auth/register/`
Регистрация нового пользователя.
-   **Аутентификация:** Не требуется.
-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe"
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "message": "User created successfully"
    }
    ```

#### `POST /auth/login/`
Вход пользователя и получение JWT токенов.
-   **Аутентификация:** Не требуется.
-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
    ```

#### `GET /auth/user/`
Получение информации о текущем аутентифицированном пользователе.
-   **Аутентификация:** Требуется (Bearer Token).
-   **Headers:** `Authorization: Bearer <access_token>`
-   **Success Response (200 OK):**
    ```json
    {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe"
    }
    ```

#### `POST /auth/logout/`
Выход пользователя (добавление refresh токена в черный список).
-   **Аутентификация:** Требуется (Bearer Token).
-   **Request Body:**
    ```json
    {
      "refresh": "refresh_token_string"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Successfully logged out"
    }
    ```

### 6.2. Отели и Отзывы

#### `GET /hotels/`
Получение списка всех отелей с пагинацией.
-   **Аутентификация:** Не требуется.
-   **Success Response (200 OK):**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "uuid", "name": "Hotel Name", ...
        }
      ]
    }
    ```

#### `GET /hotels/{id}/`
Получение детальной информации об одном отеле.
-   **Аутентификация:** Не требуется.
-   **Success Response (200 OK):**
    ```json
    {
      "id": "uuid", "name": "Hotel Name", "description": "...", ...
    }
    ```

#### `GET /hotels/{id}/reviews/`
Получение списка отзывов для конкретного отеля.
-   **Аутентификация:** Не требуется.
-   **Success Response (200 OK):**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "uuid", "user_email": "user@example.com", ...
        }
      ]
    }
    ```

#### `POST /reviews/`
Создание нового отзыва.
-   **Аутентификация:** Требуется (Bearer Token).
-   **Request Body:**
    ```json
    {
      "hotel": "hotel_uuid",
      "rating": 5,
      "title": "Great stay!",
      "content": "Loved this hotel..."
    }
    ```
-   **Success Response (201 Created):** JSON с данными созданного отзыва.

### 6.3. Направления

#### `GET /destinations/`
Получение списка всех направлений.
-   **Аутентификация:** Не требуется.
-   **Success Response (200 OK):** Список объектов направлений в поле `results`.

#### `GET /destinations/{id}/`
Получение детальной информации об одном направлении.
-   **Аутентификация:** Не требуется.
-   **Success Response (200 OK):** JSON-объект с данными направления.

### 6.4. Бронирования

#### `GET /bookings/`
Получение списка бронирований текущего пользователя.
-   **Аутентификация:** Требуется (Bearer Token).
-   **Success Response (200 OK):** Список объектов бронирований в поле `results`.

#### `POST /bookings/`
Создание нового бронирования.
-   **Аутентификация:** Требуется (Bearer Token).
-   **Request Body:**
    ```json
    {
      "hotel_id": "hotel_uuid",
      "check_in": "2024-08-10",
      "check_out": "2024-08-15",
      "guests": 2,
      "total_price": 750.00,
      "guest_email": "user@example.com",
      "guest_name": "John Doe"
    }
    ```
-   **Success Response (201 Created):** JSON с данными созданного бронирования (статус `pending`).

#### `POST /bookings/{id}/cancel/`
Отмена бронирования. Статус меняется на `cancelled`.
-   **Аутентификация:** Требуется (Bearer Token).
-   **Success Response (200 OK):**
    ```json
    {
      "id": "uuid",
      "status": "cancelled"
    }
    ```
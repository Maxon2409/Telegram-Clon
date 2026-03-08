# Публикация приложения

Инструкция по публикации Telegram Clon в **Google Play** и **App Store**.

---

## Подготовка

### 1. Установка EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Настройка проекта для сборки

```bash
eas build:configure
```

---

## A. Google Play Store (Android)

### 1. Создание аккаунта разработчика

- Зайди на [play.google.com/console](https://play.google.com/console)
- Оплати разовую регистрацию **$25**
- Заполни данные разработчика

### 2. Подписание приложения (Android)

Expo EAS подписывает приложение автоматически. Создай credentials:

```bash
eas credentials
```

Выбери Android → Create new keystore.

### 3. Сборка APK/AAB

```bash
eas build --platform android --profile production
```

Будет создан **AAB** (Android App Bundle) для Play Store.

### 4. Публикация в Play Store

1. В [Google Play Console](https://play.google.com/console) создай новое приложение
2. Заполни данные:
   - Название, описание
   - Скриншоты (минимум 2 для телефона)
   - Иконка 512x512
3. **Создание релиза** → Загрузи AAB-файл из `eas build`
4. Укажи версию, описание обновления
5. Отправь на проверку

Обычно проверка занимает **1–3 дня**.

---

## B. App Store (iOS)

### 1. Apple Developer Program

- Зайди на [developer.apple.com](https://developer.apple.com)
- Подписка **$99/год**
- Нужен Mac и Xcode для некоторых шагов

### 2. Создание App ID и профилей

В [Apple Developer](https://developer.apple.com/account):

- Identifiers → App IDs → создать App ID (bundle id: `com.telegramclon.app`)
- Certificates → создать Distribution Certificate
- Profiles → создать provisioning profile

EAS может создать это автоматически:

```bash
eas build --platform ios --profile production
```

### 3. Сборка IPA

```bash
eas build --platform ios --profile production
```

### 4. Публикация в App Store Connect

1. Зайди в [App Store Connect](https://appstoreconnect.apple.com)
2. Создай новое приложение
3. Заполни:
   - Название, описание
   - Скриншоты для iPhone (6.7", 6.5", 5.5")
   - Иконка 1024x1024
   - Возрастной рейтинг
4. **TestFlight** (по желанию) — бета-тест
5. **Submit for Review** — приложи IPA (можно через EAS Submit)

```bash
eas submit --platform ios --profile production --latest
```

Проверка в App Store обычно **1–7 дней**.

---

## Важно перед релизом

### 1. Реальная отправка SMS

Сейчас используется тестовый код `123456`. Для продакшена нужно подключить SMS-провайдер:

- **Firebase Phone Auth** — бесплатный лимит
- **Twilio** — платный
- **sms.ru** и другие российские сервисы

Интеграция — в `services/smsService.ts`.

### 2. Backend

Для хранения пользователей и сообщений нужен сервер (Node.js, Firebase и т.п.).

### 3. Политика конфиденциальности

Google Play и App Store требуют ссылку на политику конфиденциальности. Размести её на своём сайте или GitHub Pages.

---

## Кратко

| Шаг | Android | iOS |
|-----|---------|-----|
| Регистрация | $25 разово | $99/год |
| Сборка | `eas build -p android` | `eas build -p ios` |
| Консоль | play.google.com/console | appstoreconnect.apple.com |
| Проверка | 1–3 дня | 1–7 дней |

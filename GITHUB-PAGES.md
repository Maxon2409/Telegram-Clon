# Публикация на GitHub Pages (пошагово)

Бесплатный хостинг для веб-версии приложения. После настройки сайт будет доступен по адресу вида `https://ТВОЙ_ЛОГИН.github.io/ИМЯ_РЕПОЗИТОРИЯ/` или `https://ТВОЙ_ЛОГИН.github.io/` (если репозиторий называется `ТВОЙ_ЛОГИН.github.io`).

---

## Шаг 1: Аккаунт и репозиторий на GitHub

1. Зайди на [github.com](https://github.com) и войди (или зарегистрируйся).
2. Нажми **"+"** → **New repository**.
3. Укажи:
   - **Repository name:** например `Telegram-Clon` (или `ТВОЙ_ЛОГИН.github.io` — тогда сайт будет по адресу `https://ТВОЙ_ЛОГИН.github.io`).
   - **Public**.
   - **Add a README** можно не ставить, если будешь пушить существующую папку.
4. Нажми **Create repository**.

---

## Шаг 2: Инициализировать Git и отправить проект

В папке проекта (в терминале или WSL):

```bash
cd "/mnt/c/Users/maxon/OneDrive/Рабочий стол/Telegram Clon"

# Инициализация (если ещё не делал)
git init

# Добавить все файлы
git add .

# Первый коммит
git commit -m "Initial commit"

# Подключить твой репозиторий (подставь СВОЙ логин и имя репо)
git remote add origin https://github.com/ТВОЙ_ЛОГИН/Telegram-Clon.git

# Отправить код (ветка main)
git branch -M main
git push -u origin main
```

GitHub попросит логин и пароль. Пароль — это **Personal Access Token**: GitHub → Settings → Developer settings → Personal access tokens → создать токен с правом `repo` и подставить его вместо пароля.

---

## Шаг 3: Включить GitHub Pages

1. Открой свой репозиторий на GitHub.
2. Вкладка **Settings** → слева **Pages**.
3. В блоке **Build and deployment**:
   - **Source:** выбери **GitHub Actions** (не Branch).
4. Сохрани, если что-то менял.

---

## Шаг 4: Первый деплой

В проекте уже есть workflow `.github/workflows/deploy-pages.yml`: он при каждом пуше в ветку `main` собирает веб-версию и выкладывает её на GitHub Pages.

Просто сделай новый пуш (если уже пушил раньше — можно пустой коммит):

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

Деплой запустится автоматически.

1. В репозитории открой вкладку **Actions**.
2. Дождись зелёной галочки у workflow **Deploy to GitHub Pages** (1–3 минуты).
3. Снова зайди в **Settings → Pages** — там появится ссылка вида:
   - `https://ТВОЙ_ЛОГИН.github.io/Telegram-Clon/`

По этой ссылке и будет открываться приложение.

---

## Если репозиторий называется не `ЛОГИН.github.io`

Тогда сайт будет в подпапке: `https://ТВОЙ_ЛОГИН.github.io/Telegram-Clon/`.

Чтобы приложение корректно подгружало скрипты и стили, нужно указать базовый путь. В корне проекта в `app.json` добавь (подставь имя своего репозитория):

```json
{
  "expo": {
    "experiments": {
      "baseUrl": "/Telegram-Clon/"
    }
  }
}
```

Имя должно совпадать с именем репозитория (с учётом регистра). После изменения сделай коммит и пуш — workflow пересоберёт и задеплоит проект.

---

## Вариант «Сайт сразу в корне» (без подпапки)

Если хочешь адрес вида `https://ТВОЙ_ЛОГИН.github.io` (без `/Telegram-Clon`):

1. Создай репозиторий с именем **ровно** `ТВОЙ_ЛОГИН.github.io` (например, `maxon.github.io`).
2. Залей в него тот же проект (тот же `git remote` и `git push`).
3. В **app.json** блок `experiments.baseUrl` не добавляй (или удали, если добавлял).
4. Включи Pages с источником **GitHub Actions**, как в шаге 3.

Тогда после деплоя сайт откроется по `https://ТВОЙ_ЛОГИН.github.io`.

---

## Поиск (Google, Яндекс)

Чтобы сайт находили в поиске:

1. Добавь сайт в [Google Search Console](https://search.google.com/search-console) (укажи URL страницы).
2. В [Яндекс.Вебмастер](https://webmaster.yandex.ru) добавь тот же URL и подтверди владение (например, по мета-тегу или HTML-файлу).

Через несколько дней страница начнёт индексироваться, и люди смогут найти приложение по запросу в поиске.

---

## Кратко

| Шаг | Действие |
|-----|----------|
| 1 | Создать репозиторий на GitHub |
| 2 | `git init`, `git add .`, `git commit`, `git remote add origin ...`, `git push` |
| 3 | Settings → Pages → Source: **GitHub Actions** |
| 4 | Дождаться деплоя в Actions, открыть ссылку из Pages |
| 5 | При подпапке (`/Telegram-Clon/`) — добавить `experiments.baseUrl` в `app.json` |

После этого приложение будет доступно по ссылке с GitHub Pages, и его можно использовать или «добавить на главный экран» на телефоне.

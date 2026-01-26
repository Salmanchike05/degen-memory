# Git команды для загрузки на GitHub

## GitHub Username: Salmanchike05

### Шаг 1: Инициализация Git (если еще не сделано)

```bash
cd /Users/airm1/Documents/degen-memory
git init
```

### Шаг 2: Добавление всех файлов

```bash
git add .
```

### Шаг 3: Первый коммит

```bash
git commit -m "Initial commit: Degen Memory game for Base App"
```

### Шаг 4: Создание главной ветки

```bash
git branch -M main
```

### Шаг 5: Подключение к GitHub репозиторию

**Сначала создайте репозиторий на GitHub:**
1. Перейдите на https://github.com/new
2. Repository name: `degen-memory`
3. Выберите Public или Private
4. НЕ добавляйте README, .gitignore, лицензию
5. Нажмите "Create repository"

**Затем выполните:**

```bash
git remote add origin https://github.com/Salmanchike05/degen-memory.git
```

### Шаг 6: Загрузка на GitHub

```bash
git push -u origin main
```

## Последующие обновления

После изменений в коде:

```bash
git add .
git commit -m "Описание изменений"
git push
```

## Проверка статуса

```bash
git status
```

## Просмотр истории

```bash
git log --oneline
```

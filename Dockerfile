# Используем Node.js с Playwright (с уже встроенным Chromium)
FROM mcr.microsoft.com/playwright:v1.44.0-focal

# Создаём рабочую папку
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Экспонируем порт, если нужен (например для Express)
EXPOSE 3000

# Команда запуска
CMD ["node", "app.js"]

FROM node:20-alpine

WORKDIR /app

# Копіюємо тільки package.json спочатку — для кешу
COPY package*.json ./

# Встановлюємо всі залежності (включно з dev)
RUN npm install

# Тепер копіюємо решту коду
COPY . .

# Виставляємо порт (не обов’язково, але добре мати)
EXPOSE 5000

# Стартова команда
CMD ["npm", "start"]

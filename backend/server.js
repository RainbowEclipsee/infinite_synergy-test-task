import express from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./users.json";

// Функция генерации пользователей
const generateUsers = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(), // Уникальный ID
    name: faker.person.fullName(),
    department: faker.commerce.department(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
  }));
};

// Если файл отсутствует — создаем с 1M пользователей
if (!fs.existsSync(FILE_PATH)) {
  const users = generateUsers(1_000_000);
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
  console.log("JSON-файл с пользователями создан!");
}

// Читаем пользователей из файла
const getUsersFromFile = () => {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Эндпоинт для получения пользователей (пагинация)
app.get("/users", (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const users = getUsersFromFile();
  const start = (page - 1) * limit;
  const paginatedUsers = users.slice(start, start + Number(limit));

  res.json(paginatedUsers);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

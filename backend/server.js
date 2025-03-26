import express from 'express'
import cors from 'cors'
import { faker } from '@faker-js/faker'
import fs from 'fs/promises'
import path from 'path'

const app = express()
const PORT = 5000
const FILE_PATH = path.resolve('./users.json')

app.use(cors()) //Разрешаем кросс-доменные запросы
app.use(express.json())

//Гененируем пользователей
const generateUsers = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    department: faker.commerce.department(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
  }))
}

// Инициализация JSON-файла с пользователями, если его нет
const initUsersFile = async () => {
  try {
    await fs.access(FILE_PATH)
  } catch {
    console.log('Создание JSON-файла с пользователями. Пожалуйста, подождите.')
    const users = generateUsers(1_000_000)
    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2))
    console.log('JSON-файл с пользователями создан!')
  }
}

// Читаем пользователей из файла
const getUsersFromFile = async () => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Ошибка чтения файла:', error)
    return []
  }
}

// Сохранение списка пользователей в файл
const saveUsersToFile = async (users) => {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Ошибка записи файла:', error)
  }
}

// Маршрут для получения списка пользователей с пагинацией
app.get('/users', async (req, res) => {
  try {
    let { page = 1, limit = 50 } = req.query
    page = Math.max(1, parseInt(page, 10))
    limit = Math.max(1, parseInt(limit, 10))

    const users = await getUsersFromFile()
    const start = (page - 1) * limit
    const paginatedUsers = users.slice(start, start + limit)

    res.json({ totalUsers: users.length, users: paginatedUsers })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Маршрут для обновления информации о пользователе
app.put('/users/:id', async (req, res) => {
  try {
    const users = await getUsersFromFile()
    const { id } = req.params
    const updatedUser = req.body

    const index = users.findIndex((user) => user.id === id)
    if (index === -1) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    users[index] = { ...users[index], ...updatedUser }
    await saveUsersToFile(users)

    res.json(users[index])
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления пользователя' })
  }
})

app.listen(PORT, async () => {
  await initUsersFile()
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})

import json
import os
import logging
from config import ADMIN, TOKEN   # Импортим из файла config: ID админа и токен бота
from aiogram import Bot, Dispatcher, types, F
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, KeyboardButton, ReplyKeyboardMarkup
import asyncio

# === НАСТРОЙКИ ===
BOT_TOKEN = TOKEN                 # Токен для доступа к Telegram API
AUTHORIZED_USER_ID = ADMIN        # ID пользователя (админа), которому разрешён доступ

# === ЛОГИ ===
logging.basicConfig(level=logging.INFO)   # Настройка логирования для вывода информации и ошибок

# === БОТ И ДИСПЕТЧЕР ===
bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
# Создаём объект бота с HTML-разметкой по умолчанию

dp = Dispatcher()
# Создаём диспетчер, который будет обрабатывать обновления от Telegram

# === ПАМЯТЬ ДЛЯ ВЫБОРА КАТЕГОРИИ ===
user_state = {}
# Словарь для хранения состояния пользователя (текущей выбранной категории)

# === КНОПКИ ===
category_keyboard = ReplyKeyboardMarkup(keyboard=[
    [KeyboardButton(text="Чаи")],        # Кнопка "Чаи"
    [KeyboardButton(text="Десерты")],    # Кнопка "Десерты"
    [KeyboardButton(text="Сотрудники")], # Кнопка "Сотрудники"
    [KeyboardButton(text="Отзывы")]      # Кнопка "Отзывы"
], resize_keyboard=True)
# Клавиатура с кнопками, которые отображаются пользователю для выбора категории.
# Параметр resize_keyboard=True уменьшает размер клавиатуры по высоте, чтобы она выглядела компактнее.

# === Обработчик команды /start ===
@dp.message(CommandStart())
async def cmd_start(message: Message):
    # Проверяем, что пользователь - авторизованный админ
    if message.from_user.id != AUTHORIZED_USER_ID:
        # Если нет — отправляем сообщение об отказе в доступе и выходим
        return await message.answer("⛔ Доступ запрещён.")
    
    # Если пользователь авторизован — выводим сообщение с предложением выбрать категорию и клавиатуру
    await message.answer("Выбери категорию:", reply_markup=category_keyboard)

# === Обработчик команды /delete ===
@dp.message(Command("delete"))
async def delete_item(message: Message):
    # Проверяем, что отправитель — авторизованный админ
    if message.from_user.id != AUTHORIZED_USER_ID:
        return await message.answer("⛔ Доступ запрещён.")

    # Получаем текущую выбранную категорию пользователя из памяти user_state
    category = user_state.get(message.from_user.id)
    if not category:
        # Если категория не выбрана — просим сначала выбрать её через /start
        return await message.answer("⚠️ Сначала выбери категорию через /start.")

    try:
        # Разбиваем сообщение по пробелу на команду и аргумент (поле;значение)
        text = message.text.split(" ", 1)
        # Проверяем, что есть аргумент и он содержит символ ";"
        if len(text) < 2 or ";" not in text[1]:
            return await message.answer("❌ Формат: /delete поле;значение")

        # Разделяем аргумент по ";" на поле и значение и убираем пробелы по краям
        field, value = map(str.strip, text[1].split(";", 1))

        # Определяем файл с данными в зависимости от выбранной категории
        match category:
            case "Чаи":
                filename = "json/menu.json"
            case "Десерты":
                filename = "json/snacks.json"
            case "Сотрудники":
                filename = "json/employees.json"
            case "Отзывы":
                filename = "json/testimonials.json"
            case _:
                return await message.answer("❌ Неизвестная категория")

        # Проверяем, существует ли файл
        if not os.path.exists(filename):
            return await message.answer("❌ Файл не найден.")

        # Читаем данные из файла
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Сохраняем количество элементов до удаления
        before = len(data)
        # Фильтруем данные, удаляя элементы, где поле равно заданному значению
        data = [item for item in data if str(item.get(field, "")) != value]
        # Количество элементов после удаления
        after = len(data)

        # Записываем обновлённый список обратно в файл
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # Если элементов не уменьшилось — значит ничего не удалено
        if before == after:
            return await message.answer("⚠️ Элемент не найден.")
        
        # Успешное удаление
        await message.answer("✅ Удалено.")

    except Exception as e:
        # В случае ошибки выводим её текст
        await message.answer(f"❌ Ошибка: {e}")

# === ОБРАБОТКА ВЫБОРА КАТЕГОРИИ ===
@dp.message(F.text.in_(["Чаи", "Десерты", "Сотрудники", "Отзывы"]))
async def handle_category(message: Message):
    # Сохраняем выбранную пользователем категорию в словаре user_state по user_id
    user_state[message.from_user.id] = message.text

    # Подтверждаем выбор категории пользователю
    await message.answer("✅ Категория выбрана. Введи данные:")

    # В зависимости от выбранной категории показываем формат для добавления и удаления данных
    match message.text:
        case "Чаи":
            await message.answer("Формат для добавления: Название; Цена; Путь к изображению.\nДля удаления:/delete name; название десерта.")
        case "Десерты":
            await message.answer("Формат для добавления: Название; Цена; Путь к изображению.\nДля удаления:/delete name; название десерта.")
        case "Сотрудники":
            await message.answer("Формат для добавления: Имя; Должность; Картинка; Описание. \nДля удаления:/delete description; Описание.")
        case "Отзывы":
            await message.answer("Формат для добавления: Текст отзыва; Автор. \nДля удаления:/delete text; Текст отзыва.")

# === ОБРАБОТКА ТЕКСТА ===
@dp.message(F.text) 
async def handle_data(message: Message):
    # Проверяем, что пользователь авторизован
    if message.from_user.id != AUTHORIZED_USER_ID:
        return await message.answer("⛔ Доступ запрещён.")

    # Получаем выбранную пользователем категорию из словаря user_state
    category = user_state.get(message.from_user.id)
    if not category:
        return await message.answer("⚠️ Сначала выбери категорию через /start.")

    try:
        # Разбиваем введённый текст по точке с запятой и убираем пробелы
        parts = list(map(str.strip, message.text.split(";")))

        # В зависимости от категории проверяем правильность формата и формируем новую запись
        if category == "Чаи":
            if len(parts) != 3:
                return await message.answer("❌ Неверный формат. Нужно: Название; Цена; Картинка")
            filename = "json/menu.json"
            new_entry = {"name":  parts[0], "price": parts[1], "image": parts[2]}  # Добавляем в JSON
        elif category == "Десерты":
            if len(parts) != 3:
                return await message.answer("❌ Неверный формат. Нужно: Название; Цена; Картинка")
            filename = "json/snacks.json"
            new_entry = {"name": parts[0], "price": parts[1], "image": parts[2]} # Добавляем в JSON

        elif category == "Сотрудники":
            if len(parts) != 4:
                return await message.answer("❌ Неверный формат. Нужно: Имя; Должность; Картинка; Описание")
            filename = "json/employees.json"
            new_entry = {"name": parts[0], "position": parts[1], "image": parts[2], "description": parts[3]} # Добавляем в JSON

        elif category == "Отзывы":
            if len(parts) != 2:
                return await message.answer("❌ Неверный формат. Нужно: Текст; Автор") 
            filename = "json/testimonials.json"
            new_entry = {"text": parts[0], "author": parts[1]} # Добавляем в JSON

        else:
            return await message.answer("❌ Неизвестная категория.")

        # Проверяем, что файл существует
        if not os.path.exists(filename):
            return await message.answer(f"❌ Файл {filename} не найден.")

        # Загружаем данные из JSON файла
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Проверяем, что данные - список (массив)
        if not isinstance(data, list):
            return await message.answer("⚠️ JSON должен быть массивом.")

        # Добавляем новую запись
        data.append(new_entry)

        # Записываем обновлённый список обратно в файл
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        await message.answer(f"✅ Добавлено в {filename}!")

    except Exception as e:
        # В случае ошибки выводим сообщение об ошибке
        await message.answer(f"❌ Ошибка: {e}")




# === ОБРАБОТКА ИЗОБРАЖЕНИЙ ===
@dp.message(F.photo)
async def handle_photo(message: Message):
    # Проверяем, что пользователь авторизован
    if message.from_user.id != AUTHORIZED_USER_ID:
        return await message.answer("⛔ Доступ запрещён.")

    # Проверяем, что в подписи к фото есть название (имя файла без расширения)
    if not message.caption:
        return await message.answer("⚠️ Добавь название файла в подпись (без расширения)")

    # Формируем имя файла: заменяем пробелы на нижние подчёркивания и добавляем расширение .jpg
    name = message.caption.strip().replace(" ", "_") + ".jpg"
    path = f"pic/{name}"

    # Создаём папку pic, если её ещё нет
    os.makedirs("pic", exist_ok=True)

    # Берём самое большое изображение из массива photo (обычно последний элемент)
    photo = message.photo[-1]

    # Получаем информацию о файле по file_id
    file = await bot.get_file(photo.file_id)

    # Загружаем файл на сервер, сохраняя в указанном пути
    await bot.download_file(file.file_path, path)

    # Отправляем подтверждение пользователю
    await message.answer(f"✅ Сохранено как {path}")

# === ЗАПУСК ===
async def main():
    # Запускаем цикл обработки входящих сообщений
    await dp.start_polling(bot)

if __name__ == "__main__":
    # Запускаем асинхронный main при запуске скрипта
    asyncio.run(main())
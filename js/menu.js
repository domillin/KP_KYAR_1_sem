// Функция отображения всплывающего уведомления с заданным сообщением
function showPopup(message) {
  // Получаем элемент, в котором будет отображаться сообщение
  const popup = document.getElementById("popup");

  // Устанавливаем переданное сообщение в текст содержимого popup-а
  popup.textContent = message;

  // Добавляем CSS-класс "show", чтобы отобразить popup (например, с анимацией появления)
  popup.classList.add("show");

  // Через 2500 миллисекунд (2.5 секунды) удаляем класс "show", чтобы скрыть popup
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500);
}
  

  // Функция для переключения состояния меню (открыто/закрыто)
function toggleMenu() {
  // Получаем элемент меню по классу .nav-links
  const menu = document.querySelector(".nav-links");

  // Получаем иконку внутри кнопки меню (.menu-toggle i)
  const icon = document.querySelector(".menu-toggle i");

  // Получаем элемент затемнения фона при открытом меню
  const overlay = document.querySelector(".overlay");

  // Добавляем или убираем класс "active" у меню (делает меню видимым/невидимым)
  menu.classList.toggle("active");

  // Добавляем или убираем класс "active" у оверлея 
  overlay.classList.toggle("active");

  // Добавляем или убираем класс "menu-open" у <body>, чтобы запретить прокрутку
  document.body.classList.toggle("menu-open");

  // Переключаем иконку: если была "бургер" (fa-bars), меняем на "крестик" (fa-times) и наоборот
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
}

// Функция для закрытия меню (всегда закрывает, без переключения)
function closeMenu() {
  // Удаляем класс "active" у меню, чтобы скрыть его
  document.querySelector(".nav-links").classList.remove("active");

  // Удаляем класс "active" у оверлея
  document.querySelector(".overlay").classList.remove("active");

  // Удаляем класс "menu-open" у <body>
  document.body.classList.remove("menu-open");

  // Получаем иконку и явно устанавливаем её в состояние "бургер-меню" (fa-bars)
  const icon = document.querySelector(".menu-toggle i");
  icon.classList.add("fa-bars");     // Добавляем иконку "бургер"
  icon.classList.remove("fa-times"); // Удаляем иконку "крестик"
}

  // Функция асинхронной подгрузки меню чая из JSON-файла
async function loadMenu() {
  try {
    // Загружаем файл json/menu.json с помощью fetch
    const response = await fetch('json/menu.json');
    // Парсим полученный JSON в JavaScript-массив объектов
    const items = await response.json();
    // Получаем контейнер, в который будем вставлять карточки меню
    const container = document.getElementById('menuContainer');
    // Очищаем контейнер перед добавлением новых элементов (если вдруг он не пустой)
    container.innerHTML = '';

    // Перебираем все элементы из JSON и создаём HTML для каждого товара
    items.forEach(item => {
      // Создаем div-элемент для одного пункта меню
      const div = document.createElement('div');
      div.className = 'menu-item'; // Добавляем класс для стилизации

      // Вставляем в div HTML с изображением, названием, ценой и кнопкой "Купить"
      div.innerHTML = `
        <img class="menu-img" src="${item.image}" alt="${item.name}">
        <div class="menu-content">
          <span class="menu-name">${item.name}</span>
          <span class="menu-price">${item.price}</span>
          <button class="menu-button" onclick='addToCart(${JSON.stringify(item)})'>Купить</button>
        </div>
      `;
      // Добавляем сформированный div в контейнер
      container.appendChild(div);
    });
  } catch (err) {
    // В случае ошибки при загрузке или парсинге JSON — выводим сообщение в консоль
    console.error('Ошибка загрузки меню:', err);
  }
}
// Запускаем функцию загрузки меню, когда вся страница полностью загружена
document.addEventListener('DOMContentLoaded', loadMenu);

 // Функция асинхронной подгрузки десертов из JSON-файла
async function loadSnacks() {
  try {
    // Выполняем запрос к файлу json/snacks.json с помощью fetch
    const response = await fetch('json/snacks.json');

    // Преобразуем ответ в JavaScript-объекты (массив десертов)
    const items = await response.json();

    // Получаем элемент-контейнер для вывода десертов по ID
    const container = document.getElementById('snacksContainer');

    // Очищаем контейнер, чтобы не было дублирования при повторной загрузке
    container.innerHTML = '';

    // Проходим по каждому десерту в массиве
    items.forEach(item => {
      // Создаём div-элемент для одного десерта
      const div = document.createElement('div');
      div.className = 'menu-item'; // Добавляем CSS-класс для стилизации

      // Заполняем div HTML-разметкой: картинка, название, цена и кнопка "Купить"
      div.innerHTML = `
        <img class="menu-img" src="${item.image}" alt="${item.name}">
        <div class="menu-content">
          <span class="menu-name">${item.name}</span>
          <span class="menu-price">${item.price}</span>
          <button class="menu-button" onclick='addToCart(${JSON.stringify(item)})'>Купить</button>
        </div>
      `;

      // Добавляем сформированный блок в контейнер на страницу
      container.appendChild(div);
    });
  } catch (err) {
    // Если при загрузке или разборе JSON возникла ошибка — выводим в консоль
    console.error('Ошибка загрузки закусок:', err);
  }
}

// Запускаем функцию загрузки десертов после полной загрузки HTML-документа
document.addEventListener('DOMContentLoaded', loadSnacks);



// Функция добавления товара в корзину
function addToCart(item) {
  // Пытаемся получить текущую корзину из localStorage
  // Если ничего нет (null), используем пустой массив
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Добавляем выбранный товар в массив корзины
  cart.push(item);

  // Сохраняем обновлённую корзину обратно в localStorage в виде строки JSON
  localStorage.setItem('cart', JSON.stringify(cart));

  // Показываем всплывающее уведомление о том, что товар добавлен
  showPopup(`${item.name} добавлен в корзину`);
}



// Получаем кнопку "Прокрутить вверх" по ID 
const btn = document.getElementById("scrollToTopBtn");

// Назначаем функцию, которая будет вызываться каждый раз при прокрутке страницы
window.onscroll = function () {
  // Проверяем, насколько пользователь прокрутил страницу вниз:
  // document.body.scrollTop — для Safari
  // document.documentElement.scrollTop — для остальных браузеров
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) { // Если прокручено более чем на 200px — показываем кнопку "наверх"
    btn.style.display = "flex"; // используем flex, чтобы сохранить стиль выравнивания
  } else {    // Иначе — скрываем кнопку
    btn.style.display = "none";
  }
};
// Обработчик нажатия на кнопку "наверх"
btn.onclick = function () {
  // Плавная прокрутка страницы вверх
  window.scrollTo({
    top: 0,               // прокрутка до самого верха страницы
    behavior: 'smooth'    // анимация прокрутки будет плавной
  });
};
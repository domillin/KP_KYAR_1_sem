// Функция загрузки содержимого корзины из localStorage и отображения на странице
function loadCart() {
  // Получаем данные корзины из localStorage, либо пустой массив, если корзина пуста
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Получаем HTML-элемент, куда будем выводить список товаров в корзине
  const container = document.getElementById('cart-container');

  // Получаем элемент, в котором будет отображаться итоговая сумма
  const totalElem = document.getElementById('total');

  // Очищаем контейнер, чтобы не дублировать содержимое при повторной загрузке
  container.innerHTML = '';

  // Переменная для хранения общей суммы заказа
  let total = 0;

  // Перебираем каждый товар в корзине
  cart.forEach((item, index) => {
    // Создаём элемент для отображения товара
    const div = document.createElement('div');
    div.className = 'cart-item'; // Добавляем класс для стилизации

    // Устанавливаем содержимое: название, цена и кнопка "Удалить"
    div.innerHTML = `
      <span>${item.name} — ${item.price}</span>
      <button onclick="removeItem(${index})">Удалить</button>
    `;

    // Добавляем товар в контейнер на странице
    container.appendChild(div);

    // Прибавляем цену товара к общей сумме
    total += parseFloat(item.price); // Преобразуем цену в число (если она строка)
  });

  // Обновляем текст с итоговой суммой, округленной до 2 знаков
  totalElem.textContent = 'Итого: ' + total.toFixed(2) + ' BYN';
}



// Функция удаления одного товара из корзины по индексу
function removeItem(index) {
  // Загружаем текущую корзину из localStorage, либо создаём пустую, если она отсутствует
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Удаляем один элемент из массива корзины по указанному индексу
  // splice(index, 1) — удаляет 1 элемент начиная с позиции index
  cart.splice(index, 1);

  // Сохраняем обновлённый массив обратно в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Перезагружаем отображение корзины на странице
  loadCart();
}

// Функция полной очистки корзины
function clearCart() {
  // Удаляем ключ 'cart' из localStorage — это удаляет все товары
  localStorage.removeItem('cart');

  // Перезагружаем отображение корзины на странице, чтобы отразить изменения
  loadCart();
}

// Функция валидации формы: проверяет, заполнены ли имя и фамилия
function validateForm() {
  // Получаем значения из поля "Имя", убирая пробелы в начале и конце
  const firstName = document.getElementById('firstName').value.trim();

  // Получаем значения из поля "Фамилия", убирая пробелы
  const lastName = document.getElementById('lastName').value.trim();

  // Получаем кнопку "Оформить заказ"
  const orderBtn = document.getElementById('orderBtn');

  // Если оба поля не пустые — разблокировать кнопку
  orderBtn.disabled = !(firstName && lastName);
}

// Функция, запрещающая ввод цифр в поле ввода
function preventNumbers(e) {
  // Проверка: если нажатая клавиша — цифра (0-9)
  if (/\d/.test(e.key)) {
    // Если это цифра, отменяем стандартное действие (ввод символа)
    e.preventDefault();
  }
}

// Обработка отправки формы заказа
function handleOrderSubmit() {
  // Загружаем корзину из localStorage (или пустой массив, если корзина пуста)
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Получаем значения имени и фамилии из полей ввода, убирая пробелы
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();

  // Формируем полное имя клиента для передачи
  const name = firstName + ' ' + lastName;

  // Если корзина пустая, прерываем выполнение (не отправляем заказ)
  if (!cart.length) {
    return false;
  }

  // Подготовка данных для скрытого поля формы:
  // Формируем список товаров в формате "название - цена", разделяя запятой и новой строкой
  // Добавляем в конце строку со статусом оплаты
  document.getElementById('cartData').value = 
    cart.map(i => `${i.name} - ${i.price}`).join(',\n ') + '\nСтатус: ОПЛАЧЕНО';

  // Записываем имя клиента в скрытое поле для отправки на сервер
  document.getElementById('nameField').value = name;

  // Очищаем корзину, вызывая функцию clearCart()
  clearCart();

  // Очищаем поля ввода имени и фамилии
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';

  // Блокируем кнопку оформления заказа, так как форма теперь пустая
  document.getElementById('orderBtn').disabled = true;

  // Показываем подтверждение успешного оформления заказа на странице 
  document.getElementById('confirmation').style.display = 'block';

  // Возвращаем true, чтобы форма могла быть отправлена
  return true; 
}

  // Назначение событий
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    document.getElementById('firstName').addEventListener('input', validateForm);
    document.getElementById('lastName').addEventListener('input', validateForm);
    document.getElementById('firstName').addEventListener('keypress', preventNumbers);
    document.getElementById('lastName').addEventListener('keypress', preventNumbers);
  });


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
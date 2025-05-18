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

// Маска телефона
// Получаем элемент input для телефона по id 'phone'
const phoneInput = document.getElementById('phone');

// Добавляем обработчик события input — срабатывает при любом вводе в поле
phoneInput.addEventListener('input', function (e) {
  let input = e.target; // текущий input элемент
  // Убираем из значения все символы, кроме цифр
  let value = input.value.replace(/\D/g, '');

  // Если номер не начинается с кода страны "375", добавляем его в начало
  if (!value.startsWith('375')) {
    value = '375' + value;
  }

  // Начинаем формировать отформатированную строку с префиксом +375
  let formatted = '+375';

  // Добавляем открывающую скобку и первые две цифры после 375, если они есть
  if (value.length > 3) {
    formatted += ' (' + value.substring(3, 5);
  }
  // Если есть минимум 5 цифр, закрываем скобку и добавляем следующий блок из 3 цифр
  if (value.length >= 5) {
    formatted += ') ' + value.substring(5, 8);
  }
  // Если есть минимум 8 цифр, добавляем дефис и следующие 2 цифры
  if (value.length >= 8) {
    formatted += '-' + value.substring(8, 10);
  }
  // Если есть минимум 10 цифр, добавляем еще один дефис и последние 2 цифры
  if (value.length >= 10) {
    formatted += '-' + value.substring(10, 12);
  }

  // Записываем отформатированное значение обратно в input
  input.value = formatted;
});

// Функция валидации формы
function validateForm() {
  // Флаг, показывающий валидна ли форма (true — валидна, false — нет)
  let isValid = true;

  // Получаем элементы формы по id
  const fio = document.getElementById('fio');       // ФИО
  const email = document.getElementById('email');   // Электронная почта
  const phone = document.getElementById('phone');   // Телефон

  // Проверка ФИО: должно быть минимум 5 символов и содержать пробел (разделение имени и фамилии)
  if (fio.value.trim().length < 5 || !fio.value.includes(' ')) {
    // Если условие не выполняется — добавляем класс с ошибкой для подсветки
    fio.classList.add('error-input');
    // Показываем сообщение об ошибке, делаем элемент видимым
    document.getElementById('fio-error').style.display = 'block';
    // Отмечаем форму как невалидную
    isValid = false;
  } else { // Соответствует - убирает
    // Если ФИО корректно — убираем класс ошибки и скрываем сообщение
    fio.classList.remove('error-input');
    document.getElementById('fio-error').style.display = 'none';
  }

  // Проверка email с помощью регулярного выражения:
  // Стандартная проверка на наличие текста@текст.домен без пробелов
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {// Если не соответствует - добавляем класс ошибки и делаем его видимым
    email.classList.add('error-input');
    document.getElementById('email-error').style.display = 'block';
    isValid = false; // Проваливаем валидацию
  } else { // Соответствует - убирает
    email.classList.remove('error-input');
    document.getElementById('email-error').style.display = 'none';
  }

  // Проверка телефона — должен строго соответствовать формату +375 (XX) XXX-XX-XX
  const phoneRegex = /^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;
  if (!phoneRegex.test(phone.value)) { // Если не соответствует - добавляем класс ошибки и делаем его видимым
    phone.classList.add('error-input');
    document.getElementById('phone-error').style.display = 'block';
    isValid = false; // Проваливаем валидацию
  } else { // Соответствует - убирает
    phone.classList.remove('error-input');
    document.getElementById('phone-error').style.display = 'none';
  }

  // Возвращаем итоговое значение — true, если все поля валидны, иначе false
  return isValid;
}




// Назначаем обработчик события "submit" на форму с id "contactForm"
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  // Предотвращаем стандартное поведение отправки формы
  e.preventDefault();

  // Если валидация не прошла — показываем уведомление об ошибке и выходим
  if (!validateForm()) {
    showNotification('error');
    return;
  }

  // Элементы управления отправкой
  const btnText = document.getElementById('btnText');   // Текст кнопки
  const loader = document.getElementById('loader');     // Индикатор загрузки
  const submitBtn = document.getElementById('submitBtn'); // Кнопка отправки

  // Показываем лоадер, скрываем текст кнопки, дизейблим кнопку
  btnText.style.display = 'none';
  loader.style.display = 'inline';
  submitBtn.disabled = true;

  try {
    // Получаем форму и данные из неё
    const form = e.target;
    const formData = new FormData(form);

    // Отправляем данные на указанный URL (обычно используется Formspree)
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json' // Запрашиваем JSON-ответ от сервиса
      }
    });

    if (response.ok) {
      // Успешная отправка: показываем уведомление и сбрасываем форму
      showNotification('success');
      form.reset();
    } else {
      // Ошибка от сервера: читаем и логируем её
      const data = await response.json();
      console.error("Formspree error:", data);
      showNotification('error');
    }
  } catch (error) {
    // Ошибка сети (например, отсутствует интернет)
    console.error("Network error:", error);
    showNotification('error');
  } finally {
    // В любом случае возвращаем элементы в исходное состояние
    btnText.style.display = 'inline';
    loader.style.display = 'none';
    submitBtn.disabled = false;
  }
});




// Функция для показа уведомления определённого типа
function showNotification(type) {
  // Получаем элемент уведомления по id, который формируется из type + 'Notification'
  const notification = document.getElementById(type + 'Notification');

  // Добавляем класс 'show', который отвечает за отображение уведомления 
  notification.classList.add('show');

  // Через 5 секунд автоматически убираем класс 'show', чтобы скрыть уведомление
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// Добавляем обработчики на кнопки закрытия уведомлений
// Находим все элементы с классом 'close-notification' (например, крестик в уведомлении)
document.querySelectorAll('.close-notification').forEach(btn => {
  btn.addEventListener('click', function () {
    // При клике убираем класс 'show' у родительского элемента (самого уведомления)
    this.parentElement.classList.remove('show');
  });
});

// Добавляем обработчик на все input, чтобы при вводе сбрасывать визуальную ошибку
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function () {
    // Если у поля есть класс ошибки 'error-input'
    if (this.classList.contains('error-input')) {
      // Убираем класс ошибки 
      this.classList.remove('error-input');
      // Прячем сообщение об ошибке с id, который формируется как id поля + '-error'
      document.getElementById(this.id + '-error').style.display = 'none';
    }
  });
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


// Подгрузка сотрудников из файла employees.json
fetch('json/employees.json') // Отправка HTTP-запроса для получения JSON-файла
  .then(response => response.json()) // Преобразование ответа в объект JS
  .then(data => {
    const container = document.getElementById('employeesContainer'); // Получение контейнера, в который будут добавлены сотрудники

    // Перебор массива сотрудников из файла
    data.forEach(employee => {
      const section = document.createElement('div'); // Создание div для одного сотрудника
      section.className = 'section'; // Присваивание класса (для стилей)

      // Заполнение HTML-содержимого блока сотрудника
      section.innerHTML = `
        <img src="${employee.image}" alt="${employee.name}"> <!-- Фото сотрудника -->
        <div class="content">
          <h2>${employee.name}</h2> <!-- Имя -->
          <h3>${employee.position}</h3> <!-- Должность -->
          <p>${employee.description}</p> <!-- Описание -->
        </div>
      `;

      container.appendChild(section); // Добавление блока в контейнер на странице
    });
  })
  .catch(error => console.error('Ошибка при загрузке сотрудников:', error)); // Обработка ошибки загрузки


// Подгрузка отзывов из файла testimonials.json
fetch('json/testimonials.json') // Отправка запроса на получение JSON-файла с отзывами
  .then(response => response.json()) // Преобразование ответа в JavaScript-объект
  .then(data => {
    const container = document.getElementById('testimonialsContainer'); // Получение контейнера для вставки отзывов

    // Перебор массива отзывов
    data.forEach(item => {
      const testimonialDiv = document.createElement('div'); // Создание div для одного отзыва
      testimonialDiv.className = 'testimonial'; // Назначение класса для стилей

      // Формирование HTML-содержимого отзыва
      testimonialDiv.innerHTML = `
        <p>${item.text}</p> <!-- Текст отзыва -->
        <strong>— ${item.author}</strong> <!-- Автор отзыва -->
      `;

      container.appendChild(testimonialDiv); // Добавление отзыва в контейнер на странице
    });
  })
  .catch(error => console.error('Ошибка загрузки отзывов:', error)); // Вывод ошибки в консоль при неудачной загрузке

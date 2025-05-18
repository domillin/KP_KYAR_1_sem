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
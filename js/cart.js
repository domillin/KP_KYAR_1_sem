// Загрузка корзины
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    const totalElem = document.getElementById('total');
    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.name} — ${item.price}</span>
        <button onclick="removeItem(${index})">Удалить</button>
      `;
      container.appendChild(div);
      total += parseFloat(item.price);
    });

    // Округление до 2 знаков после запятой
    totalElem.textContent = 'Итого: ' + total.toFixed(2) + ' BYN';
  }

  // Удаление позиции
  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }

  // Очистка корзины
  function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
  }

  // Валидация имени/фамилии
  function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const orderBtn = document.getElementById('orderBtn');

    orderBtn.disabled = !(firstName && lastName);
  }

  // Запрет ввода цифр
  function preventNumbers(e) {
    if (/\d/.test(e.key)) {
      e.preventDefault();
    }
  }

  // Обработка отправки формы
  function handleOrderSubmit() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const name = firstName + ' ' + lastName;

    if (!cart.length) {
      return false;
    }

    // Подготовка данных
    document.getElementById('cartData').value = 
    cart.map(i => `${i.name} - ${i.price}`).join(',\n ') + '\nСтатус: ОПЛАЧЕНО';
    document.getElementById('nameField').value = name;

    // Очистка
    clearCart();
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('orderBtn').disabled = true;

    // Подтверждение на странице (без alert)
    document.getElementById('confirmation').style.display = 'block';

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
  function toggleMenu() {
    const menu = document.querySelector(".nav-links");
    const icon = document.querySelector(".menu-toggle i");
    const overlay = document.querySelector(".overlay");

    menu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  }

  function closeMenu() {
    document.querySelector(".nav-links").classList.remove("active");
    document.querySelector(".overlay").classList.remove("active");
    document.body.classList.remove("menu-open");

    const icon = document.querySelector(".menu-toggle i");
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-times");
  }
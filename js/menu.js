function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2500);
  }
   const btn = document.getElementById("scrollToTopBtn");

  

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
  //Подгрузка меню чая
  async function loadMenu() {
    try {
      const response = await fetch('json/menu.json');
      const items = await response.json();
      const container = document.getElementById('menuContainer');
      container.innerHTML = '';

      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
          <img class="menu-img" src="${item.image}" alt="${item.name}">
          <div class="menu-content">
            <span class="menu-name">${item.name}</span>
            <span class="menu-price">${item.price}</span>
            <button class="menu-button" onclick='addToCart(${JSON.stringify(item)})'>Купить</button>
          </div>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      console.error('Ошибка загрузки меню:', err);
    }
  }
  document.addEventListener('DOMContentLoaded', loadMenu);

  //Десерты
  async function loadSnacks() {
    try {
      const response = await fetch('json/snacks.json');
      const items = await response.json();
      const container = document.getElementById('snacksContainer');
      container.innerHTML = '';

      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
          <img class="menu-img" src="${item.image}" alt="${item.name}">
          <div class="menu-content">
            <span class="menu-name">${item.name}</span>
            <span class="menu-price">${item.price}</span>
            <button class="menu-button" onclick='addToCart(${JSON.stringify(item)})'>Купить</button>
          </div>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      console.error('Ошибка загрузки закусок:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', loadSnacks);

  function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  showPopup(`${item.name} добавлен в корзину`);
}
// Показать кнопку при прокрутке
window.onscroll = function () {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
};

// Прокрутка вверх
btn.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
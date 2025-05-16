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
  const btn = document.getElementById("scrollToTopBtn");

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
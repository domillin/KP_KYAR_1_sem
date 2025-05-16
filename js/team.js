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
// Маска телефона (улучшенная)
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function (e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, '');

  if (!value.startsWith('375')) {
    value = '375' + value;
  }

  let formatted = '+375';

  if (value.length > 3) {
    formatted += ' (' + value.substring(3, 5);
  }
  if (value.length >= 5) {
    formatted += ') ' + value.substring(5, 8);
  }
  if (value.length >= 8) {
    formatted += '-' + value.substring(8, 10);
  }
  if (value.length >= 10) {
    formatted += '-' + value.substring(10, 12);
  }

  input.value = formatted;
});

// Валидация формы
function validateForm() {
  let isValid = true;
  const fio = document.getElementById('fio');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');

  if (fio.value.trim().length < 5 || !fio.value.includes(' ')) {
    fio.classList.add('error-input');
    document.getElementById('fio-error').style.display = 'block';
    isValid = false;
  } else {
    fio.classList.remove('error-input');
    document.getElementById('fio-error').style.display = 'none';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    email.classList.add('error-input');
    document.getElementById('email-error').style.display = 'block';
    isValid = false;
  } else {
    email.classList.remove('error-input');
    document.getElementById('email-error').style.display = 'none';
  }

  const phoneRegex = /^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;
  if (!phoneRegex.test(phone.value)) {
    phone.classList.add('error-input');
    document.getElementById('phone-error').style.display = 'block';
    isValid = false;
  } else {
    phone.classList.remove('error-input');
    document.getElementById('phone-error').style.display = 'none';
  }

  return isValid;
}
//Отправка формы на почту владельца компании, в случае, если она валидна
document.getElementById("contactForm").addEventListener("submit", async (e) => {e.preventDefault();

if (!validateForm()) {
showNotification('error');
return;
}

const btnText = document.getElementById('btnText');
const loader = document.getElementById('loader');
const submitBtn = document.getElementById('submitBtn');

btnText.style.display = 'none';
loader.style.display = 'inline';
submitBtn.disabled = true;

try {
const form = e.target;
const formData = new FormData(form);
const response = await fetch(form.action, {
  method: form.method,
  body: formData,
  headers: {
    'Accept': 'application/json'
  }
});

if (response.ok) {
  showNotification('success');
  form.reset();
} else {
  // Причина ошибки
  const data = await response.json();
  console.error("Formspree error:", data);
  showNotification('error');
}
} 
catch (error) {
  console.error("Network error:", error);
  showNotification('error');
} finally {
  btnText.style.display = 'inline';
  loader.style.display = 'none';
  submitBtn.disabled = false;
}
});
//Уведомления
function showNotification(type) {
  const notification = document.getElementById(type + 'Notification');
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

document.querySelectorAll('.close-notification').forEach(btn => {
  btn.addEventListener('click', function () {
    this.parentElement.classList.remove('show');
  });
});

//Сброс ошибки при вводе
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function () {
    if (this.classList.contains('error-input')) {
      this.classList.remove('error-input');
      document.getElementById(this.id + '-error').style.display = 'none';
    }
  });
});

//Слайдер
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

//Подгрузка сотрудников из json
fetch('json/employees.json')
.then(response => response.json())
.then(data => {
  const container = document.getElementById('employeesContainer');

  data.forEach(employee => {
    const section = document.createElement('div');
    section.className = 'section';

    section.innerHTML = `
      <img src="${employee.image}" alt="${employee.name}">
      <div class="content">
        <h2>${employee.name}</h2>
        <h3>${employee.position}</h3>
        <p>${employee.description}</p>
      </div>
    `;

    container.appendChild(section);
  });
})
.catch(error => console.error('Ошибка при загрузке сотрудников:', error));
//Подгрузка отзывов
fetch('json/testimonials.json')
.then(response => response.json())
.then(data => {
  const container = document.getElementById('testimonialsContainer');

  data.forEach(item => {
    const testimonialDiv = document.createElement('div');
    testimonialDiv.className = 'testimonial';

    testimonialDiv.innerHTML = `
      <p>${item.text}</p>
      <strong>— ${item.author}</strong>
    `;

    container.appendChild(testimonialDiv);
  });
})
.catch(error => console.error('Ошибка загрузки отзывов:', error));
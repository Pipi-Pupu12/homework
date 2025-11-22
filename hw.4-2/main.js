const emailInput = document.getElementById("email");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const sendBtn = document.getElementById("send");
const form = document.getElementById("form");

const emailError = document.getElementById("email-error");
const titleError = document.getElementById("title-error");
const priceError = document.getElementById("price-error");
const imageError = document.getElementById("image-error");

const toast = document.getElementById("toast");

let inflight = false;

function validateEmail(email) {
  if (email !== email.trim()) return { ok: false, reason: "Пробелы в начале/конце" };
  if (email.includes(" ")) return { ok: false, reason: "Пробелы внутри адреса" };

  const parts = email.split("@");
  if (parts.length !== 2) return { ok: false, reason: "Должна быть одна @" };

  const [local, domain] = parts;

  if (!local || local.startsWith(".") || local.endsWith(".")) 
    return { ok: false, reason: "Левая часть некорректна" };

  if (!/^[A-Za-z0-9._%+\-]+$/.test(local))
    return { ok: false, reason: "Недопустимые символы слева" };

  if (!domain || !domain.includes(".")) 
    return { ok: false, reason: "Домен должен содержать точку" };

  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes(".."))
    return { ok: false, reason: "Домен некорректный" };

  const labels = domain.split(".");
  const zone = labels[labels.length - 1];

  if (zone.length < 2) return { ok: false, reason: "Зона должна быть ≥ 2 символов" };
  if (!/^[A-Za-z]+$/.test(zone)) return { ok: false, reason: "Зона только из букв" };

  return { ok: true };
}

function validateTitle(title) {
  return title.trim().length >= 3
    ? { ok: true }
    : { ok: false, reason: "Минимум 3 символа" };
}

function validatePrice(price) {
  const num = Number(price);
  return num > 0
    ? { ok: true }
    : { ok: false, reason: "Должно быть положительное число" };
}

function validateImage(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:"
      ? { ok: true }
      : { ok: false, reason: "URL должен быть http/https" };
  } catch {
    return { ok: false, reason: "Невалидный URL" };
  }
}

function updateUI() {
  const rEmail = validateEmail(emailInput.value);
  const rTitle = validateTitle(titleInput.value);
  const rPrice = validatePrice(priceInput.value);
  const rImage = validateImage(imageInput.value);

  showFieldState(emailInput, emailError, rEmail);
  showFieldState(titleInput, titleError, rTitle);
  showFieldState(priceInput, priceError, rPrice);
  showFieldState(imageInput, imageError, rImage);

  sendBtn.disabled = !(rEmail.ok && rTitle.ok && rPrice.ok && rImage.ok && !inflight);
}

function showFieldState(input, error, result) {
  if (result.ok) {
    input.classList.add("valid");
    input.classList.remove("invalid");
    error.textContent = "";
  } else {
    input.classList.add("invalid");
    input.classList.remove("valid");
    error.textContent = result.reason;
  }
}

[emailInput, titleInput, priceInput, imageInput].forEach(el => {
  el.addEventListener("input", updateUI);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (sendBtn.disabled) return;

  inflight = true;
  sendBtn.disabled = true;
  sendBtn.textContent = "Отправка...";

  const payload = {
    email: emailInput.value,
    title: titleInput.value,
    price: Number(priceInput.value),
    image: imageInput.value
  };

  try {
    const resp = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new Error("Ошибка сервера");

    showToast("Добавлено");

    form.reset();
    [emailInput, titleInput, priceInput, imageInput].forEach(i =>
      i.classList.remove("valid", "invalid")
    );
  } catch (e) {
    showToast(e.message, true);
  }

  inflight = false;
  sendBtn.textContent = "Отправить";
  updateUI();
});

let timer = null;

function showToast(msg, error = false) {
  toast.textContent = msg;
  toast.style.background = error ? "#dc2626" : "#16a34a";

  toast.classList.add("show");

  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

updateUI();
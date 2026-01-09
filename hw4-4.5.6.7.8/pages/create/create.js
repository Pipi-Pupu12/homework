const form = document.querySelector("#create-form");
const inputs = form.querySelectorAll("input");

const clearErrors = () => {
  inputs.forEach(input => {
    input.classList.remove("error");
    input.nextElementSibling.textContent = "";
  });
};

const showError = (input, message) => {
  input.classList.add("error");
  input.nextElementSibling.textContent = message;
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  const price = document.querySelector("#price");
  const image = document.querySelector("#image");

  if (title.value.trim().length < 3) {
    showError(title, "Минимум 3 символа");
    isValid = false;
  }

  if (!description.value.trim()) {
    showError(description, "Описание обязательно");
    isValid = false;
  }

  if (!price.value || isNaN(price.value) || Number(price.value) <= 0) {
    showError(price, "Введите корректную цену");
    isValid = false;
  }

  if (!image.files[0]) {
    showError(image, "Выберите изображение");
    isValid = false;
  } else if (!image.files[0].type.startsWith("image/")) {
    showError(image, "Файл должен быть изображением");
    isValid = false;
  }

  return isValid;
};

const createProduct = async () => {
  if (!validateForm()) return;

  try {
    const formData = new FormData(form);

    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка");
    }

    await response.json();
    window.location.href = "../../index.html";
  } catch (err) {
    console.error(err);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  createProduct();
});

const forms = document.getElementById("forms");
const statusInput = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newProduct = {
    title: form.title.value,
    description: form.description.value,
    price: Number(form.price.value),
    image: form.image.value,
    status: statusInput.value,
  };

  await fetch("http://localhost:8000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  window.location.href = "../../index.html";
});

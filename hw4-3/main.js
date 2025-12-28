const API_URL = "https://fakestoreapi.com/products";
const productsContainer = document.getElementById("products");
const filterBtn = document.getElementById("filterBtn");
const form = document.getElementById("createForm");

let allProducts = [];

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Товар добавлен в корзину");
}

function renderProducts(products) {
  productsContainer.innerHTML = "";

  products.map(product => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}" />
      <h4>${product.title}</h4>
      <p>Цена: $${product.price}</p>
      <button>Добавить в корзину</button>
      <button>Редактировать</button>
    `;

    div.children[3].onclick = () => addToCart(product);
    div.children[4].onclick = () => editProduct(product.id, product.price);

    productsContainer.appendChild(div);
  });
}

async function fetchProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  allProducts = data;
  renderProducts(data);
}

async function createProduct(product) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  alert("Товар добавлен");
}

async function editProduct(id, oldPrice) {
  const newPrice = prompt("Введите новую цену", oldPrice);
  if (!newPrice) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: Number(newPrice) })
  });

  alert("Цена обновлена");
}

function filterProducts() {
  const min = Number(document.getElementById("minPrice").value) || 0;
  const max = Number(document.getElementById("maxPrice").value) || Infinity;

  const filtered = allProducts.filter(
    p => p.price >= min && p.price <= max
  );

  renderProducts(filtered);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: title.value,
    description: description.value,
    price: Number(price.value),
    image: "https://via.placeholder.com/150"
  };

  createProduct(product);
  form.reset();
});

filterBtn.addEventListener("click", filterProducts);

fetchProducts();

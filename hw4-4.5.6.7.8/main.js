const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search");
const priceFilter = document.getElementById("price-filter");
const statusFilter = document.getElementById("status-filter");
const favFilterBtn = document.getElementById("fav-filter");

const row = document.querySelector(".row");
const loader = document.getElementById("loader");
const empty = document.getElementById("empty");

let products = [];
let showOnlyFavorites = false;

// ---------- FAVORITES ----------
const getFavorites = () =>
  JSON.parse(localStorage.getItem("favoriteIds")) || [];

const toggleFavorite = (id) => {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter((item) => item !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favoriteIds", JSON.stringify(favorites));
  renderProducts(getFilteredProducts());
};

// ---------- STATUS TEXT ----------
const getStatusText = (status) => {
  if (status === "new") return "🆕 Новый";
  if (status === "defective") return "⚠️ Брак";
  if (status === "frequently_sold") return "🔥 Хит продаж";
  return "";
};

// ---------- RENDER ----------
const renderProducts = (data) => {
  row.innerHTML = "";

  if (data.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  const favorites = getFavorites();

  data.forEach((product) => {
    const isFavorite = favorites.includes(product.id);

    const div = document.createElement("div");
    div.className = "col-4";

    div.innerHTML = `
      <div class="card ${isFavorite ? "favorite" : ""}">
        <img src="${product.image}" alt="${product.title}" />

        <span class="status status-${product.status}">
          ${getStatusText(product.status)}
        </span>

        <h4>${product.title}</h4>

        <p>${
          product.description.length > 30
            ? product.description.slice(0, 30) + "..."
            : product.description
        }</p>

        <b>${product.price ?? "—"} KGS</b>

        <button class="fav-btn" data-id="${product.id}">
          ${isFavorite ? "В избранном" : "В избранное"}
        </button>

        <a href="./pages/detail/detail.html?id=${product.id}">Подробнее</a>
      </div>
    `;

    row.appendChild(div);
  });

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleFavorite(btn.dataset.id);
    });
  });
};

// ---------- FETCH ----------
const getData = async () => {
  loader.style.display = "block";
  try {
    const res = await fetch("http://localhost:8000/products");
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error(err);
  } finally {
    loader.style.display = "none";
  }
};

getData();

// ---------- FILTERS ----------
const getFilteredProducts = () => {
  let data = [...products];

  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    data = data.filter((p) =>
      p.title.toLowerCase().includes(searchValue)
    );
  }

  if (priceFilter.value === "more") {
    data.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }

  if (priceFilter.value === "less") {
    data.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }

  if (statusFilter.value) {
    data = data.filter((p) => p.status === statusFilter.value);
  }

  if (showOnlyFavorites) {
    const favorites = getFavorites();
    data = data.filter((p) => favorites.includes(p.id));
  }

  return data;
};

// ---------- EVENTS ----------
searchBtn.addEventListener("click", () => {
  renderProducts(getFilteredProducts());
});

searchInput.addEventListener("input", () => {
  renderProducts(getFilteredProducts());
});

priceFilter.addEventListener("change", () => {
  renderProducts(getFilteredProducts());
});

statusFilter.addEventListener("change", () => {
  renderProducts(getFilteredProducts());
});

favFilterBtn.addEventListener("click", () => {
  showOnlyFavorites = !showOnlyFavorites;
  favFilterBtn.textContent = showOnlyFavorites
    ? "Показать все"
    : "Избранное";
  renderProducts(getFilteredProducts());
});

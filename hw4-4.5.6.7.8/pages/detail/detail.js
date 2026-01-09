const detail = document.querySelector("#detail");
const edit = document.querySelector("#edit");
const editForm = document.querySelector("#edit-form");
const btnCancel = document.querySelector("#btn-cancel");

const deleteProduct = async (id) => {
  try {
    const ok = confirm("Точно хотите удалить товар?");
    if (!ok) return;
    const res = await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Не удалось удалить товар", res.status);
    // alert("Товар успешно удален");
    window.location.href = "/";
  } catch (err) {
    console.error(err);
    alert("Не удалось удалить товар");
  }
};

const getDetail = async () => {
  try {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      detail.innerHTML = `<h2>Товара нет</h2>`;
      return;
    }
    const res = await fetch(`http://localhost:8000/products/${id}`);
    if (!res.ok) {
      detail.innerHTML = `<h2>Товара нет с таким ID</h2>`;
      return;
    }
    const data = await res.json();

    detail.innerHTML = `
    <div class="card">
      <img src="${data.image}" alt="${data.title}" />
      <h4>${data.title}</h4>
      <p>${data.description}</p>
      <b>${data.price} KGS</b>
      <button class="btn" id="edit-btn">edit</button>
      <button class="btn" id="delete-btn">delete</button>
    </div>
    `;

    document.querySelector('[name="title"]').value = data.title || "";
    document.querySelector('[name="description"]').value =
      data.description || "";
    document.querySelector('[name="price"]').value = data.price || "";
    // document.querySelector('[name="image"]').value = data.image || "";

    document.querySelector("#delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      deleteProduct(id);
    });
    document.querySelector("#edit-btn").addEventListener("click", (e) => {
      e.preventDefault();
      edit.style.display = "flex";
    });
  } catch (err) {
    console.error(err);
  }
};

const updateProduct = async () => {
  try {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      detail.innerHTML = `<h2>Товара нет</h2>`;
      return;
    }
    const formData = new FormData(editForm);
    const response = await fetch(`http://localhost:8000/products/${id}`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Не удалось обновить товар", response.status);
    }
    await response.json();
    edit.style.display = "none";
    getDetail();
    window.location.href = "../../index.html";
  } catch (err) {
    console.error(err);
  }
};

btnCancel.addEventListener("click", () => {
  edit.style.display = "none";
});

edit.addEventListener("click", () => {
  edit.style.display = "none";
});

editForm.addEventListener("click", (e) => {
  e.stopPropagation();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateProduct();
});

getDetail();

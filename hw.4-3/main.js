const searchInput = document.getElementById('search');
const usersList = document.getElementById('users-list');

let users = [
    { id: 1, name: "Иван Иванов" },
    { id: 2, name: "Мария Петрова" },
    { id: 3, name: "Алексей Смирнов" },
    { id: 4, name: "Анна Иванова" },
    { id: 5, name: "Сергей Кузнецов" }
];

function highlightName(name, query) {
    const reg = new RegExp(query, "gi");
    return name.replace(reg, match => `<mark>${match}</mark>`);
}

function render(list, query = "") {
    usersList.innerHTML = list.map(u => `
        <li>${highlightName(u.name, query)}</li>
    `).join("");
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase())
    );
    render(filtered, query);
});

render(users);

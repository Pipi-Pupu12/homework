const input = document.getElementById("email");
const btn = document.getElementById("send");
const hint = document.getElementById("hint");

function validateEmail(email) {
  if (email !== email.trim()) return { ok: false, reason: "Пробелы в начале/конце" };
  if (email.includes(" ")) return { ok: false, reason: "Пробелы внутри e-mail недопустимы" };

  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) return { ok: false, reason: "Должна быть ровно одна @" };

  const [local, domain] = email.split("@");

  if (!local) return { ok: false, reason: "Левая часть пустая" };
  if (local.startsWith(".") || local.endsWith(".")) return { ok: false, reason: "Нельзя начинать/заканчивать точкой" };
  if (!/^[A-Za-z0-9._%+\-]+$/.test(local)) return { ok: false, reason: "Недопустимые символы слева" };

  if (!domain) return { ok: false, reason: "Домен пуст" };
  if (!domain.includes(".")) return { ok: false, reason: "В домене должна быть точка" };
  if (domain.startsWith(".") || domain.endsWith(".")) return { ok: false, reason: "Домен не может начинаться/заканчиваться точкой" };
  if (domain.includes("..")) return { ok: false, reason: "Домен не должен содержать .." };
  if (!/^[A-Za-z0-9.\-]+$/.test(domain)) return { ok: false, reason: "Недопустимые символы в домене" };

  const parts = domain.split(".");
  if (parts.some(p => p.length === 0)) return { ok: false, reason: "Пустая часть домена" };

  const zone = parts[parts.length - 1];
  if (zone.length < 2) return { ok: false, reason: "Зона ≥ 2 символов" };
  if (!/^[A-Za-z]+$/.test(zone)) return { ok: false, reason: "Зона только из букв" };

  return { ok: true };
}

function updateUI() {
  const email = input.value;
  const result = validateEmail(email);

  if (result.ok) {
    input.classList.add("valid");
    input.classList.remove("invalid");
    hint.textContent = "Ок";
    hint.className = "hint ok";
    btn.disabled = false;
  } else {
    input.classList.add("invalid");
    input.classList.remove("valid");
    hint.textContent = result.reason;
    hint.className = "hint err";
    btn.disabled = true;
  }
}

input.addEventListener("input", updateUI);

btn.addEventListener("click", () => {
  if (!btn.disabled) {
    alert(input.value);
  }
});

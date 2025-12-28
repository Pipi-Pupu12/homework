function safeParse(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function makeDinner(hasIngredients) {
  if (hasIngredients) {
    console.log("Готовим ужин");
  } else {
    console.log("Нет ингредиентов");
  }
}

async function processOrder(orderJson) {
  const result = safeParse(orderJson);
  if (!result.ok) {
    console.error(result.error);
    return;
  }
  makeDinner(result.data.hasIngredients);
}

Promise.resolve(2)
  .then((n) => n * 3)
  .then((n) => {
    throw new Error("сломалось");
  })
  .then((n) => console.log(n))
  .catch((e) => console.error(e.message))
  .finally(() => console.log("Код завершил работу"));

const acceptOrder = (order) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!order.name) reject("Нет имени клиента");
      else resolve({ ...order, accepted: true });
    }, 1000);
  });

const cookOrder = (order) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (order.hasIngredients === false) reject("Нет ингредиентов");
      else resolve({ ...order, cooked: true });
    }, 2000);
  });

const deliverOrder = (order) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!order.address) reject("Нет адреса доставки");
      else resolve({ ...order, delivered: true });
    }, 1500);
  });

processOrder('{"hasIngredients": true}');
process

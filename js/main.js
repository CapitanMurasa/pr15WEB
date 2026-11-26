const cart = new Map();
const cartItems = document.querySelector("#cart-items");
const emptyCart = document.querySelector("#empty-cart");
const total = document.querySelector("#total");
const numberFormat = new Intl.NumberFormat("uk-UA");

function formatPrice(price) {
  return numberFormat.format(price) + " грн";
}

function showCart() {
  let sum = 0;
  cartItems.replaceChildren();

  for (const [name, item] of cart) {
    const row = document.createElement("li");
    row.className = "cart-item py-2";

    const title = document.createElement("div");
    title.textContent = name;

    const price = document.createElement("small");
    price.textContent = item.quantity + " × " + formatPrice(item.price);

    const remove = document.createElement("button");
    remove.className = "btn btn-link btn-sm float-right p-0";
    remove.type = "button";
    remove.dataset.remove = name;
    remove.textContent = "Видалити";
    remove.setAttribute("aria-label", "Видалити " + name);

    row.append(title, price, remove);
    cartItems.append(row);
    sum += item.price * item.quantity;
  }

  emptyCart.hidden = cart.size > 0;
  total.textContent = formatPrice(sum);
}

window.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.hasAttribute("data-remove")) {
    cart.delete(button.dataset.remove);
    showCart();
    document.querySelector("#cart-title").focus();
    return;
  }

  const product = button.closest(".product");
  if (!product) return;

  const counter = product.querySelector("[data-counter]");
  let quantity = Number(counter.value);

  if (button.hasAttribute("data-action")) {
    const change = button.dataset.action === "plus" ? 1 : -1;
    quantity = Math.max(1, Math.min(99, quantity + change));
    counter.value = quantity;
    product.querySelector('[data-action="minus"]').disabled = quantity === 1;
    product.querySelector('[data-action="plus"]').disabled = quantity === 99;
  }

  if (button.hasAttribute("data-add")) {
    const name = product.querySelector(".product-name").textContent;
    const item = cart.get(name) || { price: Number(product.dataset.price), quantity: 0 };
    item.quantity += quantity;
    cart.set(name, item);
    showCart();
  }
});

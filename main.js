let cards = document.querySelector(".cards");
let shop = document.getElementById("shop");
let count = document.querySelector(".counter");

const getData = async (url) => {
  const res = await (await fetch(url)).json();
  return res;
};

let shop_data = JSON.parse(localStorage.getItem("shop")) || [];

function counterFunc(shop_data) {
  if (count) count.textContent = shop_data.length;
}
counterFunc(shop_data);

if (cards) {
  getData("https://69035efbd0f10a340b23ed3d.mockapi.io/api/products").then(
    (data) => addUIData(data)
  );
}

if (shop) {
  addUIShop(shop_data);
}

function addUIData(data) {
    cards.innerHTML = "";
  
    data.slice(0, data.length - 1).forEach((element) => {

        const product = element.product;
  
      if (!product) return; 
  
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <div class="card_img">
        <img class="yurak" src="./img/Vector.png" alt="" />
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="card_title">
          <h2 class="h2">${product.name.slice(0, 50)}...</h2>
        <img class="yulduz" src="./img/yul.png" alt="" />
          <div class="sum-savat">
          <p class="price">${product.price}</p>
        <img class="savat" src="./img/add to cart.png" data-id="${product.id} alt="" />
          </div>
        </div>
      `;
      cards.append(div);
    });
  
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = +e.currentTarget.dataset.id;
        const findData = data.find((v) => v.product.id === id);
        if (!findData) return;
  
        const product = findData.product;
  
        const existing = shop_data.find((item) => item.id === id);
        if (existing) {
          existing.count += 1;
        } else {
          shop_data.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            count: 1,
          });
        }
  
        localStorage.setItem("shop", JSON.stringify(shop_data));
        counterFunc(shop_data);
      });
    });
  }
  

function addUIShop(data) {
  shop.innerHTML = "";

  if (!data.length) {
    shop.innerHTML = `<p class="text-center text-gray-400">🛍 Savat bo'sh</p>`;
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-card">
        <img src="${item.img}" alt="${item.title}" class="cart-img" />

        <div class="cart-info">
          <h3 class="cart-title">${item.title}</h3>
          <p class="cart-sub">Add to Favorites</p>
          <button class="remove-btn" data-id="${item.id}">
            <i class="fa-solid fa-xmark"></i> Remove
          </button>
        </div>

        <div class="cart-controls">
          <div class="qty-box">
            <button class="dec-btn" data-id="${item.id}">-</button>
            <span>${item.count}</span>
            <button class="inc-btn" data-id="${item.id}">+</button>
          </div>
          <p class="cart-price">$${item.userPrice.toLocaleString()}</p>
        </div>
      </div>
    `;
    shop.append(div);
  });

  document
    .querySelectorAll(".inc-btn")
    .forEach((btn) =>
      btn.addEventListener("click", (e) =>
        changeQuantity(+e.currentTarget.dataset.id, "inc")
      )
    );
  document
    .querySelectorAll(".dec-btn")
    .forEach((btn) =>
      btn.addEventListener("click", (e) =>
        changeQuantity(+e.currentTarget.dataset.id, "dec")
      )
    );

  document
    .querySelectorAll(".remove-btn")
    .forEach((btn) =>
      btn.addEventListener("click", (e) =>
        deleteShopData(+e.currentTarget.dataset.id)
      )
    );
}

function changeQuantity(id, type) {
  shop_data = shop_data.map((item) => {
    if (item.id === id) {
      const count =
        type === "inc" ? item.count + 1 : item.count > 1 ? item.count - 1 : 1;
      return { ...item, count, userPrice: item.price * count };
    }
    return item;
  });
  localStorage.setItem("shop", JSON.stringify(shop_data));
  counterFunc(shop_data);
  addUIShop(shop_data);
}

function deleteShopData(id) {
  shop_data = shop_data.filter((v) => v.id !== id);
  localStorage.setItem("shop", JSON.stringify(shop_data));
  counterFunc(shop_data);
  addUIShop(shop_data);
}

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".dots");

let index = 0;
let interval;

slides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function showSlide(i) {
  slides.forEach((s, idx) => {
    s.classList.remove("active", "prev");
    if (idx === i) s.classList.add("active");
  });
  dots.forEach((d, idx) => {
    d.classList.toggle("active", idx === i);
  });
}

function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

function goToSlide(i) {
  index = i;
  showSlide(index);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

function startAutoSlide() {
  interval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
  clearInterval(interval);
}

document.querySelector(".slider").addEventListener("mouseenter", stopAutoSlide);
document
  .querySelector(".slider")
  .addEventListener("mouseleave", startAutoSlide);

startAutoSlide();
  
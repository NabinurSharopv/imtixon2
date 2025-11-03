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
  data.slice(0, data.length - 1).forEach((element, index) => {
    const product = element.product;
    if (!product) return;
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <div class="card_img">

            <img class="yurak" data-id="${product.id}" src="./img/Vector.png" alt="like" />

        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="card_title">
        <h2 class="h2">${product.name.slice(0, 50)}...</h2>
      <img class="yulduz" src="./img/yul.png" alt="" />
        <div class="sum-savat">
        <p class="price">${product.price || "Narx ko'rsatilmagan"}</p>
        <img class="add-to-cart" src="./img/img7.png" data-id="${product.id}" alt="add to cart" />
        </div>
      </div>
    `;
    cards.append(div);
  });


///////////////////////////////

cards.addEventListener("click", (e) => {
  if (e.target.classList.contains("yurak")) {
    const yurak = e.target;
    const card = yurak.closest(".card");
    const id = card.querySelector(".add-to-cart").dataset.id;
    const name = card.querySelector(".h2").textContent;
    const img = card.querySelector(".card_img img:nth-child(2)").src;
    const price = card.querySelector(".price").textContent;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Agar allaqachon sevimlilarda bo'lmasa qo'shamiz
    if (!favorites.some(p => p.id == id)) {
      favorites.push({ id, name, img, price });
      yurak.src = "./img/download.svg"; // qizil yurak
    } else {
      favorites = favorites.filter(p => p.id != id);
      yurak.src = "./img/Vector.png"; // oq yurak
    }

    // Saqlaymiz
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
});



///////////////////////////////




  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = +e.currentTarget.dataset.id;
      const findData = data.find((v) => v.product.id === id);
      if (!findData) return;

      const product = findData.product;

      console.log(`🔍 Mahsulot ${product.name} uchun narx qidirilmoqda...`);

      let productPrice = null;

      if (product.price && product.price !== null) {
        productPrice = convertSumToNumber(product.price);
        console.log(`✅ product.price dan narx topildi: ${productPrice} so'm`);
      } else {
        productPrice = id * 45000 + 55000;
        console.log(
          `⚠️ Hech qanday narx topilmadi, ID asosida narx belgilandi: ${productPrice} so'm`
        );
      }

      console.log(
        `🎯 Mahsulot ${product.name} savatga qo'shildi: ${formatSum(
          productPrice
        )}`
      );

      const existing = shop_data.find((item) => item.id === id);
      if (existing) {
        existing.count += 1;
      } else {
        shop_data.push({
          id: product.id,
          name: product.name,
          price: productPrice,
          image: product.image,
          count: 1,
        });
      }

      localStorage.setItem("shop", JSON.stringify(shop_data));
      counterFunc(shop_data);

      window.location.href = "shop.html";
    });
  });
}






function convertSumToNumber(sumPrice) {
  if (!sumPrice) return 100000;

  const cleanPrice = sumPrice.replace(/[^\d]/g, "").replace(/\s+/g, "");

  const priceNumber = Number(cleanPrice);

  return isNaN(priceNumber) || priceNumber === 0 ? 100000 : priceNumber;
}

function formatSum(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " сум";
}

function addUIShop(data) {
  shop.innerHTML = "";
  if (!data.length) {
    shop.innerHTML = `<p class="text-center text-gray-400">🛍 Savat bo'sh</p>`;
    document.getElementById("total-price").textContent = "0 сум";
    return;
  }
  data.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` 
      <div class="cart-card flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <img src="${item.image}" alt="${item.name}" class="cart-img w-20 h-20 object-cover rounded" />

        <div class="cart-info flex-1 ml-4 ">
          <h3 class="cart-title text-black font-semibold text-lg">${item.name}</h3>
          <p class="cart-sub text-gray-600">Add to Favorites</p>
          <button class="remove-btn text-red-500 mt-2" data-id="${item.id}">
            <i class="fa-solid fa-xmark"></i> Remove
          </button>
        </div>

        <div class="cart-controls flex flex-col  items-center gap-2">
          <div class=" flex items-center gap-2">
            <button class="dec-btn bg-gray-200 px-2 py-1 rounded" data-id="${item.id}">-</button>
            <span class="font-medium text-black">${item.count}</span>
            <button class="inc-btn bg-gray-200 px-2 py-1 rounded" data-id="${item.id}">+</button>
          </div>
          <p class="cart-price text-black font-semibold">${formatSum(item.price * item.count)}</p>
        </div>
      </div>
    `;
    shop.append(div);
  });

  // Total price
  const total = data.reduce((sum, item) => sum + item.price * item.count, 0);
  document.getElementById("total-price").textContent = formatSum(total);

  // Eventlar
  document.querySelectorAll(".inc-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => changeQuantity(+e.currentTarget.dataset.id, "inc"))
  );
  document.querySelectorAll(".dec-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => changeQuantity(+e.currentTarget.dataset.id, "dec"))
  );
  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => deleteShopData(+e.currentTarget.dataset.id))
  );
}
 

function changeQuantity(id, type) {
  console.log("🔢 changeQuantity:", id, type);

  shop_data = shop_data.map((item) => {
    if (item.id === id) {
      const count =
        type === "inc" ? item.count + 1 : item.count > 1 ? item.count - 1 : 1;
      return { ...item, count };
    }
    return item;
  });

  localStorage.setItem("shop", JSON.stringify(shop_data));
  counterFunc(shop_data);
  addUIShop(shop_data);
}

function deleteShopData(id) {
  console.log("🗑️ deleteShopData:", id);
  shop_data = shop_data.filter((v) => v.id !== id);
  localStorage.setItem("shop", JSON.stringify(shop_data));
  counterFunc(shop_data);
  addUIShop(shop_data);
}

if (document.querySelector(".slider")) {
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

  document
    .querySelector(".slider")
    .addEventListener("mouseenter", stopAutoSlide);
  document
    .querySelector(".slider")
    .addEventListener("mouseleave", startAutoSlide);

  startAutoSlide();
}










let products = [
  { id: 1, name: "Redmi Note 14", price: 3000000, img: "https://images.uzum.uz/cuib3etht56sc95d8r1g/t_product_540_high.jpg" },
  { id: 2, name: "Samsung Galaxy S23", price: 9000000, img: "https://images.samsung.com/galaxy-s23.jpg" }
];

const cardContainer = document.getElementById("cardContainer");
const addBtn = document.getElementById("addBtn");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imgInput = document.getElementById("img");

function renderCards() {
  cardContainer.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow p-4 flex flex-col items-center";

    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="w-40 h-40 object-cover mb-4 rounded">
      <h2 class="text-lg font-bold mb-2">${product.name}</h2>
      <p class="text-gray-700 mb-4">${product.price.toLocaleString()} so'm</p>
      <div class="flex gap-2">
        <button onclick="editProduct(${product.id})" class="bg-yellow-400 px-3 py-1 rounded">Tahrirlash</button>
        <button onclick="deleteProduct(${product.id})" class="bg-red-500 text-white px-3 py-1 rounded">O'chirish</button>
      </div>
    `;

    cardContainer.appendChild(card);
  });
}

addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const price = parseInt(priceInput.value.trim());
  const img = imgInput.value.trim();

  if(name && price && img){
    const newProduct = { id: Date.now(), name, price, img };
    products.push(newProduct);
    renderCards();
    nameInput.value = "";
    priceInput.value = "";
    imgInput.value = "";
  } else {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
  }
});

function deleteProduct(id){
  products = products.filter(p => p.id !== id);
  renderCards();
}

function editProduct(id){
  const product = products.find(p => p.id === id);
  const newName = prompt("Yangi nom:", product.name);
  const newPrice = prompt("Yangi narx:", product.price);
  const newImg = prompt("Yangi rasm URL:", product.img);

  if(newName && newPrice && newImg){
    product.name = newName;
    product.price = parseInt(newPrice);
    product.img = newImg;
    renderCards();
  }
}

renderCards();

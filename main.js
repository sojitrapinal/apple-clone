const mockProducts = [
  {
    id: "phone-1",
    type: "phone",
    name: "Brand Phone 15",
    tagline: "All-day battery. Ultra sharp display.",
    price: 52990,
    image: "./images/iPhone_15.webp",
    features: ["6.1-inch display", "Dual-camera system", "All-day battery life"],
  },
  {
    id: "phone-2",
    type: "phone",
    name: "Brand Phone 15 Pro",
    tagline: "Pro power in your pocket.",
    price: 61999,
    image: "./images/iphone-15-pro.jpeg",
    features: ["Pro camera system", "Titanium body", "USB-C"],
  },
  {
    id: "laptop-1",
    type: "laptop",
    name: "BrandBook Air 14",
    tagline: "Lightweight. Powerful. Silent.",
    price: 111900,
    image: "./images/mackbookair.jpeg",
    features: ["14-inch display", "Fanless design", "Up to 18 hours battery"],
  },
  {
    id: "laptop-2",
    type: "laptop",
    name: "BrandBook Pro 16",
    tagline: "For creators and power users.",
    price: 178700,
    image: "./images/macbook-pro.webp",
    features: ["16-inch display", "High-performance chip", "Studio audio"],
  },
  {
    id: "accessory-1",
    type: "accessory",
    name: "BrandBuds",
    tagline: "Rich sound in a tiny case.",
    price: 25900,
    image: "./images/airpod.jpeg",
    features: ["Noise cancellation", "Wireless charging case", "Quick pairing"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  const yearSpan = document.getElementById("year");
  const page = document.documentElement.getAttribute("data-page");

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  if (page === "home") renderFeaturedProducts();
  if (page === "products") setupProductsPage();
  if (page === "product") setupProductDetailPage();
  if (page === "cart") renderCart();
  if (page === "login") setupLoginForm();
});


function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;
  const featured = mockProducts.slice(0, 3);

  container.innerHTML = featured
    .map(
      (p) => `
      <article class="card">
        <div class="card-image-wrap">
          <img src="${p.image}" alt="${p.name}" class="card-image" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-tagline">${p.tagline}</p>
          <p class="card-price">From ₹${p.price}</p>
        </div>
        <div class="card-footer">
          <a href="product.html?id=${encodeURIComponent(
            p.id
          )}" class="btn btn-ghost">View</a>
          <button class="btn btn-primary" data-add-to-cart="${p.id}">
            Add to cart
          </button>
        </div>
      </article>
    `
    )
    .join("");

  container.addEventListener("click", (e) => {
    if (e.target.matches("[data-add-to-cart]")) {
      const id = e.target.getAttribute("data-add-to-cart");
      addToCart(id);
      alert("Added to cart");
    }
  });
}


function setupProductsPage() {
  const container = document.getElementById("productList");
  const searchInput = document.getElementById("productSearch");
  const chips = document.querySelectorAll(".chip-row .chip");
  if (!container) return;

  let activeFilter = "all";

  function renderList(query = "") {
    const q = query.toLowerCase();
    let products = mockProducts;

    if (activeFilter !== "all") {
      products = products.filter((p) => p.type === activeFilter);
    }

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );

    container.innerHTML = filtered
      .map(
        (p) => `
      <article class="card">
        <div class="card-image-wrap">
          <img src="${p.image}" alt="${p.name}" class="card-image" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-tagline">${p.tagline}</p>
          <p class="card-price">₹${p.price}</p>
        </div>
        <div class="card-footer">
          <a href="product.html?id=${encodeURIComponent(
            p.id
          )}" class="btn btn-ghost">View</a>
          <button class="btn btn-primary" data-add-to-cart="${p.id}">
            Add to cart
          </button>
        </div>
      </article>
    `
      )
      .join("");
  }

  renderList();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderList(e.target.value);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("chip-active"));
      chip.classList.add("chip-active");
      activeFilter = chip.getAttribute("data-filter");
      renderList(searchInput ? searchInput.value : "");
    });
  });
}


function setupProductDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = mockProducts.find((p) => p.id === id) || mockProducts[0];

  const nameEl = document.getElementById("productName");
  const taglineEl = document.getElementById("productTagline");
  const priceEl = document.getElementById("productPrice");
  const featuresEl = document.getElementById("productFeatures");
  const breadcrumbName = document.getElementById("breadcrumbName");
  const addToCartBtn = document.getElementById("addToCartBtn");

  if (!product) return;

  if (nameEl) nameEl.textContent = product.name;
  if (taglineEl) taglineEl.textContent = product.tagline;
  if (priceEl) priceEl.textContent = `₹${product.price}`;
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  if (featuresEl) {
    featuresEl.innerHTML = product.features.map((f) => `<li>${f}</li>`).join("");
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCart(product.id);
      alert("Added to cart");
    });
  }
}


function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }
  saveCart(cart);
}

function renderCart() {
  const container = document.getElementById("cartContainer");
  const summary = document.getElementById("cartSummary");
  if (!container || !summary) return;

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    summary.innerHTML = "";
    return;
  }

  let total = 0;

  container.innerHTML = cart
    .map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      if (!product) return "";
      const lineTotal = product.price * item.qty;
      total += lineTotal;
      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong>
            <div class="muted">Qty: ${item.qty}</div>
          </div>
          <div>
            ₹${lineTotal}
            <button data-remove="${product.id}" class="btn btn-ghost" style="margin-left: 0.5rem; font-size: 0.75rem;">
              Remove
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  summary.innerHTML = `
    <div><strong>Total:</strong> ₹${total}</div>
    <button class="btn btn-primary">Checkout</button>
  `;

  container.addEventListener("click", (e) => {
    if (e.target.matches("[data-remove]")) {
      const id = e.target.getAttribute("data-remove");
      const updated = getCart().filter((item) => item.productId !== id);
      saveCart(updated);
      renderCart();
    }
  });
}


function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("Login payload (send to backend later):", payload);
    alert("Frontend-only demo: hook this form to /api/login on your backend.");
  });
}

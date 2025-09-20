import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBPONiic8kjN_WBB66r6y04zDB6mI1dTYw",
  authDomain: "flexxmart-5127c.firebaseapp.com",
  projectId: "flexxmart-5127c",
  storageBucket: "flexxmart-5127c.firebasestorage.app",
  messagingSenderId: "220683612360",
  appId: "1:220683612360:web:9898850a45983dd31475fd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Search functionality
function handleSearch(query) {
  if (query && query.trim()) {
    window.location.href = `search.html?query=${encodeURIComponent(query.trim())}`;
  }
}

// ✅ Bind search events to elements
function bindSearchEvents() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  if (searchBtn && searchInput) {
    searchBtn.replaceWith(searchBtn.cloneNode(true));
    searchInput.replaceWith(searchInput.cloneNode(true));

    const newSearchInput = document.getElementById('searchInput');
    const newSearchBtn = document.getElementById('searchBtn');

    newSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSearch(newSearchInput.value);
    });

    newSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch(newSearchInput.value);
      }
    });

    console.log('✅ Search events bound');
  }
}

// ✅ Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartCountEls = document.querySelectorAll("#cart-count");
  cartCountEls.forEach(el => {
    if (el) el.textContent = count;
  });

  document.dispatchEvent(new CustomEvent("cart-updated", { detail: { count } }));
}

// ✅ Wait for header injection
function waitForHeader() {
  let attempts = 0;
  const maxAttempts = 50;

  const checkForHeader = () => {
    attempts++;
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) {
      bindSearchEvents();
      updateCartCount();

      onAuthStateChanged(auth, () => {
        document.body.classList.remove("auth-loading");
        updateCartCount();
      });
      return true;
    } else if (attempts < maxAttempts) {
      setTimeout(checkForHeader, 100);
    }
  };

  checkForHeader();

  // react to custom event from inject.js
  document.addEventListener('header-loaded', () => {
    setTimeout(() => {
      bindSearchEvents();
      updateCartCount();
    }, 100);
  });
}

// ✅ Load categories
async function loadCategories() {
  try {
    const categoryDropdown = document.getElementById("categoryDropdown");
    const categoryContainer = document.getElementById("categoryContainer");

    const snapshot = await getDocs(collection(db, "categories"));

    if (categoryDropdown) categoryDropdown.innerHTML = "";
    if (categoryContainer) categoryContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const { name, image } = doc.data();
      const slug = name.toLowerCase().replace(/\s+/g, "-");

      if (categoryDropdown) {
        const a = document.createElement("a");
        a.href = `shop.html#${slug}`;
        a.textContent = name;
        categoryDropdown.appendChild(a);
      }

      if (categoryContainer) {
        const div = document.createElement("div");
        div.className = "category-card";
        div.innerHTML = `
          <img src="${image}" alt="${name}" loading="lazy">
          <h4>${name}</h4>
          <button onclick="location.href='shop.html#${slug}'">Shop Now</button>
        `;
        categoryContainer.appendChild(div);
      }
    });
  } catch (e) {
    console.error("Category fetch failed:", e);
  }
}

// ✅ Logout
window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("cart");
      updateCartCount();
      location.reload();
    })
    .catch((e) => alert("Logout failed: " + e.message));
};

// ✅ Global addToCart
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.handleSearch = handleSearch;

// ✅ Initialize
document.addEventListener("DOMContentLoaded", () => {
  waitForHeader();
  loadCategories();
});

export { db, auth, updateCartCount, addToCart };

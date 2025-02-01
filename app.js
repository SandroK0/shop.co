const API_URL = "https://fakestoreapi.com";

// Select elements
const productsGrid = document.getElementById("products-grid");
const searchInputs = [document.getElementById("search-bar"), document.getElementById("search-bar-2")];
const burgerBtn = document.getElementById("burger-menu-btn");
const dropdown = document.getElementById("dropdown");

// Sections
const landingSection = document.getElementById("landing-section");
const brandsCont = document.getElementById("brands");
const newArrivalsHeader = document.getElementById("new-arrivals-section-header");
const stylesSection = document.getElementById("styles-section");
const feedbackSection = document.getElementById("feedback-section");
const footer = document.getElementById("footer");

// Feedback section controls
const feedbackCardsCont = document.getElementById("feedback-cards-cont");
const scrollRightBtn = document.getElementById("right-btn");
const scrollLeftBtn = document.getElementById("left-btn");

/* =====================
    DROPDOWN TOGGLE
===================== */
burgerBtn.addEventListener("click", () => {
  const isActive = dropdown.classList.contains("active");

  if (isActive) {
    dropdown.classList.remove("active");
    setTimeout(() => (dropdown.style.display = "none"), 300);
  } else {
    dropdown.style.display = "block";
    setTimeout(() => dropdown.classList.add("active"), 10);
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  if (!burgerBtn.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("active");
    setTimeout(() => (dropdown.style.display = "none"), 300);
  }
});

/* =====================
    FEEDBACK SCROLL
===================== */
scrollRightBtn.addEventListener("click", () => {
  feedbackCardsCont.scrollBy({ left: 100, behavior: "smooth" });
});

scrollLeftBtn.addEventListener("click", () => {
  feedbackCardsCont.scrollBy({ left: -100, behavior: "smooth" });
});

/* =====================
    STATE MANAGEMENT
===================== */
// Save original attributes to sessionStorage
function saveOriginalState() {
  sessionStorage.setItem("landingSectionDisplay", landingSection.style.display);
  sessionStorage.setItem("brandsContDisplay", brandsCont.style.display);
  sessionStorage.setItem("newArrivalsHeaderText", newArrivalsHeader.innerHTML);
  sessionStorage.setItem("stylesSectionDisplay", stylesSection.style.display);
  sessionStorage.setItem("feedbackSectionDisplay", feedbackSection.style.display);
  sessionStorage.setItem("footerDisplay", footer.style.display);
}

// Restore attributes from sessionStorage
function restoreOriginalState() {
  landingSection.style.display = sessionStorage.getItem("landingSectionDisplay");
  brandsCont.style.display = sessionStorage.getItem("brandsContDisplay");
  stylesSection.style.display = sessionStorage.getItem("stylesSectionDisplay");
  feedbackSection.style.display = sessionStorage.getItem("feedbackSectionDisplay");
  footer.style.display = sessionStorage.getItem("footerDisplay");
  newArrivalsHeader.innerHTML = sessionStorage.getItem("newArrivalsHeaderText");
}

// Show/hide non-product sections
function showOnlyProducts(show) {
  if (show) {
    landingSection.style.display = "none";
    brandsCont.style.display = "none";
    stylesSection.style.display = "none";
    feedbackSection.style.display = "none";
    footer.style.display = "none";
    newArrivalsHeader.innerHTML = "Products";
  } else {
    restoreOriginalState();
  }
}

// Save original state on page load
document.addEventListener("DOMContentLoaded", saveOriginalState);

/* =====================
    FETCH PRODUCTS
===================== */
async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/* =====================
    PRODUCT RENDERING
===================== */
// Generate star ratings for products
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return `
    ${"<img height=18 src='./assets/star.svg'>".repeat(fullStars)}
    ${hasHalfStar ? "<img height=18 src='./assets/half-star.svg'>" : ""}
  `;
}

// Filter products based on search term
function filterProducts(products, searchTerm) {
  return products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Render up to 8 products
async function renderProducts(searchTerm = "") {
  const products = await fetchProducts();

  if (!products.length) {
    productsGrid.innerHTML = `<p>No products available at the moment.</p>`;
    return;
  }

  const limitedProducts = products.slice(0, 8);
  const filteredProducts = filterProducts(limitedProducts, searchTerm);

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-rating">${generateStars(product.rating.rate)} ${product.rating.rate}/5</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      </div>
    `
    )
    .join("");
}

// Initial product load
renderProducts();

/* =====================
    SEARCH FUNCTIONALITY
===================== */
function handleSearch(event) {
  const searchTerm = event.target.value;
  showOnlyProducts(!!searchTerm);
  renderProducts(searchTerm);
}

// Attach event listener to both search inputs
searchInputs.forEach((input) => input.addEventListener("input", handleSearch));

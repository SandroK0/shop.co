const API_URL = "https://fakestoreapi.com";
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-bar");

// Select elements
const landingSection = document.getElementById("landing-section");
const brandsCont = document.getElementById("brands");
const newArrivalsHeader = document.getElementById(
  "new-arrivals-section-header"
);
const stylesSection = document.getElementById("styles-section");
const feedbackSection = document.getElementById("feedback-section");
const footer = document.getElementById("footer");


// Feedback section
const feedbackCardsCont = document.getElementById("feedback-cards-cont");
const scrollRightBtn = document.getElementById("right-btn");
const scrollLeftBtn = document.getElementById("left-btn");

// Scroll right
scrollRightBtn.addEventListener("click", () => {
  feedbackCardsCont.scrollBy({
    left:100, // Adjust this value to control how much to scroll
    behavior: "smooth", // Smooth scrolling
  });
});

// Scroll left
scrollLeftBtn.addEventListener("click", () => {
  feedbackCardsCont.scrollBy({
    left: -100, // Adjust this value to control how much to scroll
    behavior: "smooth", // Smooth scrolling
  });
});






// Save initial attributes to sessionStorage
function saveOriginalState() {
  sessionStorage.setItem("landingSectionDisplay", landingSection.style.display);
  sessionStorage.setItem("brandsContDisplay", brandsCont.style.display);
  sessionStorage.setItem("newArrivalsHeaderText", newArrivalsHeader.innerHTML);
  sessionStorage.setItem("stylesSectionDisplay", stylesSection.style.display);
  sessionStorage.setItem(
    "feedbackSectionDisplay",
    feedbackSection.style.display
  );
  sessionStorage.setItem("footerDisplay", footer.style.display);
}

// Restore attributes from sessionStorage
function restoreOriginalState() {
  landingSection.style.display = sessionStorage.getItem(
    "landingSectionDisplay"
  );
  brandsCont.style.display = sessionStorage.getItem("brandsContDisplay");
  stylesSection.style.display = sessionStorage.getItem("stylesSectionDisplay");
  feedbackSection.style.display = sessionStorage.getItem(
    "feedbackSectionDisplay"
  );
  footer.style.display = sessionStorage.getItem("footerDisplay");
  newArrivalsHeader.innerHTML = sessionStorage.getItem("newArrivalsHeaderText");
}

// Show/hide products
function showOnlyProducts(show) {
  if (show) {
    landingSection.style.display = "none"; // Hide landing section
    brandsCont.style.display = "none"; // Hide brands container
    stylesSection.style.display = "none";
    feedbackSection.style.display = "none";
    footer.style.display = "none";
    newArrivalsHeader.innerHTML = "Products"; // Change header
  } else {
    restoreOriginalState(); // Reset to saved state
  }
}

// Save original state when the page loads
document.addEventListener("DOMContentLoaded", () => {
  saveOriginalState();
});

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
}

// Generate stars for rating
function generateStars(rating) {
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

  // Generate HTML for stars
  return `
    ${"<img height=18 src='./assets/star.svg'>".repeat(
      fullStars
    )} <!-- Full stars -->
    ${
      hasHalfStar ? "<img height=18 src='./assets/half-star.svg'>" : ""
    } <!-- Half star if applicable -->
  `;
}

// Filter products by search term
function filterProducts(products, searchTerm) {
  return products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Render up to 8 products into the DOM
async function renderProducts(searchTerm = "") {
  const products = await fetchProducts();

  if (products.length === 0) {
    productsGrid.innerHTML = `<p>No products available at the moment.</p>`;
    return;
  }

  // Limit the filtered products to 8
  const limitedProducts = products.slice(0, 8);

  // Filter the products based on the search term
  const filteredProducts = filterProducts(limitedProducts, searchTerm);

  // Create product cards and append them to the grid
  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${
        product.title
      }" class="product-image">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-rating">${generateStars(product.rating.rate)} ${
        product.rating.rate
      }/5</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      </div>
    `
    )
    .join("");
}

// Call renderProducts to display the products
renderProducts();

// Add event listener to search input for filtering
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  if (searchTerm) {
    showOnlyProducts(true);
  } else {
    showOnlyProducts(false);
  }

  console.log(searchTerm);

  renderProducts(searchTerm); // Re-render products with the filtered search term
});

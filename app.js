const API_URL = "https://fakestoreapi.com/products";
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-bar");

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
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
    ${"★".repeat(fullStars)} <!-- Full stars -->
    ${hasHalfStar ? "☆" : ""} <!-- Half star if applicable -->
    ${"☆".repeat(emptyStars)} <!-- Empty stars -->
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
  
  console.log(limitedProducts)

  // Filter the products based on the search term
  const filteredProducts = filterProducts(limitedProducts, searchTerm);


  // Create product cards and append them to the grid
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

// Call renderProducts to display the products
renderProducts();

// Add event listener to search input for filtering
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  renderProducts(searchTerm); // Re-render products with the filtered search term
});

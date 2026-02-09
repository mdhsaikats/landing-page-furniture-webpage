document
  .getElementById("mobile-menu-btn")
  .addEventListener("click", function () {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("hidden");
  });

function toggleSearch(event) {
  event.preventDefault();
  const bar = document.getElementById("search-bar");
  const header = document.querySelector("header");
  if (!bar || !header) return;

  // Position bar just below the header, accounting for scroll
  const rect = header.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  bar.style.top = `${rect.bottom + scrollY}px`;

  const isHidden = bar.classList.contains("hidden");

  if (isHidden) {
    bar.classList.remove("hidden");
    // small async to allow transition to run after display change
    requestAnimationFrame(() => {
      bar.classList.remove("opacity-0", "-translate-y-2", "pointer-events-none");
      const input = document.getElementById("search-input");
      if (input) input.focus();
    });
  } else {
    // clear search and show all products when closing
    resetProductFilter();
    bar.classList.add("opacity-0", "-translate-y-2", "pointer-events-none");
    bar.addEventListener(
      "transitionend",
      function handler(e) {
        if (e.target !== bar || e.propertyName !== "opacity") return;
        bar.classList.add("hidden");
        bar.removeEventListener("transitionend", handler);
      },
      { once: true }
    );
  }
}

function resetProductFilter() {
  const input = document.getElementById("search-input");
  if (input) input.value = "";
  filterProducts("");
}

function filterProducts(term) {
  const query = term.trim().toLowerCase();
  const cards = document.querySelectorAll("[data-product-name]");
  cards.forEach((card) => {
    const name = card.dataset.productName || "";
    if (!query || name.includes(query)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    filterProducts(e.target.value);
  });
}

// Navigate to product page when clicking a card (except on buttons)
function initProductCardNavigation() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return; // let button actions work normally
      window.location.href = "productpage.html";
    });
    // Make entire card focusable for accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !e.target.closest("button")) {
        e.preventDefault();
        window.location.href = "productpage.html";
      }
    });
  });
}

initProductCardNavigation();
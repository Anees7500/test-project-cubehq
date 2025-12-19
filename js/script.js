const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

function setNavOpen(isOpen) {
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navMenu?.classList.toggle("is-open", isOpen);
}

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  setNavOpen(!expanded);
});

document.addEventListener("click", (e) => {
  if (!navMenu || !navToggle) return;
  const target = e.target;
  const clickedInside = navMenu.contains(target) || navToggle.contains(target);
  if (!clickedInside) setNavOpen(false);
});

navMenu?.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.matches("a")) setNavOpen(false);
});

// Gallery
const galleryMainImg = document.getElementById("galleryMainImg");
const galleryDots = document.getElementById("galleryDots");
const galleryThumbs = document.getElementById("galleryThumbs");

const galleryItems = [
  { label: "Bottle 1", src: "assets/images/product-01.svg", alt: "GTG perfume bottle - view 1" },
  { label: "Bottle 2", src: "assets/images/product-02.svg", alt: "GTG perfume bottle - view 2" },
  { label: "Bottle 3", src: "assets/images/product-03.svg", alt: "GTG perfume bottle - view 3" },
  { label: "Bottle 4", src: "assets/images/product-04.svg", alt: "GTG perfume bottle - view 4" },
  { label: "Bottle 5", src: "assets/images/product-05.svg", alt: "GTG perfume bottle - view 5" },
];

let galleryIndex = 0;

function renderGalleryControls() {
  if (galleryDots) {
    galleryDots.innerHTML = "";
    galleryItems.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dot" + (i === galleryIndex ? " is-active" : "");
      btn.setAttribute("aria-label", `Go to image ${i + 1}`);
      btn.addEventListener("click", () => setGalleryIndex(i));
      galleryDots.appendChild(btn);
    });
  }

  if (galleryThumbs) {
    galleryThumbs.innerHTML = "";
    galleryItems.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb" + (i === galleryIndex ? " is-active" : "");
      btn.setAttribute("aria-label", `Select thumbnail ${i + 1}`);
      btn.textContent = item.label;
      btn.addEventListener("click", () => setGalleryIndex(i));
      galleryThumbs.appendChild(btn);
    });
  }
}

function setGalleryIndex(i) {
  galleryIndex = (i + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  if (galleryMainImg) {
    galleryMainImg.src = item.src;
    galleryMainImg.alt = item.alt;
  }
  renderGalleryControls();
}

document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => setGalleryIndex(galleryIndex - 1));
document.querySelector("[data-gallery-next]")?.addEventListener("click", () => setGalleryIndex(galleryIndex + 1));

// keyboard support for gallery
window.addEventListener("keydown", (e) => {
  if (!galleryMainImg) return;
  if (e.key === "ArrowLeft") setGalleryIndex(galleryIndex - 1);
  if (e.key === "ArrowRight") setGalleryIndex(galleryIndex + 1);
});

setGalleryIndex(0);

// Option logic: 2 radio groups -> 9 variations
const optionsForm = document.getElementById("optionsForm");
const addToCart = document.getElementById("addToCart");
const variantText = document.getElementById("variantText");

function getSelectedValue(name) {
  const el = optionsForm?.querySelector(`input[name=\"${name}\"]:checked`);
  return el ? el.value : "";
}

function updateAddToCartLink() {
  if (!addToCart) return;

  const fragrance = getSelectedValue("fragrance");
  const purchase = getSelectedValue("purchase");

  const base = addToCart.getAttribute("data-base-url") || "https://example.com/cart";
  const url = new URL(base);
  url.searchParams.set("fragrance", fragrance);
  url.searchParams.set("purchase", purchase);

  addToCart.href = url.toString();

  if (variantText) {
    variantText.textContent = `Selected: ${fragrance || "-"} + ${purchase || "-"}`;
  }

  // Expand panels based on purchase type
  document.querySelectorAll(".expand[data-expand]").forEach((panel) => {
    const key = panel.getAttribute("data-expand");
    panel.classList.toggle("is-open", key === purchase);
  });
}

optionsForm?.addEventListener("change", updateAddToCartLink);
updateAddToCartLink();

// Accordion (collection)
const accordion = document.getElementById("accordion");
if (accordion) {
  const items = Array.from(accordion.querySelectorAll(".accordion__item"));
  const panels = Array.from(accordion.querySelectorAll(".accordion__panel"));

  function setAccordionOpen(index) {
    items.forEach((btn, i) => btn.setAttribute("aria-expanded", String(i === index)));
    panels.forEach((p, i) => p.classList.toggle("is-open", i === index));
  }

  items.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      setAccordionOpen(expanded ? -1 : index);
    });
  });

  // Ensure exactly first is open by default
  setAccordionOpen(0);
}

// Count up stats when section is visible
function animateCount(el, target) {
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const value = Math.floor(p * target);
    el.textContent = String(value) + "%";
    if (p < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statsBand = document.getElementById("statsBand");
if (statsBand) {
  const nums = Array.from(statsBand.querySelectorAll("[data-count]"));
  const started = new WeakSet();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        nums.forEach((el) => {
          if (started.has(el)) return;
          started.add(el);
          const n = Number(el.getAttribute("data-count") || "0");
          animateCount(el, n);
        });

        io.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  io.observe(statsBand);
}

// footer year + newsletter demo
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

document.getElementById("newsletter")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("newsEmail");
  if (input && input.value) {
    input.value = "";
  }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Gallery Carousel Functionality
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
const totalImages = thumbnails.length;

// Image sources array
const imageSources = [
    'assets/images/product-01.jpg',
    'assets/images/product-02.jpg',
    'assets/images/product-03.jpg',
    'assets/images/product-04.jpg',
    'assets/images/product-01.jpg',
    'assets/images/product-02.jpg',
    'assets/images/product-03.jpg',
    'assets/images/product-04.jpg'
];

// Update gallery display
function updateGallery(index) {
    // Ensure index is within bounds
    if (index < 0) index = totalImages - 1;
    if (index >= totalImages) index = 0;
    
    currentIndex = index;
    
    // Update main image with fade effect
    if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = imageSources[index];
            mainImage.style.opacity = '1';
        }, 150);
    }
    
    // Update thumbnails
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    // Update dots (only 4 dots for visual, cycle through images)
    const dotIndex = index % 4;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndex);
    });
}

// Previous button
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        updateGallery(currentIndex - 1);
    });
}

// Next button
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        updateGallery(currentIndex + 1);
    });
}

// Thumbnail clicks
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        updateGallery(index);
    });
});

// Dot clicks
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateGallery(index);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        updateGallery(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
        updateGallery(currentIndex + 1);
    }
});

// Initialize
updateGallery(0);

// Color Swatches
const swatches = document.querySelectorAll('.swatch');

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
    });
});

// Subscription Toggle
const subscriptionRadios = document.querySelectorAll('input[name="subscription"]');
const subscriptionOptions = document.querySelectorAll('.subscription-option');

subscriptionRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        // Remove active class from all options
        subscriptionOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to parent of checked radio
        const parentOption = radio.closest('.subscription-option');
        if (parentOption) {
            parentOption.classList.add('active');
        }
        
        // Update Add to Cart link
        updateAddToCartLink();
    });
});

// Dynamic Add to Cart Link
function updateAddToCartLink() {
    const addToCartBtn = document.querySelector('.btn-full');
    if (!addToCartBtn) return;
    
    // Get selected subscription type
    const subscriptionType = document.querySelector('input[name="subscription"]:checked');
    const subscription = subscriptionType ? subscriptionType.id : 'single';
    
    let cartUrl = 'https://example.com/cart?';
    
    if (subscription === 'single') {
        // Single Subscription - get fragrance selection
        const fragrance = document.querySelector('input[name="fragrance"]:checked');
        const fragranceValue = fragrance ? fragrance.value : 'original';
        
        cartUrl += `type=single&fragrance=${fragranceValue}`;
        
    } else if (subscription === 'double') {
        // Double Subscription - get both fragrance selections
        const fragrance1 = document.querySelector('input[name="fragrance1"]:checked');
        const fragrance2 = document.querySelector('input[name="fragrance2"]:checked');
        
        const frag1Value = fragrance1 ? fragrance1.value : 'original';
        const frag2Value = fragrance2 ? fragrance2.value : 'original';
        
        cartUrl += `type=double&fragrance1=${frag1Value}&fragrance2=${frag2Value}`;
    }
    
    // Update button to be a link
    addToCartBtn.onclick = function() {
        window.location.href = cartUrl;
        console.log('Add to Cart URL:', cartUrl);
        return false;
    };
    
    // Log current selection for debugging
    console.log('Current Add to Cart URL:', cartUrl);
}

// Fragrance Selection Handlers
const fragranceRadios = document.querySelectorAll('input[name="fragrance"], input[name="fragrance1"], input[name="fragrance2"]');

fragranceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        updateAddToCartLink();
    });
});

// Initialize Add to Cart link on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAddToCartLink();
});

// Accordion
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const icon = header.querySelector('.accordion-icon');
    
    header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items and reset icons
        accordionItems.forEach(i => {
            i.classList.remove('active');
            const otherIcon = i.querySelector('.accordion-icon');
            if (otherIcon) otherIcon.textContent = '+';
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            if (icon) icon.textContent = '−';
        }
    });
});

// Stats Counter Animation
function animateCounter(element, target) {
    const duration = 1500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElements = entry.target.querySelectorAll('.stat-percentage');
            statElements.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBand = document.querySelector('.stats-band');
if (statsBand) {
    statsObserver.observe(statsBand);
}

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        
        if (input && input.value) {
            alert('Thank you for subscribing!');
            input.value = '';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav) {
                mainNav.classList.remove('active');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

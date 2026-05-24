/* ================================================
   SASMIKA MOBILES — Main App JavaScript
   Navigation, Search, Toast, Preloader, etc.
   ================================================ */

// ---------- Preloader ----------
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    }
    updateCartCount();
    updateFavCount();
    initScrollAnimations();
});

// ---------- Navbar Scroll ----------
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (navbar) {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    lastScroll = currentScroll;
});

// ---------- Mobile Menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ---------- Search Modal ----------
const searchBtn = document.getElementById('nav-search-btn');
const searchModal = document.getElementById('search-modal');
const searchCloseBtn = document.getElementById('search-close-btn');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        setTimeout(() => searchInput && searchInput.focus(), 300);
    });

    searchCloseBtn && searchCloseBtn.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });
}

if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.innerHTML = '<p style="color: var(--white-40); text-align: center; padding: 1rem;">Type at least 2 characters...</p>';
            return;
        }

        const results = searchProducts(query);
        const serviceResults = STORE_DATA.services.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.type.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0 && serviceResults.length === 0) {
            searchResults.innerHTML = '<p style="color: var(--white-40); text-align: center; padding: 1rem;">No results found</p>';
            return;
        }

        let html = '';
        results.slice(0, 5).forEach(product => {
            html += `
                <a href="pages/product.html?id=${product.id}" class="search-result-item">
                    <span style="font-size: 1.5rem;">${STORE_DATA.categories.find(c => c.id === product.category)?.icon || '📦'}</span>
                    <div>
                        <div style="font-weight: 600; color: var(--white);">${product.name}</div>
                        <div style="font-size: 0.8rem; color: var(--white-40);">${product.brand} · ₹${product.offerPrice || product.price}</div>
                    </div>
                </a>
            `;
        });

        serviceResults.forEach(service => {
            html += `
                <a href="pages/services.html#${service.type}" class="search-result-item">
                    <span style="font-size: 1.5rem;">${service.icon}</span>
                    <div>
                        <div style="font-weight: 600; color: var(--white);">${service.name}</div>
                        <div style="font-size: 0.8rem; color: var(--white-40);">Service · From ₹${service.price}</div>
                    </div>
                </a>
            `;
        });

        searchResults.innerHTML = html;
    });
}

// ---------- Toast Notifications ----------
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ---------- Scroll Animations ----------
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-header, .product-card, .category-card, .service-card, .why-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Add CSS for scroll animations dynamically
const scrollAnimStyle = document.createElement('style');
scrollAnimStyle.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.animate-visible {
        opacity: 1;
        transform: translateY(0);
    }
    .animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
    .animate-on-scroll:nth-child(3) { transition-delay: 0.2s; }
    .animate-on-scroll:nth-child(4) { transition-delay: 0.3s; }
    .animate-on-scroll:nth-child(5) { transition-delay: 0.4s; }
    .animate-on-scroll:nth-child(6) { transition-delay: 0.5s; }
`;
document.head.appendChild(scrollAnimStyle);

// ---------- Product Card Generator ----------
function createProductCard(product) {
    const category = STORE_DATA.categories.find(c => c.id === product.category);
    const fav = isFavorite(product.id);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-card-image">
                ${product.image
                    ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
                    : `<div class="placeholder-icon">${category?.icon || '📦'}</div>`
                }
                ${product.offerPercent
                    ? `<span class="product-card-badge">${product.offerPercent}% OFF</span>`
                    : ''
                }
                <div class="product-card-actions">
                    <button class="product-action-btn ${fav ? 'active' : ''}" onclick="handleFavorite('${product.id}', this)" aria-label="Toggle favorite">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                    <button class="product-action-btn" onclick="addToCart('${product.id}')" aria-label="Add to cart">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </button>
                </div>
            </div>
            <a href="pages/product.html?id=${product.id}" class="product-card-body">
                <div class="product-card-category">${category?.name || product.category}</div>
                <h3 class="product-card-name">${product.name}</h3>
                <div class="product-card-brand">${product.brand} · ${product.type}</div>
                <div class="product-card-footer">
                    <div class="product-card-price">
                        <span class="price-current">₹${(product.offerPrice || product.price).toLocaleString()}</span>
                        ${product.offerPrice ? `<span class="price-original">₹${product.price.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-card-rating">
                        <span>${stars}</span>
                        <span style="color: var(--white-40)">${product.rating}</span>
                    </div>
                </div>
            </a>
        </div>
    `;
}

function handleFavorite(productId, btn) {
    const isNowFav = toggleFavorite(productId);
    const svg = btn.querySelector('svg path');
    if (isNowFav) {
        btn.classList.add('active');
        svg.setAttribute('fill', 'currentColor');
    } else {
        btn.classList.remove('active');
        svg.setAttribute('fill', 'none');
    }
}

// ---------- Utility: Get URL Params ----------
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ---------- Page path helper for subpages ----------
function getRootPath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return './';
}

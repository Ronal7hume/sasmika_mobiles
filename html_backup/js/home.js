/* ================================================
   HOME PAGE — JavaScript
   Featured products rendering
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
});

function renderFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid) return;

    const featured = getFeaturedProducts();
    grid.innerHTML = featured.map(product => createProductCard(product)).join('');

    // Re-init scroll animations for dynamically added cards
    setTimeout(() => initScrollAnimations(), 100);
}

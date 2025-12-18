// Configuration
const API_BASE_URL = 'https://brightnal-backend.vercel.app';

// State management
let items = [];
const navigationStack = [];

// Utility Functions
function getElement(selector) {
    if (typeof selector === 'string') {
        return document.querySelector(selector);
    }
    return selector;
}

// API Functions
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.products) {
            // Transform backend products to match frontend format
            items = data.products.map(product => ({
                id: product.id,
                type: 'img',
                src: product.image_url,
                color: generatePlaceholderColor(), // Generate a color for skeleton
                h: Math.floor(Math.random() * 250) + 200, // Random height between 200-450
                // Additional product data
                name: product.product_name,
                price: product.price,
                category: product.category,
                brand: product.brand,
                stock: product.stock,
                sku: product.sku,
                productClass: product.product_class,
                sizes: product.sizes,
                colors: product.colors,
                description: product.description,
                cloudinaryId: product.cloudinary_id
            }));
            
            return items;
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        // Return empty array on error - you might want to show an error message to users
        return [];
    }
}

async function fetchProductById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.product) {
            return {
                id: data.product.id,
                type: 'img',
                src: data.product.image_url,
                color: generatePlaceholderColor(),
                h: Math.floor(Math.random() * 250) + 200,
                name: data.product.product_name,
                price: data.product.price,
                category: data.product.category,
                brand: data.product.brand,
                stock: data.product.stock,
                sku: data.product.sku,
                productClass: data.product.product_class,
                sizes: data.product.sizes,
                colors: data.product.colors,
                description: data.product.description,
                cloudinaryId: data.product.cloudinary_id
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return null;
    }
}

// Helper function to generate placeholder colors
function generatePlaceholderColor() {
    const colors = [
        '#d7c2b9', '#8c6b4a', '#f2d5b1', '#b99268', 
        '#e6d7ce', '#3b3f33', '#d1c4b2', '#f0e1d6', 
        '#c2a27b'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Format price for display
function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(price);
}

// Skeleton UI Functions
function createSkeletonCard(isSmall = false) {
    const card = document.createElement('div');
    card.className = isSmall ? 'card skeleton small-skeleton' : 'card skeleton';
    
    const randomHeight = isSmall ? 
        Math.floor(Math.random() * 150) + 100 : 
        Math.floor(Math.random() * 350) + 150;
    card.style.setProperty('--sk-height', randomHeight + 'px');
    
    return card;
}

// Card Creation Functions
function createImageCard(item, template, overlaySelector, isRecommendation = false) {
    const tpl = getElement(template);
    if (!tpl) {
        console.error('Template not found:', template);
        return null;
    }
    
    const card = tpl.content.cloneNode(true).querySelector('.card');
    const wrap = card.querySelector('.media-wrap');
    const img = card.querySelector('img.media');
    
    // Add product ID to card for reference
    card.dataset.productId = item.id;
    
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-tile';
    colorDiv.style.background = item.color;
    colorDiv.style.height = (item.h || 260) + 'px';
    colorDiv.style.position = 'absolute';
    wrap.insertBefore(colorDiv, img);
    
    img.dataset.src = item.src;
    img.alt = item.name || 'Product image';
    
    img.onload = () => {
        colorDiv.style.display = 'none';
    };
    
    img.onerror = () => {
        img.style.display = 'none';
        card.classList.add('loaded');
    };
    
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        showOverlay(item, overlaySelector, isRecommendation);
    });
    
    return card;
}

// Recommendations Functions
function getRecommendations(currentItem, count = 6) {
    const available = items.filter(item => item.id !== currentItem.id);
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadRecommendations(overlay, currentItem) {
    const skeletonContainer = overlay.querySelector('.recommendations-skeleton');
    const masonryContainer = overlay.querySelector('.recommendations-masonry');
    
    if (!skeletonContainer || !masonryContainer) return;
    
    skeletonContainer.style.display = 'block';
    skeletonContainer.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        skeletonContainer.appendChild(createSkeletonCard(true));
    }
    
    setTimeout(() => {
        skeletonContainer.style.display = 'none';
        
        masonryContainer.style.display = 'block';
        masonryContainer.innerHTML = '';
        
        const recommendations = getRecommendations(currentItem, 6);
        
        recommendations.forEach((item, index) => {
            const card = createImageCard(item, '#recommendationCardTpl', '.overlay-div', true);
            if (card) {
                masonryContainer.appendChild(card);
                fadeInCard(card, index * 50);
            }
        });
        
        initLazyLoading(masonryContainer);
    }, 800);
}

// Overlay Functions
function showOverlay(item, overlaySelector, isFromRecommendation = false) {
    const overlay = getElement(overlaySelector || '.overlay-div');
    
    let template = document.querySelector('.overlay-template');
    
    if (!template && overlay) {
        template = overlay.querySelector('.overlay-template');
    }
    
    if (!overlay) {
        console.error('Overlay not found:', overlaySelector);
        return;
    }
    
    if (!template) {
        console.error('Template .overlay-template not found in document or overlay');
        return;
    }
    
    if (isFromRecommendation && overlay.classList.contains('active')) {
        const currentState = {
            item: getCurrentItemFromOverlay(overlay),
            scrollPosition: overlay.scrollTop,
            overlayHTML: overlay.innerHTML
        };
        navigationStack.push(currentState);
    }
    
    overlay.classList.add('active');
    overlay.scrollTop = 0;
    
    const existingContent = overlay.querySelector('.back-btn');
    if (existingContent && existingContent.parentElement === overlay) {
        while (overlay.firstChild) {
            overlay.removeChild(overlay.firstChild);
        }
    }
    
    const clone = template.content.cloneNode(true);
    
    // Set main image
    const mainImg = clone.querySelector(".image-wrapper img");
    if (mainImg) {
        mainImg.src = item.src;
        mainImg.dataset.itemSrc = item.src;
        mainImg.dataset.productId = item.id;
        mainImg.alt = item.name || 'Product image';
    }
    
    // Update price
    const priceElement = clone.querySelector('.premiumBtn');
    if (priceElement && item.price) {
        priceElement.textContent = formatPrice(item.price);
    }
    
    // You can add more product details here if you want to show them in the overlay
    // For example, add product name, description, etc.
    
    overlay.appendChild(clone);
    
    const backBtn = overlay.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleBackNavigation(overlay);
        });
    }
    
    const addToCartBtn = overlay.querySelector('.diff1');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(item);
        });
    }
    
    // Also add click handler to cart button in overlay
    const cartBtn = overlay.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(item);
        });
    }
    
    setTimeout(() => {
        loadRecommendations(overlay, item);
    }, 100);
}

function getCurrentItemFromOverlay(overlay) {
    const img = overlay.querySelector('.image-wrapper img');
    if (img && img.dataset.productId) {
        return items.find(item => item.id === parseInt(img.dataset.productId));
    }
    return null;
}

function handleBackNavigation(overlay) {
    if (navigationStack.length > 0) {
        const previousState = navigationStack.pop();
        if (previousState && previousState.item && previousState.overlayHTML) {
            overlay.innerHTML = previousState.overlayHTML;
            
            const backBtn = overlay.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleBackNavigation(overlay);
                });
            }
            
            const addToCartBtn = overlay.querySelector('.diff1');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(previousState.item);
                });
            }
            
            const cartBtn = overlay.querySelector('.cart-btn');
            if (cartBtn) {
                cartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(previousState.item);
                });
            }
            
            const recommendationCards = overlay.querySelectorAll('.recommendation-card');
            recommendationCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const img = card.querySelector('img.media');
                    if (img && img.src) {
                        const clickedItem = items.find(item => img.src.includes(item.cloudinaryId || item.id));
                        if (clickedItem) {
                            showOverlay(clickedItem, '.overlay-div', true);
                        }
                    }
                });
            });
            
            requestAnimationFrame(() => {
                overlay.scrollTop = previousState.scrollPosition || 0;
            });
        } else {
            overlay.classList.remove('active');
            navigationStack.length = 0;
        }
    } else {
        overlay.classList.remove('active');
        navigationStack.length = 0;
    }
}

// Cart Functions
function addToCart(item) {
    console.log('Adding to cart:', item);
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
        // Increment quantity if item exists
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        // Add new item with quantity 1
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.src,
            quantity: 1,
            sku: item.sku
        });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in UI
    updateCartCount();
    
    // Show success feedback (you can customize this)
    showCartFeedback('Item added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update cart badge if it exists
    const cartBadges = document.querySelectorAll('.cart-btn');
    cartBadges.forEach(badge => {
        let countEl = badge.querySelector('.cart-count');
        if (!countEl && totalItems > 0) {
            countEl = document.createElement('span');
            countEl.className = 'cart-count';
            badge.style.position = 'relative';
            badge.appendChild(countEl);
        }
        if (countEl) {
            countEl.textContent = totalItems;
            countEl.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

function showCartFeedback(message) {
    // Remove any existing feedback
    const existing = document.querySelector('.cart-feedback');
    if (existing) existing.remove();
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Animation Functions
function fadeInCard(card, delay) {
    setTimeout(() => card.classList.add('loaded'), delay);
}

// Lazy Loading
function initLazyLoading(container) {
    const containerEl = getElement(container);
    const lazyImgs = containerEl ? 
        containerEl.querySelectorAll('img[data-src]') : 
        document.querySelectorAll('img[data-src]');
    
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                io.unobserve(img);
            }
        });
    }, { rootMargin: '300px 0px' });
    
    lazyImgs.forEach(img => io.observe(img));
}

// Navigation Functions
function initNavigation(navSelector) {
    const navItems = document.querySelectorAll(navSelector || '.notchNavBar .notAligned');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => {
                const span = i.querySelector('span');
                const svg = i.querySelector('svg');
                if (span) span.classList.remove('active');
                if (svg) svg.setAttribute('stroke', '#BDBEBD');
            });
            
            const span = item.querySelector('span');
            const svg = item.querySelector('svg');
            if (span) span.classList.add('active');
            if (svg) svg.setAttribute('stroke', '#000');
        });
    });
}

function addNotificationIndicator(selector) {
    const element = getElement(selector || '.notAligned.flex-col:last-child');
    if (element) {
        element.classList.add('has-indicator');
    }
}

// Main Masonry Initialization
async function initMasonry(config = {}) {
    const {
        masonrySelector = '#masonry',
        skeletonSelector = '#skeletonMasonry',
        mainContentSelector = '#foryou',
        templateSelector = '#cardTpl',
        overlaySelector = '.overlay-div',
        skeletonCount = 8,
        skeletonDelay = 1500,
        fadeDelay = 100
    } = config;
    
    const masonry = getElement(masonrySelector);
    const skeletonMasonry = getElement(skeletonSelector);
    const mainContent = getElement(mainContentSelector);
    
    if (!masonry) {
        console.error('Masonry container not found:', masonrySelector);
        return;
    }
    
    // Show skeleton loading
    if (skeletonMasonry) {
        for (let i = 0; i < skeletonCount; i++) {
            skeletonMasonry.appendChild(createSkeletonCard());
        }
    }
    
    // Fetch products from API
    const products = await fetchProducts();
    
    if (products.length === 0) {
        // Show error message if no products loaded
        if (skeletonMasonry) {
            skeletonMasonry.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Unable to load products. Please try again later.';
        errorMsg.style.cssText = `
            text-align: center;
            padding: 40px 20px;
            color: #666;
            font-size: 16px;
        `;
        masonry.appendChild(errorMsg);
        return;
    }
    
    // Hide skeleton and show products
    setTimeout(() => {
        if (skeletonMasonry) {
            skeletonMasonry.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        products.forEach((item, index) => {
            const card = createImageCard(item, templateSelector, overlaySelector, false);
            if (card) {
                masonry.appendChild(card);
                fadeInCard(card, index * fadeDelay);
            }
        });
        
        initLazyLoading(masonry);
    }, skeletonDelay);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const hasDefaultMasonry = document.querySelector('#masonry, .masonry');
    
    if (hasDefaultMasonry) {
        initMasonry();
        initNavigation();
        addNotificationIndicator();
        updateCartCount(); // Initialize cart count on page load
    }
    
    // Add styles for cart feedback animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});

// Export functions for external use
window.MasonrySystem = {
    init: initMasonry,
    createCard: createImageCard,
    showOverlay: showOverlay,
    initNav: initNavigation,
    addIndicator: addNotificationIndicator,
    lazyLoad: initLazyLoading,
    fetchProducts: fetchProducts,
    fetchProductById: fetchProductById,
    addToCart: addToCart,
    updateCartCount: updateCartCount
};

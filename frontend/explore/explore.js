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
            items = data.products.map(product => ({
                id: product.id,
                type: 'img',
                src: product.image_url,
                color: generatePlaceholderColor(),
                h: Math.floor(Math.random() * 250) + 200,
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
        return [];
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
    
    if (!overlay) {
        console.error('Overlay not found:', overlaySelector);
        return;
    }
    
    const template = document.querySelector('.overlay-template');
    if (!template) {
        console.error('Template .overlay-template not found');
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
    overlay.innerHTML = '';
    
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
    
    // Add product name if you want (add to HTML template first)
    const nameElement = clone.querySelector('.product-name');
    if (nameElement && item.name) {
        nameElement.textContent = item.name;
    }
    
    overlay.appendChild(clone);
    
    // Back button handler
    const backBtn = overlay.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleBackNavigation(overlay);
        });
    }
    
    // Add to cart button handler - using the "Add to cart" text button
    const addToCartBtn = overlay.querySelector('.add_to_cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(item);
        });
    }
    
    // Cart icon button handler in overlay header
    const cartIconBtn = overlay.querySelector('.cart-btn');
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/frontend/checkout/checkout.html';
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
            
            // Re-attach all event listeners
            const backBtn = overlay.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleBackNavigation(overlay);
                });
            }
            
            const addToCartBtn = overlay.querySelector('.add_to_cart');
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
                    window.location.href = '/frontend/checkout/checkout.html';
                });
            }
            
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
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.src,
            quantity: 1,
            sku: item.sku
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartFeedback('Item added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const cartButtons = document.querySelectorAll('.cart-btn, .cartBtn_checkout');
    cartButtons.forEach(btn => {
        let countEl = btn.querySelector('.cart-count');
        if (!countEl && totalItems > 0) {
            countEl = document.createElement('span');
            countEl.className = 'cart-count';
            btn.style.position = 'relative';
            btn.appendChild(countEl);
        }
        if (countEl) {
            countEl.textContent = totalItems;
            countEl.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

function showCartFeedback(message) {
    const existing = document.querySelector('.cart-feedback');
    if (existing) existing.remove();
    
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(feedback);
    
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
    
    if (skeletonMasonry) {
        for (let i = 0; i < skeletonCount; i++) {
            skeletonMasonry.appendChild(createSkeletonCard());
        }
    }
    
    const products = await fetchProducts();
    
    if (products.length === 0) {
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
        updateCartCount();
        
        // Add click handler for floating checkout cart button
        const checkoutCartBtn = document.querySelector('.cartBtn_checkout');
        if (checkoutCartBtn) {
            checkoutCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = '/frontend/checkout/checkout.html';
            });
        }
    }
    
    // Add styles
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

// Export functions
window.MasonrySystem = {
    init: initMasonry,
    createCard: createImageCard,
    showOverlay: showOverlay,
    initNav: initNavigation,
    addIndicator: addNotificationIndicator,
    lazyLoad: initLazyLoading,
    fetchProducts: fetchProducts,
    addToCart: addToCart,
    updateCartCount: updateCartCount
};

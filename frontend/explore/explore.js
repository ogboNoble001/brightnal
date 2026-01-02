const items = [];
const navigationStack = [];
const SERVER_URL = "https://brightnal.onrender.com";

// Add a flag to track loading state
let isDataLoaded = false;

async function loadProducts() {
    try {
        const response = await fetch(`${SERVER_URL}/api/products`);
        const data = await response.json();
        
        if (!data.success) return;
        
        // 🔑 Bridge server → UI
        items.length = 0; // clear existing
        
        data.products.forEach(p => {
            items.push({
                type: 'img',
                src: p.image_url,
                color: p.colors || '#e6d7ce',
                h: 300
            });
        });
        
        // Mark data as loaded
        isDataLoaded = true;
        
        // Re-init masonry AFTER data exists
        initMasonry({ items });
        
    } catch (error) {
        console.error(error);
        isDataLoaded = true; // Still mark as loaded to hide loader
    }
}

// Start loading immediately
loadProducts();

function getElement(selector) {
    if (typeof selector === 'string') {
        return document.querySelector(selector);
    }
    return selector;
}function createLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container';
    loaderContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 400px;
        gap: 20px;
        margin-top:5em;
        box-sizing: border-box;
    `;
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.cssText = `
        width: 30px;
        height: 30px;
        margin-top:5em;
        border: 4px solid #f3f3f3;
        border-top: 2px solid #000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        flex-shrink: 0;
    `;
    
    const loaderText = document.createElement('p');
    loaderText.className = 'loader-text';
    loaderText.textContent = 'loading...';
    loaderText.style.cssText = `
        font-size: 16px;
        color: #666;
        margin: 0;
        text-align: center;
        white-space: nowrap;
        flex-shrink: 0;
    `;
    
    loaderContainer.appendChild(spinner);
    loaderContainer.appendChild(loaderText);
    
    // Add keyframe animation if not already added
    if (!document.getElementById('spinner-animation')) {
        const style = document.createElement('style');
        style.id = 'spinner-animation';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    return loaderContainer;
}
function createImageCard(item, template, overlaySelector, isRecommendation = false) {
    const tpl = getElement(template);
    if (!tpl) {
        console.error('Template not found:', template);
        return null;
    }
    
    const card = tpl.content.cloneNode(true).querySelector('.card');
    const wrap = card.querySelector('.media-wrap');
    const img = card.querySelector('img.media');
    
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-tile';
    colorDiv.style.background = item.color;
    colorDiv.style.height = (item.h || 260) + 'px';
    colorDiv.style.position = 'absolute';
    wrap.insertBefore(colorDiv, img);
    
    img.dataset.src = item.src;
    
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

function getRecommendations(currentItem, count = 6) {
    const available = items.filter(item => item.src !== currentItem.src);
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadRecommendations(overlay, currentItem) {
    const skeletonContainer = overlay.querySelector('.recommendations-skeleton');
    const masonryContainer = overlay.querySelector('.recommendations-masonry');
    
    if (!skeletonContainer || !masonryContainer) return;
    
    skeletonContainer.style.display = 'block';
    skeletonContainer.innerHTML = '';
    
    // Add loader for recommendations
    const loader = createLoader();
    loader.style.minHeight = '200px';
    skeletonContainer.appendChild(loader);
    
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
    
    const mainImg = clone.querySelector("img");
    if (mainImg) {
        mainImg.src = item.src;
        mainImg.dataset.itemSrc = item.src;
    }
    
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
            console.log('Added to cart:', item);
        });
    }
    
    setTimeout(() => {
        loadRecommendations(overlay, item);
    }, 100);
}

function getCurrentItemFromOverlay(overlay) {
    const img = overlay.querySelector('.image-wrapper img');
    if (img && img.dataset.itemSrc) {
        return items.find(item => item.src === img.dataset.itemSrc);
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
                    console.log('Added to cart:', previousState.item);
                });
            }
            
            const recommendationCards = overlay.querySelectorAll('.recommendation-card');
            recommendationCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const img = card.querySelector('img.media');
                    if (img && img.src) {
                        const clickedItem = items.find(item => img.src.includes(item.src.split('/').pop()));
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

function fadeInCard(card, delay) {
    setTimeout(() => card.classList.add('loaded'), delay);
}

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

function initMasonry(config = {}) {
    const {
        masonrySelector = '#masonry',
        skeletonSelector = '#skeletonMasonry',
        mainContentSelector = '#foryou',
        templateSelector = '#cardTpl',
        overlaySelector = '.overlay-div',
        items: itemsData = items,
        fadeDelay = 100
    } = config;
    
    const masonry = getElement(masonrySelector);
    const skeletonMasonry = getElement(skeletonSelector);
    const mainContent = getElement(mainContentSelector);
    
    if (!masonry) {
        console.error('Masonry container not found:', masonrySelector);
        return;
    }
    
    // Only show loader if data hasn't loaded yet
    if (!isDataLoaded && skeletonMasonry) {
        skeletonMasonry.innerHTML = '';
        skeletonMasonry.appendChild(createLoader());
        skeletonMasonry.style.display = 'block';
    }
    
    // Wait for data to be loaded before showing real content
    if (!isDataLoaded) {
        return;
    }
    
    // Data is loaded, hide loader and show real content
    if (skeletonMasonry) {
        skeletonMasonry.style.display = 'none';
    }
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // Clear masonry and add real cards
    masonry.innerHTML = '';
    itemsData.forEach((item, index) => {
        const card = createImageCard(item, templateSelector, overlaySelector, false);
        if (card) {
            masonry.appendChild(card);
            fadeInCard(card, index * fadeDelay);
        }
    });
    
    initLazyLoading(masonry);
}

document.addEventListener('DOMContentLoaded', () => {
    const hasDefaultMasonry = document.querySelector('#masonry, .masonry');
    
    if (hasDefaultMasonry) {
        // Show loader immediately
        initMasonry({ items: [] });
        initNavigation();
        addNotificationIndicator();
    }
});

window.MasonrySystem = {
    init: initMasonry,
    createCard: createImageCard,
    showOverlay: showOverlay,
    initNav: initNavigation,
    addIndicator: addNotificationIndicator,
    lazyLoad: initLazyLoading
};
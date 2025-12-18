const items = [
    { type: 'img', src: '/frontend/res/04563643a2aa4c8997006ccb1b82e3b0.jpg', color: '#d7c2b9', h: 320 },
    { type: 'img', src: '/frontend/res/05a7f184a8924a7eb00393d653b8c08f.jpg', color: '#8c6b4a', h: 400 },
    { type: 'img', src: '/frontend/res/a307c6b8e07b4888842ad1571069f95c.jpg', color: '#f2d5b1', h: 360 },
    { type: 'img', src: '/frontend/res/2e11750afa3341cf9a59fb05d3de7b2c.jpg', color: '#b99268', h: 300 },
    { type: 'img', src: '/frontend/res/4ea7a7b89f6041a6a0a7858f6ce7c642.jpg', color: '#e6d7ce', h: 380 },
    { type: 'img', src: '/frontend/res/692ac7b5ee67478d8e9a52045195cc46.jpg', color: '#3b3f33', h: 340 },
    { type: 'img', src: '/frontend/res/ffdf19ab8c4c4e2a95c75643c0984530.jpg', color: '#d1c4b2', h: 400 },
    { type: 'img', src: '/frontend/res/ac29955b829e4066941e64876de64dbb.jpg', color: '#f0e1d6', h: 360 },
    { type: 'img', src: '/frontend/res/db440dbe8d884002a6b494fe6a5d4603.jpg', color: '#c2a27b', h: 320 },
    { type: 'img', src: '/frontend/res/f3eb32d50e71427aaef1194c00e656eb.jpg', color: '#8c6b4a', h: 400 },
    { type: 'img', src: '/frontend/res/ccaba25ea2b349f09f82a40b7bce17c5.jpg', color: '#f2d5b1', h: 360 },
    { type: 'img', src: '/frontend/res/7ae120a7d27f4f5aa4d7d214d6a1c664.jpg', color: '#b99268', h: 300 },
    { type: 'img', src: '/frontend/res/8ddea52712e7483784cb6071f01afcca.jpg', color: '#e6d7ce', h: 380 },
    { type: 'img', src: '/frontend/res/57ec281b5850418c838edf053f8226ce.jpg', color: '#d7c2b9', h: 340 },
    { type: 'img', src: '/frontend/res/fc9d81fada2b43fc86188cbfadf1f58e.jpg', color: '#8c6b4a', h: 320 },
    { type: 'img', src: '/frontend/res/daebc7a49e1a435eaf87e1d4fa71e21a.jpg', color: '#f2d5b1', h: 400 },
    { type: 'img', src: '/frontend/res/cbacc77b0a1343c3b0aa3a7a6eaa6163.jpg', color: '#b99268', h: 360 },
    { type: 'img', src: '/frontend/res/2a01626af3fa4e788eddfba0fb65f378.jpg', color: '#e6d7ce', h: 300 }
];

const navigationStack = [];

const SERVER_URL = "https://brightnal.onrender.com";

async function loadProducts() {
    productList.innerHTML = "Loading products...";
    
    try {
        const response = await fetch(`${SERVER_URL}/api/products`);
        const data = await response.json();
        
        if (!data.success) {
            productList.textContent = "Failed to load products";
            return;
        }
        
        alert(`Products loaded successfully (${data.products.length})`);
        renderProducts(data.products);
        
    } catch (error) {
        console.error(error);
        productList.textContent = "Error loading products";
    }
}

function getElement(selector) {
    if (typeof selector === 'string') {
        return document.querySelector(selector);
    }
    return selector;
}

function createSkeletonCard(isSmall = false) {
    const card = document.createElement('div');
    card.className = isSmall ? 'card skeleton small-skeleton' : 'card skeleton';
    
    const randomHeight = isSmall ? 
        Math.floor(Math.random() * 150) + 100 : 
        Math.floor(Math.random() * 350) + 150;
    card.style.setProperty('--sk-height', randomHeight + 'px');
    
    return card;
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
        skeletonCount = 6,
        skeletonDelay = 1000,
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
    
    setTimeout(() => {
        if (skeletonMasonry) {
            skeletonMasonry.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        itemsData.forEach((item, index) => {
            const card = createImageCard(item, templateSelector, overlaySelector, false);
            if (card) {
                masonry.appendChild(card);
                fadeInCard(card, index * fadeDelay);
            }
        });
        
        initLazyLoading(masonry);
    }, skeletonDelay);
}

document.addEventListener('DOMContentLoaded', () => {
    const hasDefaultMasonry = document.querySelector('#masonry, .masonry');
    
    if (hasDefaultMasonry) {
        initMasonry();
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
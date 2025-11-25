const items = [
    { type: 'img', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400' },
    { type: 'color', color: '#3b3f33', h: 320 },
    { type: 'color', color: '#b99268', h: 420 },
    { type: 'img', src: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400' },
    { type: 'color', color: '#d7c2b9', h: 300 },
    { type: 'img', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400' },
    { type: 'color', color: '#8c6b4a', h: 360 },
    { type: 'img', src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400' },
    { type: 'color', color: '#f2d5b1', h: 300 },
    { type: 'img', src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
    { type: 'color', color: '#e6d7ce', h: 380 }
];

const masonry = document.getElementById('masonry');
const tpl = document.getElementById('cardTpl');
const mainContent = document.getElementById('foryou');
const skeletonMasonry = document.getElementById('skeletonMasonry');

function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'card skeleton';
    return card;
}

function createColorCard(color, height) {
    const card = tpl.content.cloneNode(true).querySelector('.card');
    const wrap = card.querySelector('.media-wrap');
    wrap.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'color-tile';
    div.style.background = color;
    div.style.height = (height || 260) + 'px';
    wrap.appendChild(div);
    return card;
}

function createImageCard(src, fallbackColors) {
    const card = tpl.content.cloneNode(true).querySelector('.card');
    const img = card.querySelector('img.media');
    img.dataset.src = src;
    img.onerror = () => {
        const wrap = card.querySelector('.media-wrap');
        wrap.innerHTML = '';
        const fallback = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
        const div = document.createElement('div');
        div.className = 'color-tile';
        div.style.background = fallback.color;
        div.style.height = (fallback.h || 260) + 'px';
        wrap.appendChild(div);
        card.classList.add('loaded');
    };
    return card;
}

function fadeInCard(card, delay) {
    setTimeout(() => card.classList.add('loaded'), delay);
}

function initLazyLoading() {
    const lazyImgs = document.querySelectorAll('img[data-src]');
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

for (let i = 0; i < items.length; i++) {
    skeletonMasonry.appendChild(createSkeletonCard());
}

setTimeout(() => {
    skeletonMasonry.style.display = 'none';
    mainContent.style.display = 'block';
    const colorItems = items.filter(item => item.type === 'color');
    items.forEach((item, index) => {
        let card;
        if (item.type === 'img') card = createImageCard(item.src, colorItems);
        else card = createColorCard(item.color, item.h);
        masonry.appendChild(card);
        fadeInCard(card, index * 100);
    });
    initLazyLoading();
}, 4000);
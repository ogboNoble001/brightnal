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
const overlay = document.querySelector('.overlay-div') 
const masonry = document.getElementById('masonry');
const tpl = document.getElementById('cardTpl');
const mainContent = document.getElementById('foryou');
const skeletonMasonry = document.getElementById('skeletonMasonry');

function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'card skeleton';
    
    const randomHeight = Math.floor(Math.random() * 350) + 150;
    card.style.setProperty('--sk-height', randomHeight + 'px');
    
    return card;
}

function createImageCard(item) {
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
    const overlay = document.querySelector(".overlay-div");
const template = document.getElementById("overlay-template");

function showOverlay(item) {
    overlay.classList.add('active');
    overlay.innerHTML = '';
    const clone = template.content.cloneNode(true);
    clone.querySelector("img").src = item.src;
    overlay.appendChild(clone);
    
overlay.querySelector('.back-btn').addEventListener('click', () => {
        overlay.classList.remove('active');
    });
    
}
card.addEventListener('click', () => {
    showOverlay(item); 
});

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

for (let i = 0; i < 6; i++) {
    skeletonMasonry.appendChild(createSkeletonCard());
}

const navItems = document.querySelectorAll('.notchNavBar .notAligned');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => {
            i.querySelector('span').classList.remove('active');
            i.querySelector('svg').setAttribute('stroke', '#BDBEBD');
        });
        item.querySelector('span').classList.add('active');
        item.querySelector('svg').setAttribute('stroke', '#000');
    });
});

const addNotify = true;
if (addNotify) {
    const meItem = document.querySelector('.notAligned.flex-col:last-child');
    meItem.classList.add('has-indicator');
}
setTimeout(() => {
    skeletonMasonry.style.display = 'none';
    mainContent.style.display = 'block';
    
    items.forEach((item, index) => {
        const card = createImageCard(item);
        masonry.appendChild(card);
        fadeInCard(card, index * 100);
    });
    
    initLazyLoading();
}, 1000);

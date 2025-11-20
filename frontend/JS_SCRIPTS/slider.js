const overlay = document.querySelector('.mainOverlay');
const mobileNav = document.querySelector('div.sidebar');
const hamburger = document.querySelector('.hamburger');
const closeWithIcn= document.querySelector('.sidebar-close')

// Function to open/close overlay
function toggleOverlay(open) {
    if (open) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// Function to open/close mobile nav
function toggleMobileNav(open) {
    if (open) {
        mobileNav.classList.add('active');
        toggleOverlay(true);
    } else {
        mobileNav.classList.remove('active');
        toggleOverlay(false);
    }
}

// Hamburger click
hamburger.addEventListener('click', () => {
    toggleMobileNav(true);
});

// Close overlay when clicking outside
overlay.addEventListener('click', e => {
    if (e.target === overlay) {
        toggleMobileNav(false);
    }
});
closeWithIcn.addEventListener('click', ()=>{
    toggleMobileNav(false)
})

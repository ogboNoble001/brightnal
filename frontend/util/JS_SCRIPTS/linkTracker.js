export function initNotchNav(navSelector) {
    const navItems = document.querySelectorAll(`${navSelector} div`);
    
    const savedIndex = localStorage.getItem('activeNotchIndex');
    if (savedIndex !== null && navItems[savedIndex]) {
        setActive(navItems[savedIndex], navItems);
    }
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            localStorage.setItem('activeNotchIndex', index);
            setActive(item, navItems);
        });
    });
    
    function setActive(activeItem, allItems) {
        allItems.forEach(i => i.querySelector('span').classList.remove('active'));
        allItems.forEach(i => i.querySelector('svg').style.stroke = '#BDBEBD'); 
        activeItem.querySelector('span').classList.add('active');
        activeItem.querySelector('svg').style.stroke = '#000'; 
    }
}
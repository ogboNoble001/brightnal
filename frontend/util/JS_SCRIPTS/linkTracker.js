export function initNotchNav(navSelector) {
    const navItems = document.querySelectorAll(`${navSelector} > div[data-url]`);
    
    // Find initially active item from HTML (has span.active)
    const initialActive = Array.from(navItems).find(item =>
        item.querySelector('span.active')
    );
    
    if (initialActive) {
        setActive(initialActive, navItems);
    }
    
    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            
            // Handle navigation here (e.g., update URL, load content, etc.)
            console.log(`Navigating to: ${url}`);
            
            setActive(item, navItems);
        });
    });
    
    function setActive(activeItem, allItems) {
        // Remove active class from all items
        allItems.forEach(i => {
            const span = i.querySelector('span');
            const svg = i.querySelector('svg');
            
            if (span) span.classList.remove('active');
            if (svg) svg.setAttribute('stroke', '#BDBEBD');
        });
        
        // Add active class to clicked item
        const activeSpan = activeItem.querySelector('span');
        const activeSvg = activeItem.querySelector('svg');
        
        if (activeSpan) activeSpan.classList.add('active');
        if (activeSvg) activeSvg.setAttribute('stroke', '#000000');
    }
}
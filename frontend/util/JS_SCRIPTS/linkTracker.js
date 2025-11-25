export function initNotchNav(navSelector) {
    const navItems = document.querySelectorAll(`${navSelector} > div[data-url]`);
    
    // Get the current path segment (e.g., "explore" from "/explore")
    const currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'explore';
    
    // Find the nav item that matches the current path
    const activeItem = Array.from(navItems).find(item => 
        item.getAttribute('data-url') === currentPath
    );
    
    // Set initial active state based on URL
    if (activeItem) {
        setActive(activeItem, navItems);
    }
    
    // Add click handlers for navigation
    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            
            // Navigate to the new URL
            window.history.pushState({}, '', `/${url}`);
            
            setActive(item, navItems);
            
            // Optionally dispatch a custom event for other parts of your app to listen to
            window.dispatchEvent(new CustomEvent('navigationChange', { detail: { url } }));
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const newPath = window.location.pathname.split('/').filter(Boolean).pop() || 'explore';
        const newActiveItem = Array.from(navItems).find(item => 
            item.getAttribute('data-url') === newPath
        );
        
        if (newActiveItem) {
            setActive(newActiveItem, navItems);
        }
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

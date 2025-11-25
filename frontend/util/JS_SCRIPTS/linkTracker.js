export function initNotchNav(navSelector) {
    const navItems = document.querySelectorAll(`${navSelector} > div[data-url]`);
    
    const currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'explore';
    

    const activeItem = Array.from(navItems).find(item => 
        item.getAttribute('data-url') === currentPath
    );
    

    if (activeItem) {
        setActive(activeItem, navItems);
    }
    

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            

            window.history.pushState({}, '', `/${url}`);
            
            setActive(item, navItems);
            

            window.dispatchEvent(new CustomEvent('navigationChange', { detail: { url } }));
        });
    });
    

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

        allItems.forEach(i => {
            const span = i.querySelector('span');
            const svg = i.querySelector('svg');
            
            if (span) span.classList.remove('active');
            if (svg) svg.setAttribute('stroke', '#BDBEBD');
        });
        

        const activeSpan = activeItem.querySelector('span');
        const activeSvg = activeItem.querySelector('svg');
        
        if (activeSpan) activeSpan.classList.add('active');
        if (activeSvg) activeSvg.setAttribute('stroke', '#000000');
    }
}

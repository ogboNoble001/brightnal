export function initNotchNav(navSelector) {
    const navItems = document.querySelectorAll(`${navSelector} > div[data-url]`);
    
    const currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'explore';
    
    const activeItem = Array.from(navItems).find(item => 
        item.getAttribute('data-url') === currentPath
    );

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            

            window.history.pushState({}, '', `/${url}`);
            
            window.dispatchEvent(new CustomEvent('navigationChange', { detail: { url } }));
        });
    });
    

    window.addEventListener('popstate', () => {
    const newPath = window.location.pathname.split('/').filter(Boolean).pop() || 'explore';
    const newActiveItem = Array.from(navItems).find(item =>
        item.getAttribute('data-url') === newPath
    );
    
    
    
    window.location.href = window.location.pathname;
});
    
    
}

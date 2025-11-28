window.addEventListener('DOMContentLoaded', () => {
        const inputPrnt = document.querySelector('.inputPrnt');
        if (!inputPrnt) return;
        
        inputPrnt.addEventListener('click', () => {
                if (typeof window.openOverlay === 'function') {
                        window.openOverlay();
                        
                }
        
        });
});
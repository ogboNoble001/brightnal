window.addEventListener('DOMContentLoaded', () => {
        const overlay = document.querySelector('.overlay-div');
        const inputPrnt = document.querySelector('.inputPrnt');
        const closeBtn = inputPrnt.querySelector('.closeBtn');
        
        if (!overlay || !closeBtn) return;
        
        closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling to inputPrnt
                overlay.classList.remove('active');
                closeBtn.classList.remove('active');
        });
        
        window.openOverlay = function() {
                overlay.classList.add('active');
                closeBtn.classList.add('active');
        };
});
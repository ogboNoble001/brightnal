window.addEventListener('DOMContentLoaded', () => {
        const overlay = document.querySelector('.overlay-div');
        const inputPrnt = document.querySelector('.inputPrnt');
        const closeBtn = inputPrnt.querySelector('.closeBtn');
        const input =  document.querySelector('.input')
        input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
        if (!overlay || !closeBtn) return;
        
        closeBtn.addEventListener('click', (e) => {
                input.value=''
                input.blur()
                e.stopPropagation(); // 
                overlay.classList.remove('active');
                closeBtn.classList.remove('active');
        });
        
        window.openOverlay = function() {
                overlay.classList.add('active');
                closeBtn.classList.add('active');
        };
});
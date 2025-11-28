window.addEventListener('DOMContentLoaded', () => {
        const overlay = document.querySelector('.overlay-div');
        const inputPrnt = document.querySelector('.inputPrnt');
        if (!overlay || !inputPrnt) return;
        
        const closeBtn = inputPrnt.querySelector('.closeBtn');
        const input = document.querySelector('.searchInput');
        const clearBtn = document.querySelector('.clearBtn');
        
        if (!closeBtn || !input || !clearBtn) return;
        
        input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') e.preventDefault();
        });
        
        input.addEventListener('input', () => {
                clearBtn.classList.toggle('active', input.value !== '');
        });
        
        clearBtn.addEventListener('click', () => {
                input.value = '';
                clearBtn.classList.remove('active');
        });
        
        inputPrnt.addEventListener('click', (e) => e.stopPropagation());
        
        overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                        overlay.classList.remove('active');
                        closeBtn.classList.remove('active');
                        clearBtn.classList.remove('active');
                        input.value = '';
                        input.blur();
                }
        });
        
        closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                overlay.classList.remove('active');
                closeBtn.classList.remove('active');
                clearBtn.classList.remove('active');
                input.value=''
                input.blur();
        });
        
        window.openOverlay = function() {
                overlay.classList.add('active');
                closeBtn.classList.add('active');
                input.focus();
        };
});
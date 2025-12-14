window.addEventListener('DOMContentLoaded', () => {
    let currentCartIndex = 0;
    
    const cart = document.querySelector('.cartBtn_checkout');
    
    if (!cart) return;
    
    const cartRect = cart.getBoundingClientRect();
    const newElement = document.createElement('div');
    newElement.textContent = currentCartIndex;
    newElement.style.position = 'fixed';
    newElement.style.top = `${cartRect.top + 8}px`;
    newElement.style.left = `${cartRect.right - 80}px`;
    newElement.style.width = '24px';
    newElement.style.height = '24px';
    newElement.style.background = 'rgba(255, 255, 255, 0.2)';
    newElement.style.backdropFilter = 'blur(10px)';
    newElement.style.webkitBackdropFilter = 'blur(10px)';
    newElement.style.color = '#000000';
    newElement.style.backgroundColor= 'rgba(255, 255, 255, .3)'
    newElement.style.padding = '.06em .5em';
    newElement.style.zIndex = '9999';
    newElement.style.boxSizing = 'border-box';
    newElement.style.borderRadius = '8px';
    newElement.style.display = 'flex';
    newElement.style.alignItems = 'center';
    newElement.style.justifyContent = 'center';
    
    function createCorner(top, left, right, bottom) {
        const corner = document.createElement('div');
        corner.style.position = 'absolute';
        corner.style.width = '8px';
        corner.style.height = '8px';
        corner.style.border = '2px solid red';
        corner.style.borderTop = top ? '2px solid black' : 'none';
        corner.style.borderLeft = left ? '2px solid black' : 'none';
        corner.style.borderRight = right ? '2px solid black' : 'none';
        corner.style.borderBottom = bottom ? '2px solid black' : 'none';
        return corner;
    }
    
    // Top-left corner
    const tl = createCorner(true, true, false, false);
    tl.style.top = '0';
    tl.style.left = '0';
    newElement.appendChild(tl);
    
    // Top-right corner
    const tr = createCorner(true, false, true, false);
    tr.style.top = '0';
    tr.style.right = '0';
    newElement.appendChild(tr);
    
    // Bottom-left corner
    const bl = createCorner(false, true, false, true);
    bl.style.bottom = '0';
    bl.style.left = '0';
    newElement.appendChild(bl);
    
    // Bottom-right corner
    const br = createCorner(false, false, true, true);
    br.style.bottom = '0';
    br.style.right = '0';
    newElement.appendChild(br);
    
    document.body.appendChild(newElement);
    

    const overlay = document.querySelector('.overlay-div');
    const inputPrnt = document.querySelector('.inputPrnt');
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                const input = document.querySelector('.searchInput');
                if (input && input.value === '') {
                    overlay.classList.remove('active');
                    const closeBtn = document.querySelector('.closeBtn');
                    const clearBtn = document.querySelector('.clearBtn');
                    if (closeBtn) closeBtn.classList.remove('active');
                    if (clearBtn) clearBtn.classList.remove('active');
                    if (input) {
                        input.value = '';
                        input.blur();
                    }
                }
            }
        });
    }
    
    // Handle search input if it exists
    if (inputPrnt) {
        const closeBtn = inputPrnt.querySelector('.closeBtn');
        const input = document.querySelector('.searchInput');
        const clearBtn = document.querySelector('.clearBtn');
        
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') e.preventDefault();
            });
            
            input.addEventListener('input', () => {
                if (clearBtn) {
                    clearBtn.classList.toggle('active', input.value !== '');
                }
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (input) {
                    input.value = '';
                    clearBtn.classList.remove('active');
                }
            });
        }
        
        inputPrnt.addEventListener('click', (e) => e.stopPropagation());
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (overlay) overlay.classList.remove('active');
                closeBtn.classList.remove('active');
                if (clearBtn) clearBtn.classList.remove('active');
                if (input) {
                    input.value = '';
                    input.blur();
                }
            });
        }
    }
    
    window.openOverlay = function() {
        currentCartIndex+=3
        const overlay = document.querySelector('.overlay-div');
        const closeBtn = document.querySelector('.closeBtn');
        const input = document.querySelector('.searchInput');
        
        if (overlay) overlay.classList.add('active');
        if (closeBtn) closeBtn.classList.add('active');
        if (input) input.focus();
    };
});
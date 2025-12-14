window.addEventListener('DOMContentLoaded', () => {
        //Handling backend update 
        const currentCartIndex = 5 
        const currentNotificationIndex = 3
        const cart = document.getElementById('cartBtn_checkout'); 
const cartRect = cart.getBoundingClientRect();
        const newElement = document.createElement('div');
newElement.textContent = currentCartIndex;
newElement.style.position = 'fixed';
newElement.style.top = `${cartRect.top + 8}px`;
newElement.style.left = `${cartRect.right - 80}px`;
newElement.style.width = '24px'; 
newElement.style.height = '24px';
newElement.style.background = 'rgba(255, 255, 255, 0.2)'; // semi-transparent
newElement.style.backdropFilter = 'blur(10px)'; // blur behind
newElement.style.webkitBackdropFilter = 'blur(10px)'; // Safari support
newElement.style.border = '1px solid rgba(255, 255, 255, 0.3)'; // subtle border
newElement.style.borderRadius = '12px'; // rounded corners
newElement.style.color = '#000000';
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
        corner.style.borderTop = top ? '2px solid gray' : 'none';
        corner.style.borderLeft = left ? '2px solid black' : 'none';
        corner.style.borderRight = right ? '2px solid black' : 'none';
        corner.style.borderBottom = bottom ? '2px solid gray' : 'none';
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
                if (e.target === overlay && input.value === '') {
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
                input.value = '';
                input.blur();
        });
        
        window.openOverlay = function() {
                overlay.classList.add('active');
                closeBtn.classList.add('active');
                input.focus();
        };
});
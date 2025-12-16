(function() {
    const mockDatabase = {
        userName: '@brightnal',
        signedIn: true,
        stats: {
            purchases: 40,
            bookmarks: 40,
            wishlist: 544,
            preOrders: 0,
            notifications: 5
        }
    };
    
    async function getUserData() {
        try {
            const res = await fetch('/api/user');
            if (!res.ok) throw new Error();
            return await res.json();
        } catch {
            return mockDatabase;
        }
    }
    
    window.UserUtil = {
        appInterface_User: null, // Will be set on DOMContentLoaded
        mockDatabase,
        async load() {
            const db = await getUserData();
            return {
                userName: db.userName,
                signedIn: db.signedIn ? 'Signed in' : 'Guest mode',
                productRelatedData: { ...db.stats }
            };
        },
        async updateUI() {
            // Wait for DOM to be ready
            if (!this.appInterface_User) {
                await new Promise(resolve => {
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', resolve);
                    } else {
                        resolve();
                    }
                });
                
                // Now set up the interface
                this.appInterface_User = {
                    userNameEl: document.querySelector('.username'),
                    signedInEl: document.querySelector('.signedIn'),
                    purchases_numberEl: document.querySelector('.purchases_number'),
                    bookmarks_numberEl: document.querySelector('.bookmarks_number'),
                    wishlist_numberEl: document.querySelector('.wishlist_number'),
                    notifications_numberEl: document.querySelector('.notifications_number')
                };
            }
            
            const userData = await this.load();
            
            if (this.appInterface_User.userNameEl) {
                this.appInterface_User.userNameEl.textContent = userData.userName;
            }
            if (this.appInterface_User.signedInEl) {
                this.appInterface_User.signedInEl.textContent = userData.signedIn;
            }
            if (this.appInterface_User.purchases_numberEl) {
                this.appInterface_User.purchases_numberEl.textContent = userData.productRelatedData.purchases;
            }
            if (this.appInterface_User.bookmarks_numberEl) {
                this.appInterface_User.bookmarks_numberEl.textContent = userData.productRelatedData.bookmarks;
            }
            if (this.appInterface_User.wishlist_numberEl) {
                this.appInterface_User.wishlist_numberEl.textContent = userData.productRelatedData.wishlist;
            }
            if (this.appInterface_User.notifications_numberEl) {
                this.appInterface_User.notifications_numberEl.textContent = userData.productRelatedData.notifications;
            }
            
            return userData;
        }
    };
})();

window.addEventListener('DOMContentLoaded', async () => {
    // ✅ Load userData for use in THIS file
    const userData = await window.UserUtil.load();

    // ✅ Handle notification badges
    const allElems = document.querySelectorAll('.relElem');
    allElems.forEach((elem) => {
        if (elem.classList.contains('notifications')) {
            const notifEl = elem.querySelector('.notifications_number');
            if (notifEl) {
                notifEl.textContent = userData.productRelatedData.notifications;
            }
        }
        elem.style.position = 'relative';
        const absElem = document.createElement('div');
        absElem.style.position = 'absolute';
        absElem.style.borderRadius = '50%';
        absElem.classList.add('absElem');
        absElem.style.width = '4.5px';
        absElem.style.backgroundColor = 'red';
        absElem.style.height = '5px';
        absElem.style.top = '-.3em';
        absElem.style.left = '1.2em';
        elem.appendChild(absElem);
    });

    // ✅ Cart counter
    let currentCartIndex = 0;
    const cart = document.querySelector('.cartBtn_checkout');
    
    if (cart) {
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
        newElement.style.backgroundColor = 'rgba(255, 255, 255, .3)';
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
        
        const tl = createCorner(true, true, false, false);
        tl.style.top = '0';
        tl.style.left = '0';
        newElement.appendChild(tl);
        
        const tr = createCorner(true, false, true, false);
        tr.style.top = '0';
        tr.style.right = '0';
        newElement.appendChild(tr);
        
        const bl = createCorner(false, true, false, true);
        bl.style.bottom = '0';
        bl.style.left = '0';
        newElement.appendChild(bl);
        
        const br = createCorner(false, false, true, true);
        br.style.bottom = '0';
        br.style.right = '0';
        newElement.appendChild(br);
        
        document.body.appendChild(newElement);
        
        // ✅ Make cart update function global if needed
        window.updateCartCount = function(count) {
            currentCartIndex = count;
            newElement.textContent = currentCartIndex;
        };
    }

    // ✅ Overlay and search handling
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
        if (cart) {
            currentCartIndex += 3;
            const cartDisplay = document.querySelector('.cartBtn_checkout').parentElement.querySelector('div');
            if (cartDisplay) cartDisplay.textContent = currentCartIndex;
        }
        const overlay = document.querySelector('.overlay-div');
        const closeBtn = document.querySelector('.closeBtn');
        const input = document.querySelector('.searchInput');
        
        if (overlay) overlay.classList.add('active');
        if (closeBtn) closeBtn.classList.add('active');
        if (input) input.focus();
    };
});



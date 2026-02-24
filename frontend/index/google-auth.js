// Google Sign-In - FULLY OPEN FOR LOCAL DEVELOPMENT
// All restrictions removed, maximum logging enabled

const BACKEND_URL = 'https://brightnal-backend.vercel.app';
// const BACKEND_URL = 'http://localhost:7700'; // Uncomment for local backend
const GOOGLE_CLIENT_ID = '81041045325-n7uqt6bk0ld60kr2ie1el9v3regn3k0m.apps.googleusercontent.com';

// ─── Initialize One Tap ────────────────────────────────────────────────────────
function initializeGoogleSignIn() {
    console.log('🔵 Initializing Google Sign-In...');
    
    if (typeof google === 'undefined') {
        console.log('⏳ Waiting for Google API to load...');
        setTimeout(initializeGoogleSignIn, 300);
        return;
    }

    console.log('✅ Google API loaded');

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signup',
        itp_support: true,
        ux_mode: 'popup',
    });

    console.log('✅ Google Sign-In initialized');

    // Wire up button
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
        console.log('✅ Google button found');
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔵 Button clicked - triggering One Tap');
            triggerOneTap();
        });
    } else {
        console.warn('⚠️ Google button not found in DOM');
    }

    // Check if already logged in
    verifyExistingToken().then(isLoggedIn => {
        console.log('🔵 Already logged in:', isLoggedIn);
        if (!isLoggedIn) {
            setTimeout(() => {
                console.log('🔵 Auto-showing One Tap prompt');
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed()) {
                        console.warn('⚠️ One Tap not displayed:', notification.getNotDisplayedReason());
                    } else if (notification.isSkippedMoment()) {
                        console.warn('⚠️ One Tap skipped');
                    } else {
                        console.log('✅ One Tap displayed successfully');
                    }
                });
            }, 1000);
        }
    });
}

// ─── Trigger One Tap ──────────────────────────────────────────────────────────
function triggerOneTap() {
    if (typeof google === 'undefined') {
        console.error('❌ Google API not loaded');
        return;
    }

    console.log('🔵 Triggering One Tap...');
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('⚠️ One Tap suppressed, showing fallback button');
            showFallbackButton();
        }
    });
}

// ─── Fallback Button ──────────────────────────────────────────────────────────
function showFallbackButton() {
    console.log('🔵 Showing fallback button');
    
    if (document.getElementById('brightnal-gsi-fallback')) {
        console.log('⚠️ Fallback button already exists');
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'brightnal-gsi-fallback';
    wrapper.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        border-radius: 12px;
        overflow: visible;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        animation: gsi-slide-up 0.35s cubic-bezier(0.32,0.72,0,1) both;
    `;

    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = `
        position: absolute;
        top: -10px; right: -10px;
        width: 24px; height: 24px;
        background: #333; border: none;
        border-radius: 50%;
        font-size: 16px; line-height: 24px; text-align: center;
        cursor: pointer; color: #fff;
        z-index: 1;
    `;
    close.onclick = () => {
        console.log('🔵 Closing fallback button');
        wrapper.remove();
    };
    wrapper.appendChild(close);

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'padding: 16px; background: #fff; border-radius: 12px;';
    wrapper.appendChild(btnContainer);

    document.body.appendChild(wrapper);

    if (!document.getElementById('gsi-fallback-style')) {
        const s = document.createElement('style');
        s.id = 'gsi-fallback-style';
        s.textContent = `
            @keyframes gsi-slide-up {
                from { opacity: 0; transform: translateY(40px); }
                to   { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(s);
    }

    google.accounts.id.renderButton(btnContainer, {
        theme: 'outline',
        size: 'large',
        text: 'signup_with',
        shape: 'rectangular',
        width: 260,
    });

    console.log('✅ Fallback button rendered');
}

// ─── Handle Google Response ───────────────────────────────────────────────────
async function handleGoogleResponse(response) {
    console.log('🔵 Google response received');
    console.log('🔵 Response object:', response);
    
    const idToken = response.credential;

    if (!idToken) {
        console.error('❌ No credential in response');
        showToast('Sign-in failed. No credential received.', 'error');
        return;
    }

    console.log('✅ Token received (first 20 chars):', idToken.substring(0, 20) + '...');
    setGoogleBtnLoading(true);

    try {
        console.log('🔵 Sending token to backend:', BACKEND_URL);
        console.log('🔵 Request payload:', { token: idToken.substring(0, 30) + '...' });
        
        const result = await fetch(`${BACKEND_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ token: idToken }),
            mode: 'cors', // Explicitly set CORS mode
        });

        console.log('📥 Response status:', result.status);
        console.log('📥 Response headers:', Object.fromEntries(result.headers.entries()));

        // Try to parse response
        let data;
        try {
            const text = await result.text();
            console.log('📥 Raw response:', text);
            data = JSON.parse(text);
            console.log('📥 Parsed response:', data);
        } catch (parseError) {
            console.error('❌ Failed to parse response:', parseError);
            showToast('Server returned invalid response', 'error');
            setGoogleBtnLoading(false);
            return;
        }

        if (data.success) {
            console.log('✅ Authentication successful');
            console.log('✅ User data:', data.user);
            console.log('✅ Token received:', data.token.substring(0, 20) + '...');
            
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('✅ Data saved to localStorage');
            
            showToast(`Welcome, ${data.user.full_name || 'back'}! 👋`, 'success');
            
            console.log('🔵 Redirecting to /explore in 1.5s');
            setTimeout(() => { 
                window.location.href = '/explore'; 
            }, 1500);
        } else {
            console.error('❌ Authentication failed:', data.message);
            showToast(data.message || 'Authentication failed', 'error');
        }
    } catch (err) {
        console.error('❌ Fetch error:', err);
        console.error('❌ Error name:', err.name);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error stack:', err.stack);
        
        // Very detailed error message
        let errorMsg = 'Unknown error occurred';
        
        if (err.name === 'TypeError') {
            errorMsg = 'Network error - Cannot reach backend server';
            console.error('💡 Possible causes:');
            console.error('   1. Backend server is not running');
            console.error('   2. Wrong backend URL');
            console.error('   3. Network/firewall blocking request');
            console.error('   4. CORS issue (check browser console for CORS errors)');
        } else if (err.message.includes('Failed to fetch')) {
            errorMsg = 'Cannot connect to server - Check backend URL';
        } else if (err.message.includes('NetworkError')) {
            errorMsg = 'Network error - Check your connection';
        }
        
        showToast(errorMsg, 'error');
    } finally {
        setGoogleBtnLoading(false);
    }
}

// ─── Verify Token ─────────────────────────────────────────────────────────────
async function verifyExistingToken() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        console.log('🔵 No token found in localStorage');
        return false;
    }

    console.log('🔵 Verifying existing token...');

    try {
        const res = await fetch(`${BACKEND_URL}/api/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        const data = await res.json();
        console.log('🔵 Token verification result:', data);
        
        if (!data.success) {
            console.log('⚠️ Token invalid, clearing storage');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return false;
        }
        
        console.log('✅ Token valid');
        return true;
    } catch (error) {
        console.error('❌ Token verification error:', error);
        return false;
    }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function setGoogleBtnLoading(isLoading) {
    const btn = document.getElementById('googleSignInBtn');
    if (!btn) {
        console.warn('⚠️ Cannot set button loading state - button not found');
        return;
    }

    if (isLoading) {
        console.log('🔵 Setting button to loading state');
        btn.dataset.html = btn.innerHTML;
        btn.innerHTML = `
            <svg style="width:18px;height:18px;margin-right:8px;animation:gsi-spin 0.7s linear infinite;flex-shrink:0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#ccc" stroke-width="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            </svg>
            Signing in...
        `;
        btn.disabled = true;
        
        if (!document.getElementById('gsi-spin-style')) {
            const s = document.createElement('style');
            s.id = 'gsi-spin-style';
            s.textContent = '@keyframes gsi-spin { to { transform: rotate(360deg); } }';
            document.head.appendChild(s);
        }
    } else {
        console.log('🔵 Resetting button state');
        btn.innerHTML = btn.dataset.html || 'Continue with Google';
        btn.disabled = false;
    }
}

function showToast(message, type = 'success') {
    console.log(`🔵 Showing toast: [${type}] ${message}`);
    
    const existing = document.getElementById('brightnal-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'brightnal-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(60px);
        background: ${type === 'success' ? '#111' : '#e53935'};
        color: #fff;
        padding: 12px 28px;
        border-radius: 100px;
        font-size: 14px;
        font-weight: 500;
        z-index: 999999;
        transition: transform 0.3s cubic-bezier(0.32,0.72,0,1), opacity 0.3s;
        opacity: 0;
        white-space: nowrap;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }));

    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(60px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ─── Auth Utilities ───────────────────────────────────────────────────────────
function logout() {
    console.log('🔵 Logging out...');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    if (typeof google !== 'undefined') {
        google.accounts.id.disableAutoSelect();
    }
    console.log('✅ Logged out, redirecting to home');
    window.location.href = '/index.html';
}

function requireAuth() {
    console.log('🔵 Checking authentication...');
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        console.log('❌ No token found, redirecting to home');
        window.location.href = '/index.html';
        return false;
    }
    
    console.log('✅ Token found, verifying...');
    verifyExistingToken().then(valid => {
        if (!valid) {
            console.log('❌ Token invalid, redirecting to home');
            window.location.href = '/index.html';
        } else {
            console.log('✅ Token valid, access granted');
        }
    });
    
    return true;
}

function getCurrentUser() {
    const u = localStorage.getItem('user');
    const user = u ? JSON.parse(u) : null;
    console.log('🔵 Current user:', user);
    return user;
}

// ─── Initialize ───────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    console.log('🔵 Page loaded, initializing auth system');
    console.log('🔵 Backend URL:', BACKEND_URL);
    console.log('🔵 Google Client ID:', GOOGLE_CLIENT_ID);
    initializeGoogleSignIn();
});

// Export functions
window.BrightnalAuth = { 
    logout, 
    requireAuth, 
    getCurrentUser, 
    verifyExistingToken 
};

console.log('✅ Google Auth script loaded');
console.log('🔵 Debug mode: FULL LOGGING ENABLED');
console.log('🔵 Open DevTools Console (F12) to see all logs');

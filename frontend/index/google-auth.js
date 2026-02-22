// Google Sign-In Implementation for Brightnal
// Uses Google One Tap — the native on-page sign-in prompt, no tabs or custom modals

const BACKEND_URL = 'https://brightnal-backend.vercel.app';
const GOOGLE_CLIENT_ID = '81041045325-n7uqt6bk0ld60kr2ie1el9v3regn3k0m.apps.googleusercontent.com';

// ─── Initialize One Tap ────────────────────────────────────────────────────────
function initializeGoogleSignIn() {
    if (typeof google === 'undefined') {
        setTimeout(initializeGoogleSignIn, 300);
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signup',
        itp_support: true,
        ux_mode: 'popup', // ✅ on-page native card, NOT a new tab
    });

    // Wire up your "Continue with Google" button
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerOneTap();
        });
    }

    // Auto-show One Tap on page load if not already signed in
    verifyExistingToken().then(isLoggedIn => {
        if (!isLoggedIn) {
            setTimeout(() => {
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed()) {
                        console.warn('One Tap not displayed:', notification.getNotDisplayedReason());
                        // Common reasons:
                        // 'opt_out_or_no_session'  — no Google session in browser
                        // 'suppressed_by_user'     — dismissed before (cooldown active)
                        // 'unregistered_origin'    — domain not in Google Cloud Console
                    }
                });
            }, 1000);
        }
    });
}

// ─── Trigger One Tap on button click ──────────────────────────────────────────
function triggerOneTap() {
    if (typeof google === 'undefined') return;

    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap suppressed — show official Google button in corner as fallback
            showFallbackButton();
        }
    });
}

// ─── Fallback: official Google button anchored bottom-right ───────────────────
function showFallbackButton() {
    if (document.getElementById('brightnal-gsi-fallback')) return;

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
    close.onclick = () => wrapper.remove();
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
}

// ─── Handle credential returned by Google ─────────────────────────────────────
async function handleGoogleResponse(response) {
    const idToken = response.credential;

    if (!idToken) {
        showToast('Sign-in failed. Please try again.', 'error');
        return;
    }

    setGoogleBtnLoading(true);

    try {
        const result = await fetch(`${BACKEND_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
        });

        const data = await result.json();

        if (data.success) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showToast(`Welcome, ${data.user.full_name || 'back'}! 👋`, 'success');
            setTimeout(() => { window.location.href = '/explore'; }, 1500);
        } else {
            showToast(data.message || 'Authentication failed', 'error');
        }
    } catch (err) {
        console.error('Auth error:', err);
        showToast('Network error. Check your connection.', 'error');
    } finally {
        setGoogleBtnLoading(false);
    }
}

// ─── Verify stored token ───────────────────────────────────────────────────────
async function verifyExistingToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
        const res = await fetch(`${BACKEND_URL}/api/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        if (!data.success) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function setGoogleBtnLoading(isLoading) {
    const btn = document.getElementById('googleSignInBtn');
    if (!btn) return;

    if (isLoading) {
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
        btn.innerHTML = btn.dataset.html || 'Continue with Google';
        btn.disabled = false;
    }
}

function showToast(message, type = 'success') {
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

// ─── Auth utilities ───────────────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    if (typeof google !== 'undefined') google.accounts.id.disableAutoSelect();
    window.location.href = '/index.html';
}

function requireAuth() {
    const token = localStorage.getItem('auth_token');
    if (!token) { window.location.href = '/index.html'; return false; }
    verifyExistingToken().then(valid => { if (!valid) window.location.href = '/index.html'; });
    return true;
}

function getCurrentUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    initializeGoogleSignIn();
});

window.BrightnalAuth = { logout, requireAuth, getCurrentUser, verifyExistingToken };

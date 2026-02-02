// Google Sign-In Implementation for Brightnal
// Add this script to your frontend

// Configuration
const BACKEND_URL = 'https://brightnal-backend.vercel.app'; // Update with your backend URL
const GOOGLE_CLIENT_ID = '81041045325-n7uqt6bk0ld60kr2ie1el9v3regn3k0m.apps.googleusercontent.com'; // Replace with your actual Google Client ID

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
        console.log('✅ Google Identity Services loaded');
        setupGoogleButton();
    };
}

// Setup Google Sign-In button
function setupGoogleButton() {
    const googleBtn = document.querySelector('.btn-google');
    
    if (!googleBtn) {
        console.error('❌ Google button not found');
        return;
    }

    googleBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        handleGoogleSignIn();
    });
}

// Handle Google Sign-In
function handleGoogleSignIn() {
    // Initialize Google Sign-In with callback
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });

    // Prompt the user to sign in
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: show the One Tap dialog
            console.log('Prompt not displayed, showing popup');
            showGooglePopup();
        }
    });
}

// Alternative: Show Google popup for sign-in
function showGooglePopup() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
    });

    // This will show a popup window
    const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
            if (response.access_token) {
                await verifyGoogleToken(response.access_token);
            }
        },
    });
    
    client.requestAccessToken();
}

// Handle the Google response (ID token)
async function handleGoogleResponse(response) {
    const idToken = response.credential;
    
    if (!idToken) {
        console.error('❌ No ID token received');
        showError('Sign-in failed. Please try again.');
        return;
    }

    try {
        // Show loading state
        showLoading();

        // Send token to backend for verification
        const result = await fetch(`${BACKEND_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: idToken }),
        });

        const data = await result.json();

        if (data.success) {
            // Store JWT token
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Show success and redirect
            showSuccess(data.user);
            
            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = '/dashboard.html'; // Update with your redirect URL
            }, 1500);
        } else {
            showError(data.message || 'Authentication failed');
        }

        hideLoading();

    } catch (error) {
        console.error('❌ Authentication error:', error);
        showError('Network error. Please check your connection.');
        hideLoading();
    }
}

// Verify if user is already logged in
async function verifyExistingToken() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            // User is already logged in
            return true;
        } else {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return false;
        }
    } catch (error) {
        console.error('❌ Token verification error:', error);
        return false;
    }
}

// UI Helper Functions
function showLoading() {
    const googleBtn = document.querySelector('.btn-google');
    const originalText = googleBtn.innerHTML;
    googleBtn.dataset.originalText = originalText;
    googleBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
        Signing in...
    `;
    googleBtn.disabled = true;
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spinner { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
}

function hideLoading() {
    const googleBtn = document.querySelector('.btn-google');
    googleBtn.innerHTML = googleBtn.dataset.originalText || 'Continue with Google';
    googleBtn.disabled = false;
}

function showSuccess(user) {
    const overlay = document.getElementById('overlay');
    const overlayContent = overlay.querySelector('.overlay-content');
    
    overlayContent.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 50px; height: 50px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 style="margin: 20px 0 10px; font-size: 28px; color: #333;">Welcome, ${user.full_name || 'User'}!</h2>
            <p style="color: #666; font-size: 16px;">You've successfully signed in</p>
            <p style="color: #999; font-size: 14px; margin-top: 20px;">Redirecting you now...</p>
        </div>
    `;
}

function showError(message) {
    const overlay = document.getElementById('overlay');
    const overlayContent = overlay.querySelector('.overlay-content');
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 4 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
    
    // Add animations
    if (!document.getElementById('error-animations')) {
        const style = document.createElement('style');
        style.id = 'error-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    google.accounts.id.disableAutoSelect();
    window.location.href = '/index.html'; // Redirect to home
}

// Protected page check
function requireAuth() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        window.location.href = '/index.html';
        return false;
    }
    
    // Optionally verify token with backend
    verifyExistingToken().then(isValid => {
        if (!isValid) {
            window.location.href = '/index.html';
        }
    });
    
    return true;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    verifyExistingToken().then(isLoggedIn => {
        if (isLoggedIn) {
            console.log('✅ User already logged in');
            // Optionally redirect or update UI
            // window.location.href = '/dashboard.html';
        } else {
            // Initialize Google Sign-In
            initializeGoogleSignIn();
        }
    });
});

// Export functions for use in other scripts
window.BrightnalAuth = {
    logout,
    requireAuth,
    getCurrentUser,
    verifyExistingToken
};

// Migration Script - Run this ONCE in browser console to fix token names
// Or add this at the top of your index.js

(function migrateTokens() {
  console.log('🔧 Checking for old token names...');
  
  // Check for old token name
  const oldToken = localStorage.getItem('jwtToken');
  const newToken = localStorage.getItem('auth_token');
  
  if (oldToken && !newToken) {
    console.log('📦 Migrating old token to new name...');
    localStorage.setItem('auth_token', oldToken);
    localStorage.removeItem('jwtToken');
    console.log('✅ Token migrated successfully');
  } else if (oldToken && newToken) {
    console.log('⚠️ Both tokens exist, removing old one...');
    localStorage.removeItem('jwtToken');
    console.log('✅ Old token removed');
  } else if (newToken) {
    console.log('✅ Token already using new name');
  } else {
    console.log('ℹ️ No tokens found');
  }
})();

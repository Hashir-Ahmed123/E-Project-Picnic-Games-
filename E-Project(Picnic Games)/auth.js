// Authentication handling with Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Check if firebaseAuth is available
    if (typeof window.firebaseAuth === 'undefined') {
        console.error('Firebase not initialized. Please check firebase-config.js');
        return;
    }

    const { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithGoogle, signOut, onAuthStateChanged } = window.firebaseAuth;

    // Login form handler
    const loginForm = document.querySelector('form[data-demo-form]');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm && loginBtn) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            try {
                loginBtn.disabled = true;
                loginBtn.textContent = 'Signing in...';
                
                const userCredential = await signInWithEmailAndPassword(email, password);
                showMessage('Login successful!', 'success');
                
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } catch (error) {
                console.error('Login error:', error);
                let errorMessage = 'Login failed. Please try again.';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'This account has been disabled.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed attempts. Please try again later.';
                        break;
                }
                
                showMessage(errorMessage, 'error');
            } finally {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    }

    // Signup form handler
    const signupForm = document.querySelector('.auth-section form');
    const signupBtn = document.getElementById('signupBtn');
    
    if (signupForm && signupBtn) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = signupForm.querySelector('input[name="name"]')?.value || '';
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('input[type="password"]').value;
            const confirmPassword = signupForm.querySelector('input[name="confirmPassword"]')?.value;
            
            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            
            if (confirmPassword && password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            try {
                signupBtn.disabled = true;
                signupBtn.textContent = 'Creating account...';
                
                const userCredential = await createUserWithEmailAndPassword(email, password);
                
                // Update user profile with display name
                if (name && userCredential.user) {
                    await userCredential.user.updateProfile({
                        displayName: name
                    });
                }
                
                showMessage('Account created successfully!', 'success');
                
                // Redirect to dashboard after successful signup
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } catch (error) {
                console.error('Signup error:', error);
                let errorMessage = 'Account creation failed. Please try again.';
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'An account with this email already exists.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Email/password accounts are not enabled.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak. Please choose a stronger password.';
                        break;
                }
                
                showMessage(errorMessage, 'error');
            } finally {
                signupBtn.disabled = false;
                signupBtn.textContent = 'Sign Up';
            }
        });
    }

    // Google Sign In handlers
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const googleSignUpBtn = document.getElementById('googleSignUpBtn');
    
    const handleGoogleSignIn = async function() {
        try {
            const btn = this;
            btn.disabled = true;
            btn.innerHTML = '<span class="social-icon"><i class="fas fa-spinner fa-spin"></i></span> Connecting...';
            
            const result = await signInWithGoogle();
            const user = result.user;
            
            showMessage(`Welcome ${user.displayName || user.email}!`, 'success');
            
            // Redirect to dashboard after successful Google sign in
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Google sign in error:', error);
            let errorMessage = 'Google sign in failed. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign in was cancelled.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
            }
            
            showMessage(errorMessage, 'error');
            
            // Reset button
            const btn = this;
            btn.disabled = false;
            btn.innerHTML = '<span class="social-icon"><i class="fab fa-google"></i></span> Sign in with Google';
        }
    };
    
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }
    
    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener('click', handleGoogleSignIn);
    }

    // Authentication state observer
    onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.displayName || user.email);
            
            // Update UI for logged-in state
            updateAuthUI(true, user);
            
            // Redirect if on login/signup pages
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is signed out
            console.log('User is signed out');
            
            // Update UI for logged-out state
            updateAuthUI(false);
        }
    });
});

// Helper function to show messages
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message auth-message--${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#10b981';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#ef4444';
            break;
        case 'info':
            messageDiv.style.backgroundColor = '#3b82f6';
            break;
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Update UI based on authentication state
function updateAuthUI(isLoggedIn, user = null) {
    const loginBtns = document.querySelectorAll('a[href="login.html"]');
    const signupBtns = document.querySelectorAll('a[href="signup.html"]');
    
    if (isLoggedIn && user) {
        // Show user info and logout
        loginBtns.forEach(btn => {
            btn.textContent = 'Dashboard';
            btn.href = 'dashboard.html';
        });
        
        signupBtns.forEach(btn => {
            btn.textContent = 'Logout';
            btn.href = '#';
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.firebaseAuth.signOut().then(() => {
                    window.location.href = 'index.html';
                });
            });
        });
    } else {
        // Show login/signup buttons
        loginBtns.forEach(btn => {
            btn.textContent = 'Login';
            btn.href = 'login.html';
        });
        
        signupBtns.forEach(btn => {
            btn.textContent = 'Sign Up';
            btn.href = 'signup.html';
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

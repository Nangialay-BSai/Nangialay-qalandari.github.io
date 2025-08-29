// Form switching functions
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('verificationForm').classList.add('hidden');
    
    // Hide panda guide
    document.getElementById('pandaGuide').classList.remove('show');
}

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('verificationForm').classList.add('hidden');
    
    // Show panda guide
    setTimeout(() => {
        document.getElementById('pandaGuide').classList.add('show');
    }, 300);
    
    // Hide panda guide after 5 seconds
    setTimeout(() => {
        document.getElementById('pandaGuide').classList.remove('show');
    }, 5000);
}

function showVerification() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('verificationForm').classList.remove('hidden');
    
    // Hide panda guide
    document.getElementById('pandaGuide').classList.remove('show');
}

// Handle login
function handleLogin(form) {
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Simple demo login (replace with actual authentication)
    if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', 'Admin');
        alert('Login successful!');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials. Use admin@example.com / admin123');
    }
}

// Handle signup
function handleSignup(form) {
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    if (name && email && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        alert('Account created successfully!');
        window.location.href = 'admin.html';
    } else {
        alert('Please fill all fields');
    }
}

// Password toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Verification code input handling
document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('.code-input');
    
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
    
    // Form submissions
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if it's signup form
            if (this.closest('#signupForm')) {
                handleSignup(this);
            } else {
                // Handle login
                handleLogin(this);
            }
        });
    });
    
    // Verification button
    const verifyBtn = document.querySelector('#verificationForm .auth-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Email verified successfully!');
            showLogin();
        });
    }
    
    // Interactive Panda Mascot
    const pandaMascot = document.getElementById('pandaMascot');
    const pandaTooltip = document.getElementById('pandaTooltip');
    
    const tooltipMessages = {
        'name': 'Enter your full name here! 🚀',
        'email': 'Your email address please! 📧',
        'password': 'Create a strong password! 🔒',
        'confirm': 'Confirm your password! ✓',
        'default': 'Fill in this field! 😊'
    };
    
    function showPandaMascot(inputType, position) {
        pandaMascot.className = `panda-mascot active ${inputType}-field`;
        pandaTooltip.textContent = tooltipMessages[inputType] || tooltipMessages.default;
        
        // Add tech glow effect
        setTimeout(() => {
            pandaMascot.style.filter = 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.4))';
        }, 200);
    }
    
    function hidePandaMascot() {
        pandaMascot.classList.remove('active');
        pandaMascot.style.filter = 'none';
    }
    
    // Add event listeners to all input fields
    function addPandaListeners() {
        const inputs = document.querySelectorAll('.input-group input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                let inputType = 'default';
                
                if (this.type === 'text' || this.placeholder.includes('Name')) {
                    inputType = 'name';
                } else if (this.type === 'email') {
                    inputType = 'email';
                } else if (this.type === 'password') {
                    if (this.placeholder.includes('Confirm')) {
                        inputType = 'confirm';
                    } else {
                        inputType = 'password';
                    }
                }
                
                showPandaMascot(inputType);
            });
            
            input.addEventListener('blur', function() {
                setTimeout(hidePandaMascot, 1000); // Hide after 1 second
            });
            
            // Show encouragement when typing
            input.addEventListener('input', function() {
                if (this.value.length > 0) {
                    pandaTooltip.textContent = 'Great job! Keep going! 🎉';
                }
            });
        });
    }
    
    // Initialize panda listeners
    addPandaListeners();
    
    // Re-add listeners when switching forms
    const originalShowSignup = window.showSignup;
    const originalShowLogin = window.showLogin;
    
    window.showSignup = function() {
        originalShowSignup();
        setTimeout(addPandaListeners, 100);
    };
    
    window.showLogin = function() {
        originalShowLogin();
        setTimeout(addPandaListeners, 100);
        hidePandaMascot();
    };
});
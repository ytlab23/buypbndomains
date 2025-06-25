document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.auth-tab');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const signupPassword = document.getElementById('signup-password');
    const passwordStrengthBar = document.querySelector('.strength-bar');
    const passwordStrengthText = document.getElementById('strengthText');
    const confirmPassword = document.getElementById('confirm-password');

    // Toggle between login and signup forms
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show the corresponding form
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${target}Form`).classList.add('active');
        });
    });

    // Toggle password visibility
    togglePasswordBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const input = this.parentElement.querySelector('input');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength indicator
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updateStrengthIndicator(strength);
        });
    }

    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) strength++;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength++;
        
        // Contains number
        if (/[0-9]/.test(password)) strength++;
        
        // Contains special character
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    }

    // Update password strength UI
    function updateStrengthIndicator(strength) {
        const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
        const width = (strength / 5) * 100;
        
        passwordStrengthBar.style.width = `${width}%`;
        passwordStrengthBar.style.backgroundColor = colors[strength];
        passwordStrengthText.textContent = strengthText[strength];
        passwordStrengthText.style.color = colors[strength];
    }

    // Form validation
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    showError(input, 'Please enter a valid email address');
                }
            }
            
            // Password confirmation
            if (input.id === 'confirm-password' && input.value !== signupPassword.value) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Passwords do not match');
            }
        });
        
        return isValid;
    }
    
    // Show error message
    function showError(input, message) {
        // Remove any existing error messages
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add new error message
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = '#ef4444';
        error.style.fontSize = '0.75rem';
        error.style.marginTop = '0.25rem';
        
        input.parentElement.appendChild(error);
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Here you would typically send the data to your server
                console.log('Login form submitted');
                // Example: fetch('/api/login', { method: 'POST', body: new FormData(this) })
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Here you would typically send the data to your server
                console.log('Signup form submitted');
                // Example: fetch('/api/signup', { method: 'POST', body: new FormData(this) })
            }
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-google, .btn-github');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('btn-google') ? 'google' : 'github';
            console.log(`Logging in with ${provider}`);
            // Here you would typically redirect to OAuth provider
            // window.location.href = `/auth/${provider}`;
        });
    });
});

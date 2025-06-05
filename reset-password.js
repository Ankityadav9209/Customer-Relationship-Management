// Get DOM elements
const emailForm = document.getElementById('emailForm');
const verificationForm = document.getElementById('verificationForm');
const newPasswordForm = document.getElementById('newPasswordForm');
const resetEmailForm = document.getElementById('resetEmailForm');
const codeVerificationForm = document.getElementById('codeVerificationForm');
const passwordResetForm = document.getElementById('passwordResetForm');

// Store email for verification
let userEmail = '';
let verificationCode = '';

// Handle email submission
resetEmailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const errorDiv = document.getElementById('emailError');
    
    // Check if email exists in users array
    const user = users.find(u => u.email === email);
    
    if (user) {
        userEmail = email;
        // Generate random 6-digit code
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // In a real application, this would send an email
        console.log(`Verification code for ${email}: ${verificationCode}`);
        alert(`For demo purposes, your verification code is: ${verificationCode}`);
        
        // Show verification form
        emailForm.style.display = 'none';
        verificationForm.style.display = 'block';
    } else {
        errorDiv.textContent = 'Email not found';
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 3000);
    }
});

// Handle verification code input
const verificationInputs = document.querySelectorAll('.verification-input');
verificationInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1) {
            if (index < verificationInputs.length - 1) {
                verificationInputs[index + 1].focus();
            }
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            verificationInputs[index - 1].focus();
        }
    });
});

// Handle verification code submission
codeVerificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('verificationError');
    
    // Get entered code
    const enteredCode = Array.from(verificationInputs)
        .map(input => input.value)
        .join('');
    
    if (enteredCode === verificationCode) {
        // Show new password form
        verificationForm.style.display = 'none';
        newPasswordForm.style.display = 'block';
    } else {
        errorDiv.textContent = 'Invalid verification code';
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 3000);
    }
});

// Handle resend code
document.querySelector('.resend-btn').addEventListener('click', () => {
    // Generate new code
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real application, this would resend the email
    console.log(`New verification code for ${userEmail}: ${verificationCode}`);
    alert(`For demo purposes, your new verification code is: ${verificationCode}`);
    
    // Clear inputs
    verificationInputs.forEach(input => input.value = '');
    verificationInputs[0].focus();
});

// Password strength checker
function checkPasswordStrength(password) {
    const strengthMeter = document.querySelector('.password-strength');
    
    // Reset classes
    strengthMeter.className = 'password-strength';
    
    if (password.length === 0) return;
    
    // Check strength
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;
    
    const strength = [hasLower, hasUpper, hasNumber, hasSpecial]
        .filter(Boolean).length;
    
    if (length < 8) {
        strengthMeter.classList.add('weak');
    } else if (strength <= 2) {
        strengthMeter.classList.add('weak');
    } else if (strength === 3) {
        strengthMeter.classList.add('medium');
    } else {
        strengthMeter.classList.add('strong');
    }
}

// Monitor password strength
document.getElementById('newPassword').addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});

// Handle new password submission
passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    
    // Validate password
    if (newPassword.length < 8) {
        errorDiv.textContent = 'Password must be at least 8 characters long';
        errorDiv.classList.add('show');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
        return;
    }
    
    // Update password in users array
    const userIndex = users.findIndex(u => u.email === userEmail);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        
        // Show success message and redirect
        alert('Password has been reset successfully!');
        window.location.href = 'login.html';
    }
});

// Toggle password visibility
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('newPassword');
    const type = passwordInput.getAttribute('type');
    
    passwordInput.setAttribute(
        'type',
        type === 'password' ? 'text' : 'password'
    );
    
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
}); 
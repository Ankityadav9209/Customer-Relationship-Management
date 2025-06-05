// Sample user data (in a real application, this would be in a backend database)
const users = [
    {
        email: 'admin@clientnest.com',
        password: 'admin123', // In a real application, this would be hashed
        name: 'Ankit',
        role: 'admin'
    }
]; 

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('crm_session');
    if (session) {
        window.location.href = 'index.html';
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorDiv = document.getElementById('loginError');
    
    // Validate credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session
        const session = {
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            },
            timestamp: new Date().getTime()
        };
        
        // Store session
        localStorage.setItem('crm_session', JSON.stringify(session));
        
        // Store remember me preference
        if (remember) {
            localStorage.setItem('crm_remember', 'true');
        } else {
            localStorage.removeItem('crm_remember');
        }
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        // Show error
        errorDiv.textContent = 'Invalid email or password';
        errorDiv.classList.add('show');
        
        // Clear error after 3 seconds
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    }
});

// Toggle password visibility
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type');
    
    passwordInput.setAttribute(
        'type',
        type === 'password' ? 'text' : 'password'
    );
    
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Handle "Remember me" from previous session
if (localStorage.getItem('crm_remember') === 'true') {
    document.getElementById('remember').checked = true;
}

// Handle "Forgot Password" click
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'reset-password.html';
}); 
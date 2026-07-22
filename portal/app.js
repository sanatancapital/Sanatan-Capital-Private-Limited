// Function to switch between Login and Register Forms
function switchForm(formName) {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    if (formName === 'register') {
        loginBox.classList.remove('active');
        registerBox.classList.add('active');
    } else {
        registerBox.classList.remove('active');
        loginBox.classList.add('active');
    }
}

// Login Demo Logic
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("✅ Login Successful!\n\nRedirecting to Sanatan Capital Dashboard...");
    // Future: Here we will redirect to dashboard.html
});

// Registration Demo Logic
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("🎉 Account Created Successfully!\n\nSanatan Capital की तरफ से आपकी Email ID पर एक कन्फर्मेशन मेल भेज दिया गया है।\n\nअब आपको डैशबोर्ड पर भेजा जा रहा है। कृपया वहां अपनी KYC पूरी करें।");
    
    // Auto switch to login after registration demo
    document.getElementById('registerForm').reset();
    switchForm('login');
});

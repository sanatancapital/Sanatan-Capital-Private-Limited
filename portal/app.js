// Function to switch between Login, Register, and OTP Forms
function switchForm(formName) {
    // Hide all forms first
    document.getElementById('login-box').classList.remove('active');
    document.getElementById('register-box').classList.remove('active');
    document.getElementById('otp-box').classList.remove('active');

    // Show the requested form
    if (formName === 'register') {
        document.getElementById('register-box').classList.add('active');
    } else if (formName === 'login') {
        document.getElementById('login-box').classList.add('active');
    } else if (formName === 'otp') {
        document.getElementById('otp-box').classList.add('active');
    }
}

// 1. Login Logic
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Login successful, redirect to dashboard
    window.location.href = "dashboard.html"; 
});

// 2. Registration Step 1: Submit Details & Send OTP
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulate sending OTP and switch to OTP form
    alert("✅ OTP sent successfully to your Mobile and Email!");
    switchForm('otp');
});

// 3. Registration Step 2: Verify OTP & Redirect
document.getElementById('otpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // OTP verified
    alert("🎉 OTP Verified! Account Created Successfully.\n\nSanatan Capital की तरफ से आपकी Email ID पर एक वेलकम मेल भेज दिया गया है।\n\nअब आपको डैशबोर्ड पर भेजा जा रहा है।");
    
    // Redirect to Dashboard
    window.location.href = "dashboard.html";
});

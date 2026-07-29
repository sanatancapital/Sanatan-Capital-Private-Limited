// 1. Supabase Setup
const SUPABASE_URL = 'https://wkpoubvvpvolxzlzhfgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcG91YnZ2cHZvbHh6bHpoZmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjU3NzQsImV4cCI6MjEwMDMwMTc3NH0.DncM1ytnTmeup143FkX0q0iX-F5bPBJcXi9WKhHDEO8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Form Switcher (लॉगिन और रजिस्टर फॉर्म बदलने के लिए)
function switchForm(formName) {
    document.getElementById('login-box').classList.remove('active');
    document.getElementById('register-box').classList.remove('active');
    document.getElementById('otp-box').classList.remove('active');

    if (formName === 'register') {
        document.getElementById('register-box').classList.add('active');
    } else if (formName === 'login') {
        document.getElementById('login-box').classList.add('active');
    } else if (formName === 'otp') {
        document.getElementById('otp-box').classList.add('active');
    }
}

// 3. Register Form Submit (नया अकाउंट बनाने के लिए)
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]').value;
    const submitBtn = this.querySelector('button');
    
    submitBtn.innerHTML = 'Sending OTP...';
    submitBtn.disabled = true;

    const { data, error } = await supabase.auth.signInWithOtp({ email: emailInput });

    submitBtn.innerHTML = 'Register Now <i class="fas fa-arrow-right"></i>';
    submitBtn.disabled = false;

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("OTP sent to " + emailInput);
        sessionStorage.setItem('dsa_email', emailInput);
        switchForm('otp');
    }
});

// 4. Login Form Submit (पुराने अकाउंट में जाने के लिए)
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="text"]').value;
    const submitBtn = this.querySelector('button');
    
    submitBtn.innerHTML = 'Sending OTP...';
    submitBtn.disabled = true;

    const { data, error } = await supabase.auth.signInWithOtp({ email: emailInput });

    submitBtn.innerHTML = 'Login to Dashboard <i class="fas fa-sign-in-alt"></i>';
    submitBtn.disabled = false;

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Login OTP sent to " + emailInput);
        sessionStorage.setItem('dsa_email', emailInput);
        switchForm('otp');
    }
});

// 5. OTP Verification (OTP चेक करके डैशबोर्ड पर भेजने के लिए)
document.getElementById('otpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const otpInput = this.querySelector('input[type="text"]').value;
    const savedEmail = sessionStorage.getItem('dsa_email');
    const submitBtn = this.querySelector('button');
    
    submitBtn.innerHTML = 'Verifying...';
    submitBtn.disabled = true;

    const { data, error } = await supabase.auth.verifyOtp({
        email: savedEmail,
        token: otpInput,
        type: 'email'
    });

    submitBtn.innerHTML = 'Verify & Register <i class="fas fa-check-circle"></i>';
    submitBtn.disabled = false;

    if (error) {
        alert("Invalid OTP! गलत OTP, कृपया दोबारा चेक करें।");
    } else {
        alert("Verification Successful! Welcome to Sanatan Capital.");
        window.location.href = "dashboard.html";
    }
});

// 1. Supabase सेटअप (आपकी Keys के साथ)
const SUPABASE_URL = 'https://wkpoubvvpvolxzlzhfgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcG91YnZ2cHZvbHh6bHpoZmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjU3NzQsImV4cCI6MjEwMDMwMTc3NH0.DncM1ytnTmeup143FkX0q0iX-F5bPBJcXi9WKhHDEO8';

// Supabase क्लाइंट चालू करना
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. फॉर्म बदलने का फंक्शन
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

// 3. रजिस्ट्रेशन: Email पर OTP भेजना
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // फॉर्म से ईमेल निकालना
    const emailInput = this.querySelector('input[type="email"]').value;
    
    // बटन को लोडिंग स्टेट में डालना
    const submitBtn = this.querySelector('button');
    submitBtn.innerHTML = 'Sending OTP... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Supabase से OTP भेजना
    const { data, error } = await supabase.auth.signInWithOtp({
        email: emailInput,
    });

    submitBtn.innerHTML = 'Register Now <i class="fas fa-arrow-right"></i>';
    submitBtn.disabled = false;

    if (error) {
        alert("❌ Error: " + error.message);
    } else {
        alert("✅ OTP sent successfully to your Email ID: " + emailInput);
        // ईमेल को सेव कर लिया ताकि OTP वेरीफाई करते समय काम आए
        sessionStorage.setItem('dsa_email', emailInput);
        switchForm('otp');
    }
});

// 4. OTP वेरीफाई करना (6-Digit)
document.getElementById('otpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const otpInput = this.querySelector('input[type="text"]').value;
    const savedEmail = sessionStorage.getItem('dsa_email');

    const submitBtn = this.querySelector('button');
    submitBtn.innerHTML = 'Verifying... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Supabase से OTP चेक करना
    const { data, error } = await supabase.auth.verifyOtp({
        email: savedEmail,
        token: otpInput,
        type: 'email'
    });

    submitBtn.innerHTML = 'Verify & Register <i class="fas fa-check-circle"></i>';
    submitBtn.disabled = false;

    if (error) {
        // अगर OTP गलत डाला तो एरर आएगा
        alert("❌ Invalid OTP! आपने गलत OTP डाला है, कृपया दोबारा चेक करें।");
    } else {
        // OTP सही होने पर डैशबोर्ड पर भेजना
        alert("🎉 Verification Successful!\n\nWelcome to Sanatan Capital. Redirecting to your Dashboard...");
        window.location.href = "dashboard.html";
    }
});

// 5. लॉगिन फ्लो (Login के लिए भी OTP भेजना)
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // अभी के लिए हम ईमेल से लॉगिन करवा रहे हैं
    const emailOrMobile = this.querySelector('input[type="text"]').value;
    
    const submitBtn = this.querySelector('button');
    submitBtn.innerHTML = 'Sending OTP... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    const { data, error } = await supabase.auth.signInWithOtp({
        email: emailOrMobile,
    });

    submitBtn.innerHTML = 'Login to Dashboard <i class="fas fa-sign-in-alt"></i>';
    submitBtn.disabled = false;

    if (error) {
        alert("❌ Error: " + error.message);
    } else {
        alert("✅ Login OTP sent to your Email!");
        sessionStorage.setItem('dsa_email', emailOrMobile);
        switchForm('otp');
    }
});

// 1. Supabase Setup
const SUPABASE_URL = 'https://wkpoubvvpvolxzlzhfgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcG91YnZ2cHZvbHh6bHpoZmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjU3NzQsImV4cCI6MjEwMDMwMTc3NH0.DncM1ytnTmeup143FkX0q0iX-F5bPBJcXi9WKhHDEO8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Form Switcher
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

// 3. Register Form Submit
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

// 4. Login Form Submit
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

// 5. OTP Verification
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

        // लीड फॉर्म खोलने और बंद करने का फंक्शन
        function openLeadModal() { document.getElementById('leadModal').style.display = 'flex'; }
        function closeLeadModal() { document.getElementById('leadModal').style.display = 'none'; }

        // KYC चेक करने वाले फंक्शन को अपडेट करें (ताकि लीड फॉर्म खुले)
        function checkKycForLead() {
            if(currentKycStatus === 'pending') {
                alert("❌ You cannot add leads yet. Please submit your KYC details first!");
                openKYCModal();
            } else if (currentKycStatus === 'submitted') {
                alert("⏳ Your KYC is pending approval from Admin. Please wait.");
            } else if (currentKycStatus === 'approved') {
                openLeadModal(); // अगर KYC डन है तो लीड फॉर्म खोलें
            }
        }

        // लोन टाइप के हिसाब से डॉक्यूमेंट बदलने का लॉजिक
        function showDocumentFields() {
            const loanType = document.getElementById('loanType').value;
            const docSection = document.getElementById('documentSection');
            const plDocs = document.getElementById('plDocs');
            const blDocs = document.getElementById('blDocs');
            const propDocs = document.getElementById('propDocs');

            // पहले सबको छुपा दें
            plDocs.style.display = 'none';
            blDocs.style.display = 'none';
            propDocs.style.display = 'none';

            if(loanType === "") {
                docSection.style.display = 'none';
            } else {
                docSection.style.display = 'block'; // कॉमन सेक्शन दिखाएं
                
                if(loanType === 'Personal Loan') {
                    plDocs.style.display = 'block';
                } else if(loanType === 'Business Loan') {
                    blDocs.style.display = 'block';
                } else if(loanType === 'Home Loan' || loanType === 'Loan Against Property') {
                    propDocs.style.display = 'block';
                }
            }
        }

        // फाइल को डेटाबेस में सेव या सबमिट करने का फंक्शन
        async function submitLead(statusType) {
            const cName = document.getElementById('custName').value;
            const cMobile = document.getElementById('custMobile').value;
            const lType = document.getElementById('loanType').value;
            const lAmt = document.getElementById('loanAmt').value;

            if(!cName || !cMobile || !lType || !lAmt) {
                alert("⚠️ Please fill all mandatory fields (Name, Mobile, Loan Type, Amount).");
                return;
            }

            // Supabase 'leads' टेबल में डेटा डालना
            const { error } = await supabaseClient
                .from('leads')
                .insert([
                    { 
                        customer_name: cName, 
                        customer_mobile: cMobile, 
                        loan_type: lType, 
                        loan_amount: lAmt, 
                        partner_email: currentUserEmail, 
                        lead_status: statusType // 'Draft' या 'Pending'
                    }
                ]);

            if (error) {
                alert("❌ Error saving lead: " + error.message);
            } else {
                if(statusType === 'Draft') {
                    alert("💾 File Saved as Draft! You can upload documents later.");
                } else {
                    alert("✅ File Submitted Successfully! Sent to Admin for review.");
                }
                document.getElementById('leadForm').reset();
                closeLeadModal();
                showDocumentFields(); // डॉक्यूमेंट सेक्शन वापस छुपाने के लिए
            }
        }

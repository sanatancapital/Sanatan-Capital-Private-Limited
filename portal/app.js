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

// Form Submit Rokne ke liye (Demo purpose)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("लॉग-इन सिस्टम जल्द ही बैकएंड से जोड़ा जाएगा!");
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("✅ आवेदन फॉर्म सबमिट हो गया। (जल्द ही एडमिन पैनल से जुड़ जाएगा)");
});

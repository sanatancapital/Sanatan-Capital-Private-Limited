document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Set Copyright Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 2. Mobile Menu Toggle (Accessibility Improved) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    const toggleMenu = (isOpen) => {
        if(isOpen) {
            navLinks.classList.add('active');
            hamburger.querySelector('i').classList.replace('fa-bars', 'fa-times');
            hamburger.setAttribute('aria-expanded', 'true');
        } else {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    };

    hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        toggleMenu(!isActive);
    });

    links.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // --- 3. Sticky Header & Scroll to Top ---
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        // Debouncing/Throttling is generally recommended for performance, 
        // but for simple class toggles on scrollY, modern browsers handle this efficiently.
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 4. Scroll Reveal Animation (Performance Optimized) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Observe once and then stop tracking for better performance
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const counterSection = document.querySelector('.why-us');
    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasCounted) {
            runCounters();
            hasCounted = true;
        }
    }, { threshold: 0.5 });
    
    if(counterSection) counterObserver.observe(counterSection);

    // --- 6. FAQ Accordion (Accessibility Improved) ---
    const faqItems = document.querySelectorAll('.faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all answers
            faqItems.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                item.setAttribute('aria-expanded', 'true');
                const answer = item.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 7. EMI Calculator Logic ---
    const amtRange = document.getElementById('emi-amount-range');
    const amtInput = document.getElementById('emi-amount');
    const rateRange = document.getElementById('emi-rate-range');
    const rateInput = document.getElementById('emi-rate');
    const tenureRange = document.getElementById('emi-tenure-range');
    const tenureInput = document.getElementById('emi-tenure');
    
    const displayEmi = document.getElementById('calc-emi');
    const displayInterest = document.getElementById('calc-interest');

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    const calculateEMI = () => {
        let p = parseFloat(amtInput.value);
        let r = parseFloat(rateInput.value) / 12 / 100;
        let n = parseFloat(tenureInput.value) * 12;

        if (p > 0 && r > 0 && n > 0) {
            let emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            let totalAmount = emi * n;
            let totalInterest = totalAmount - p;

            displayEmi.textContent = formatCurrency(Math.round(emi));
            displayInterest.textContent = formatCurrency(Math.round(totalInterest));
        } else {
            displayEmi.textContent = "₹ 0";
            displayInterest.textContent = "₹ 0";
        }
    };

    // Sync Range and Number Inputs
    const syncInputs = (range, input) => {
        range.addEventListener('input', () => {
            input.value = range.value;
            calculateEMI();
        });
        input.addEventListener('input', () => {
            range.value = input.value;
            calculateEMI();
        });
    };

    syncInputs(amtRange, amtInput);
    syncInputs(rateRange, rateInput);
    syncInputs(tenureRange, tenureInput);

    // Initial calculation setup
    calculateEMI();

    // --- 8. Modular Google Sheets Ready Lead Form Submission ---
    const applyForm = document.getElementById('loan-form');
    const formMsg = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    // To connect to Google Sheets later:
    // 1. Create a Google Apps Script Web App
    // 2. Replace 'YOUR_GOOGLE_SCRIPT_URL_HERE' with the generated Web App URL
    const googleAppScriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

    const submitLeadData = async (formData) => {
        // This function handles the actual data transmission.
        // It uses FormData, which seamlessly integrates with Google Apps Script (doPost).
        
        try {
            /* 
            // Uncomment this block when your Google Sheet Web App is ready:
            
            const response = await fetch(googleAppScriptURL, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            if(result.result === 'success') {
                return true;
            } else {
                throw new Error('Script returned error');
            }
            */
            
            // Simulating a successful network request for now
            return new Promise(resolve => setTimeout(() => resolve(true), 1500));
        } catch (error) {
            console.error("Form Submission Error: ", error);
            return false;
        }
    };

    if(applyForm) {
        applyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic UI loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Submitting securely...";
            submitBtn.disabled = true;
            formMsg.textContent = "";

            // Collect form data
            const formData = new FormData(applyForm);
            
            // Optional: You can do extra validation here if HTML5 isn't enough
            const mobile = formData.get('phone');
            if(mobile.length !== 10) {
                formMsg.textContent = "Please enter a valid 10-digit mobile number.";
                formMsg.style.color = "red";
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Transmit Data
            const success = await submitLeadData(formData);

            if (success) {
                formMsg.textContent = "Application Submitted Successfully! Our team will contact you soon.";
                formMsg.style.color = "#25D366"; // Success green
                applyForm.reset();
            } else {
                formMsg.textContent = "Something went wrong. Please try calling us directly.";
                formMsg.style.color = "red";
            }

            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear success message after 5 seconds
            setTimeout(() => { 
                if(formMsg.style.color === "rgb(37, 211, 102)" || formMsg.style.color === "#25D366") {
                    formMsg.textContent = ""; 
                }
            }, 5000);
        });
    }
});

// --- 9. Eligibility Checker Logic (Global Function for onclick) ---
window.calculateEligibility = function() {
    const income = parseFloat(document.getElementById('elig-income').value);
    const existingEmi = parseFloat(document.getElementById('elig-emi').value) || 0;
    const rate = parseFloat(document.getElementById('elig-rate').value);
    const tenure = parseFloat(document.getElementById('elig-tenure').value);
    const resultDiv = document.getElementById('elig-result');
    const maxLoanDisplay = document.getElementById('elig-max-loan');

    if (!income || income <= 0 || !rate || !tenure) {
        alert("Please enter valid income, rate, and tenure values.");
        return;
    }

    // Standard Bank Logic: Max EMI capacity is usually 50%-60% of net income
    const maxEmiCapacity = (income * 0.5) - existingEmi;

    if (maxEmiCapacity <= 0) {
        resultDiv.style.display = 'block';
        maxLoanDisplay.textContent = "Not Eligible based on current EMI obligations.";
        maxLoanDisplay.style.color = "red";
        return;
    }

    // Reverse EMI formula to find Principal (Loan Amount)
    // P = (EMI * ( (1+r)^n - 1 )) / ( r * (1+r)^n )
    const r = (rate / 12) / 100;
    const n = tenure * 12;
    const mathPow = Math.pow(1 + r, n);
    
    let maxLoan = (maxEmiCapacity * (mathPow - 1)) / (r * mathPow);

    resultDiv.style.display = 'block';
    maxLoanDisplay.style.color = "var(--primary)";
    maxLoanDisplay.textContent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Math.round(maxLoan));
};

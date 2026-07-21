document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Set Copyright Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 2. Mobile Menu Toggle ---
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

    // --- 4. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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
            const duration = 2000; 
            const increment = target / (duration / 16); 
            
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

    // --- 6. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.style.maxHeight = null;
            });

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

    const syncInputs = (range, input) => {
        if (!range || !input) return;
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

    if(amtRange && rateRange && tenureRange) {
        calculateEMI();
    }

                // --- 10. INTERCEPT TALLY FORM SUBMISSION (SMART REDIRECT & HIDE TALLY THANK YOU) ---
    window.addEventListener('message', (e) => {
        try {
            // Tally form submit hone par message bhejta hai
            const eventData = JSON.parse(e.data);
            
            if (eventData.event === 'Tally.FormSubmitted') {
                
                // Form ID का पता लगाना
                const formId = eventData.formId || (eventData.payload && eventData.payload.formId);
                
                let waText = "Hello Sanatan Capital, मैंने अभी आपकी वेबसाइट पर एक फॉर्म सबमिट किया है। कृपया मुझसे संपर्क करें।";
                let successTitle = "आवेदन सफल (Application Successful)";
                
                // अलग-अलग फॉर्म के लिए अलग-अलग मैसेज
                if (formId === 'ODe5Mk') {
                    waText = "Hello Sanatan Capital, मैंने अभी आपकी वेबसाइट पर 'लोन (Loan)' के लिए फॉर्म सबमिट किया है। कृपया इस पर मुझसे संपर्क करें।";
                    successTitle = "लोन आवेदन सफल! (Loan Applied)";
                } else if (formId === 'Y5KrMz') {
                    waText = "Hello Sanatan Capital, मैंने अभी आपकी वेबसाइट पर 'प्रॉपर्टी (Property)' के लिए फॉर्म सबमिट किया है। कृपया इस पर मुझसे संपर्क करें।";
                    successTitle = "प्रॉपर्टी आवेदन सफल! (Property Enquiry)";
                }

                // 1. सबसे पहले: Tally के फॉर्म को हटाकर Sanatan Capital का कस्टम 'Thank You' मैसेज लगा दें
                const iframes = document.querySelectorAll('iframe[src*="tally.so"]');
                iframes.forEach(iframe => {
                    const parentContainer = iframe.parentElement;
                    if (parentContainer) {
                        parentContainer.innerHTML = `
                            <div style="padding: 4rem 1rem; text-align: center; background: #ffffff; border-radius: 1rem;">
                                <i class="fas fa-check-circle" style="font-size: 4.5rem; color: #25D366; margin-bottom: 1.5rem;"></i>
                                <h2 style="font-size: 2rem; color: #0F172A; margin-bottom: 1rem;">${successTitle}</h2>
                                <p style="font-size: 1.2rem; color: #334155; font-weight: 500;">Sanatan Capital में आपका फॉर्म सफलतापूर्वक जमा हो गया है।</p>
                                <p style="color: #666; margin-top: 0.5rem; margin-bottom: 2rem; font-size: 1rem;">हमारी टीम 24 घंटे के अंदर आपसे संपर्क करेगी।</p>
                                <button onclick="window.location.reload()" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.8rem 2rem;">नया फॉर्म भरें / होम पेज</button>
                            </div>
                        `;
                    }
                });

                // 2. कस्टमर को अलर्ट दिखाकर WhatsApp पर भेजें (थोड़ा डिले देकर ताकि पीछे का नया डिज़ाइन लोड हो सके)
                setTimeout(() => {
                    alert(`✅ Sanatan Capital: आपका फॉर्म सफलतापूर्वक जमा हो गया है!\n\nअब आपको सीधा WhatsApp पर भेजा जा रहा है...`);
                    const waMessage = encodeURIComponent(waText);
                    window.location.href = `https://wa.me/919664223901?text=${waMessage}`;
                }, 400); 
            }
        } catch (error) {
            // Agar message Tally ka nahi hai, to ignore karein
        }
    });


});

// --- 9. Eligibility Checker Logic ---
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

    const maxEmiCapacity = (income * 0.5) - existingEmi;

    if (maxEmiCapacity <= 0) {
        resultDiv.style.display = 'block';
        maxLoanDisplay.textContent = "Not Eligible based on current EMI obligations.";
        maxLoanDisplay.style.color = "red";
        return;
    }

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

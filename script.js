// Sanatan Capital JavaScript

console.log("Sanatan Capital Website Loaded");

// =====================================
// EMI CALCULATOR
// =====================================

function calculateEMI() {

    let principal = parseFloat(document.getElementById("loanAmount").value);

    let annualRate = parseFloat(document.getElementById("interestRate").value);

    let tenureYears = parseFloat(document.getElementById("loanTenure").value);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureYears)) {

        alert("Please enter all values.");

        return;

    }

    let monthlyRate = annualRate / 12 / 100;

    let months = tenureYears * 12;

    let emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1);

    let totalPayment = emi * months;

    let totalInterest = totalPayment - principal;

    document.getElementById("emiValue").innerHTML =
        "₹ " + emi.toLocaleString("en-IN", {
            maximumFractionDigits: 0
        });

    document.getElementById("interestValue").innerHTML =
        "₹ " + totalInterest.toLocaleString("en-IN", {
            maximumFractionDigits: 0
        });

    document.getElementById("paymentValue").innerHTML =
        "₹ " + totalPayment.toLocaleString("en-IN", {
            maximumFractionDigits: 0
        });

}



// =====================================
// LOAN ELIGIBILITY CHECKER
// =====================================

function checkEligibility() {

    const income = parseFloat(document.getElementById("monthlyIncome").value);
    const emi = parseFloat(document.getElementById("existingEmi").value) || 0;
    const cibil = parseInt(document.getElementById("cibilScore").value);

    const result = document.getElementById("eligibilityResult");

    if (isNaN(income) || document.getElementById("employmentType").value === "") {
        result.innerHTML = "⚠ Please complete all required details.";
        result.style.color = "#d97706";
        return;
    }

    // EMI Ratio
    const emiRatio = (emi / income) * 100;

    if ((cibil >= 750 || cibil === 0) && income >= 30000 && emiRatio <= 40) {

        result.innerHTML = "✅ Congratulations! You are likely eligible for a loan.";
        result.style.color = "#16a34a";

    } else if (income >= 20000 && emiRatio <= 55) {

        result.innerHTML = "🟡 You may be eligible. Final approval depends on lender verification.";
        result.style.color = "#ca8a04";

    } else {

        result.innerHTML = "❌ Based on the information provided, eligibility appears low. Please contact our advisor.";
        result.style.color = "#dc2626";

    }

}



// =====================================
// LOAN APPLICATION FORM VALIDATION
// =====================================

document.getElementById("loanForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const mobile = document.getElementById("mobileNumber").value.trim();
    const whatsapp = document.getElementById("whatsappNumber").value.trim();
    const email = document.getElementById("emailAddress").value.trim();
    const loanType = document.getElementById("loanTypeForm").value;
    const loanAmount = document.getElementById("loanAmountForm").value;
    const employment = document.getElementById("employmentForm").value;
    const income = document.getElementById("monthlyIncomeForm").value;
    const agree = document.getElementById("agree").checked;

    if (
        fullName === "" ||
        mobile === "" ||
        loanType === "" ||
        loanAmount === "" ||
        employment === "" ||
        income === ""
    ) {
        alert("Please fill all required fields.");
        return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return;
    }

    if (whatsapp !== "" && !/^[6-9]\d{9}$/.test(whatsapp)) {
        alert("Please enter a valid WhatsApp number.");
        return;
    }

    if (
        email !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!agree) {
        alert("Please accept the consent checkbox.");
        return;
    }

    alert("✅ Thank you! Your loan enquiry has been submitted successfully.");

    document.getElementById("loanForm").reset();

});


/* ===================================
   HEADER VERSION 2.0
=================================== */

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {

    menuToggle.addEventListener("click", function () {

        navbar.classList.toggle("mobile-active");

        if (navbar.classList.contains("mobile-active")) {

            menuToggle.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

        } else {

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';

        }

    });

}


// Close menu after clicking any menu item

document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("mobile-active");

        menuToggle.innerHTML =
            '<i class="fa-solid fa-bars"></i>';

    });

});


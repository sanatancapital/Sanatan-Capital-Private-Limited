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



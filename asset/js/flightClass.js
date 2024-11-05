import { TripTime, Location, planConfig } from "./planConfig";

// In flightclass.js
let selectedClass = null;
let selectedFare = null;

// Initialize planConfig if it doesn't exist
if (typeof planConfig === 'undefined') {
    window.planConfig = {};
}
if (!planConfig.ticket) {
    planConfig.ticket = {};
}

// Add this to store the survey state
if (typeof localStorage !== 'undefined') {
    localStorage.setItem('surveyPageIndex', '6'); // Index for flightClasses page
}
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add click handlers for class tabs
    document.querySelectorAll('.class-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            document.querySelectorAll('.class-tab').forEach(t => {
                t.classList.remove('active');
            });

            // Add active class to clicked tab
            this.classList.add('active');

            // Update selection
            selectedClass = this.getAttribute('data-class');
            planConfig.ticket.classes = selectedClass;

            checkSelections();
        });
    });

    // Add click handlers for fare options
    document.querySelectorAll('.fare-option').forEach(option => {
        option.addEventListener('click', function () {
            // Remove active class from all options
            document.querySelectorAll('.fare-option').forEach(o => {
                o.classList.remove('active');
            });

            // Add active class to clicked option
            this.classList.add('active');

            // Update selection
            selectedFare = this.getAttribute('data-fare');
            planConfig.ticket.packagePlan = selectedFare;

            checkSelections();
        });
    });
});

function checkSelections() {
    const invalidFeedback = document.getElementById('invalid-feedback');
    
    if (selectedClass && selectedFare) {
        // Hide any error message
        invalidFeedback.style.display = 'none';

        // Update planConfig
        planConfig.ticket.classes = selectedClass;
        planConfig.ticket.packagePlan = selectedFare;

        // Store planConfig in localStorage
        localStorage.setItem('planConfig', JSON.stringify(planConfig));

        // Increment the page index before redirecting
        const currentIndex = parseInt(localStorage.getItem('surveyPageIndex'));
        localStorage.setItem('surveyPageIndex', (currentIndex + 1).toString());

        planConfig.debugLog();
        // Proceed to next page
        setTimeout(() => {
            
            window.location.href = './dummy.html';
            
        }, 500);
    } else {
        invalidFeedback.style.display = 'block';
        invalidFeedback.textContent = 'Please select both a flight class and a fare option.';
    }
}

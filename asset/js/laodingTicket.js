let dotsInterval = null; // Global variable to store interval ID

function animateDots() {
    const dots = document.querySelector('.dots');
    if (!dots) {
        // If dots element doesn't exist, clear the interval and return
        if (dotsInterval) {
            clearInterval(dotsInterval);
        }
        return null;
    }

    const states = ['.', '..', '...'];
    let currentState = 0;

    const interval = setInterval(() => {
        // Check if dots element still exists
        if (!document.querySelector('.dots')) {
            clearInterval(interval);
            return;
        }
        dots.textContent = states[currentState];
        currentState = (currentState + 1) % states.length;
    }, 500);

    return interval;
}

function cleanupAnimation() {
    if (dotsInterval) {
        clearInterval(dotsInterval);
        dotsInterval = null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Clean up any existing animation
    cleanupAnimation();
    
    // Only start animation if the dots element exists
    const dots = document.querySelector('.dots');
    if (dots) {
        dotsInterval = animateDots();
        
        setTimeout(() => {
            clearInterval(dotsInterval);
            dotsInterval = null;
            
            const loadingContainer = document.querySelector('.loading-container');
            if (loadingContainer) {
                loadingContainer.classList.add('fade-out');
            }
            
            setTimeout(() => {
                window.location.href = 'ticketCheck.html';
            }, 1000);
        }, 4000);
    }
});

// Clean up when leaving the page
window.addEventListener('beforeunload', cleanupAnimation);

export {animateDots}
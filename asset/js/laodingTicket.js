function animateDots() {
    const dots = document.querySelector('.dots');
    const states = ['.', '..', '...'];
    let currentState = 0;

    return setInterval(() => {
        dots.textContent = states[currentState];
        currentState = (currentState + 1) % states.length;
    }, 500); // Change dots every 500ms
}

document.addEventListener('DOMContentLoaded', function() {
    // Start dots animation
    const dotsInterval = animateDots();
    
    // Simulate loading time (replace with actual data fetching)
    setTimeout(() => {
        // Clear dots animation
        clearInterval(dotsInterval);
        
        // Add fade-out animation
        document.querySelector('.loading-container').classList.add('fade-out');
        
        // Wait for animation to complete before redirecting
        setTimeout(() => {
            window.location.href = 'ticket.html';
        }, 1000);
    }, 4000); // Adjust loading time as needed
});
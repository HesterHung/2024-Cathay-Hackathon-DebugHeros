import { planConfig } from "./planConfig";

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.option-card');
    const selectedOptions = new Set();

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const option = this.dataset.option;
            
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedOptions.delete(option);
            } else {
                this.classList.add('selected');
                selectedOptions.add(option);
            }
        });
    });

    document.querySelector('.done-btn').addEventListener('click', function() {
        // Convert Set to Array and add to planConfig
        planConfig.ticket.travelExtras = Array.from(selectedOptions);
        console.log('Selected options added to ticket:', planConfig.ticket.travelExtras);
        
        console.log('Current planConfig', planConfig);
        // You can add navigation logic here
        // window.location.href = 'next-page.html';
    });
});
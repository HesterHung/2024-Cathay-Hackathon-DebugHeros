import { planConfig } from "./planConfig";

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.option-card');
    const selectedOptions = new Set();

    // Pre-select any existing travel extras from both tickets
    const existingExtras = new Set([
        ...(planConfig.tickets.outbound[0]?.travelExtras || []),
        ...(planConfig.tickets.inbound[0]?.travelExtras || [])
    ]);

    cards.forEach(card => {
        const option = card.dataset.option;
        if (existingExtras.has(option)) {
            card.classList.add('selected');
            selectedOptions.add(option);
        }

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
        const selectedExtras = Array.from(selectedOptions);

        // Apply travel extras to both outbound and inbound tickets
        if (planConfig.tickets.outbound[0]) {
            planConfig.tickets.outbound[0].travelExtras = [...selectedExtras];
        }
        if (planConfig.tickets.inbound[0]) {
            planConfig.tickets.inbound[0].travelExtras = [...selectedExtras];
        }

        console.log('Selected options added to tickets:', selectedExtras);
        console.log('Current planConfig:', planConfig);

        planConfig.save();
        
        // Navigation logic here
        // window.location.href = 'next-page.html';
    });
});
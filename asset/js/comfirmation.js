// confirmation.js
import { planConfig } from "./planConfig.js";

document.addEventListener('DOMContentLoaded', function() {
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const getClassPackageText = (ticket) => {
        return `${ticket.class} Class ${ticket.package}`;
    };

    const getAirportDisplay = (airport) => {
        // You might want to add airport name mapping here
        return airport;
    };

    const renderConfirmation = () => {
        const outboundTicket = planConfig.tickets.outbound[0];
        const inboundTicket = planConfig.tickets.inbound[0];

        const confirmationHTML = `
            <div class="confirmation">
                <div class="flight-info from">
                    <div class="flight-header">FROM</div>
                    <div class="airport-code">${getAirportDisplay(outboundTicket.departAirport)}</div>
                    <div class="flight-details">
                        <p>(Time: decide later in ticket page)</p>
                        <p>${formatDate(outboundTicket.date)}</p>
                        <p>${getClassPackageText(outboundTicket)}</p>
                    </div>
                </div>
                <div class="flight-info to">
                    <div class="flight-header">TO</div>
                    <div class="airport-code">${getAirportDisplay(outboundTicket.arrivalAirport)}</div>
                    <div class="flight-details">
                        <p>(Time: decide later in ticket page)</p>
                        <p>${formatDate(inboundTicket.date)}</p>
                        <p>${getClassPackageText(inboundTicket)}</p>
                    </div>
                </div>
                <a href="ticket.html" class="check-ticket">Check Ticket</a>
            </div>
            <div class="photo-box">
            <img src = "img/img-comfirmation.png"></img>
            </div>
        `;

        const confirmationContainer = document.querySelector('.confirmation-container');
        if (confirmationContainer) {
            confirmationContainer.innerHTML = confirmationHTML;
        }
    };

    // Initialize the page
    try {
        renderConfirmation();

        // Add click handler for check ticket button
        document.querySelector('.check-ticket')?.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your navigation logic here
            window.location.href = 'ticket.html';
        });
    } catch (error) {
        console.error('Error initializing confirmation page:', error);
    }
});
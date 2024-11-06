import { Ticket, planConfig } from './planConfig.js';

document.addEventListener('DOMContentLoaded', function() {
    function formatDate(date) {
        try {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            return date.toLocaleDateString();
        } catch (e) {
            console.error('Error formatting date:', e);
            return 'Date not available';
        }
    }

    function formatTime(date) {
        try {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            console.error('Error formatting time:', e);
            return 'Time not available';
        }
    }

    // Get existing planConfig from localStorage
    const storedConfig = localStorage.getItem('planConfig');
    const config = storedConfig ? JSON.parse(storedConfig) : { tickets: { outbound: [], inbound: [] } };

    const departureTicket = config.tickets.outbound[0];
    const arrivalTicket = config.tickets.inbound[0];

    console.log('Departure Ticket:', departureTicket);
    console.log('Arrival Ticket:', arrivalTicket);

    if (departureTicket) {
        document.getElementById('departureAirport').textContent = departureTicket.departAirport;
        document.getElementById('departureTime').textContent = formatTime(departureTicket.date);
        document.getElementById('departureDate').textContent = formatDate(departureTicket.date);
        document.getElementById('departureClass').textContent = 
            `${departureTicket.classes} ${departureTicket.packagePlan}`.trim();
    }

    if (arrivalTicket) {
        document.getElementById('arrivalAirport').textContent = arrivalTicket.arrivalAirport;
        document.getElementById('arrivalTime').textContent = formatTime(arrivalTicket.date);
        document.getElementById('arrivalDate').textContent = formatDate(arrivalTicket.date);
        document.getElementById('arrivalClass').textContent = 
            `${arrivalTicket.classes} ${arrivalTicket.packagePlan}`.trim();
    }

    const boardingPassTemplate = (ticket, isOutbound) => {
        if (!ticket) return '';
        
        return `
            <div class="boarding-pass">
                <div class="boarding-pass-main">
                    <div>CATHAY PACIFIC ${ticket.classes?.toUpperCase() || 'ECONOMY'}</div>
                    <div>MR. MARCO POLO</div>
                    <div>${formatDate(ticket.date)}</div>
                    <div>To: ${ticket.arrivalAirport}</div>
                    <div>From: ${ticket.departAirport}</div>
                    <div>Flight No: ${ticket.flight}</div>
                    <div>Seat: 2A</div>
                </div>
                <div class="gate-section">
                    <div>Gate</div>
                    <div>22</div>
                </div>
                <div class="closure-section">
                    <div>Gate Closure</div>
                    <div>${formatTime(ticket.date)}</div>
                </div>
            </div>
        `;
    };

    const container = document.getElementById('boardingPassContainer');
    container.innerHTML = '';
    
    if (departureTicket) {
        container.innerHTML += boardingPassTemplate(departureTicket, true);
    }
    
    if (arrivalTicket) {
        container.innerHTML += boardingPassTemplate(arrivalTicket, false);
    }

    // Debug logging
    console.log('PlanConfig:', planConfig);
    console.log('Outbound Tickets:', planConfig.tickets.outbound);
    console.log('Inbound Tickets:', planConfig.tickets.inbound);
});
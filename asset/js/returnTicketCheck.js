import { planConfig } from './planConfig.js';
import { animateDots } from "./laodingTicket";

let flightDatabase = {};

async function loadFlightData() {
    try {
        const response = await fetch('sampleData/flight.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        flightDatabase = await response.json();
        console.log('Flight database loaded:', flightDatabase);
        return flightDatabase;
    } catch (error) {
        console.error('Error loading the JSON file:', error);
        throw error;
    }
}

async function fetchFlightsForDate(date) {
    if (Object.keys(flightDatabase).length === 0) {
        await loadFlightData();
    }
    
    // Assuming flightDatabase has a structure with dates as keys
    const flights = flightDatabase[date] || [];
    return { data: flights };
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load flight data when the page loads
        await loadFlightData();
        
        // Rest of your existing code...
        const departureDateObj = new Date(planConfig.tripTime.startDate);
        const minReturnDate = new Date(departureDateObj);
        minReturnDate.setDate(minReturnDate.getDate() + 1);
        
        const flightDateInput = document.getElementById('flightDate');
        flightDateInput.min = minReturnDate.toISOString().split('T')[0];
        
        if (planConfig.tripTime.returnDate) {
            flightDateInput.value = new Date(planConfig.tripTime.returnDate)
                .toISOString().split('T')[0];
        }

        // Add date change event listener to update available flights
        flightDateInput.addEventListener('change', async function(e) {
            const selectedDate = e.target.value;
            try {
                const flights = await fetchFlightsForDate(selectedDate);
                updateFlightDisplay(flights.data);
            } catch (error) {
                console.error('Error fetching flights:', error);
                alert('Unable to load flights for selected date');
            }
        });

        const confirmButton = document.querySelector('.confirm-btn');
        // ... rest of your existing confirm button code ...
    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Unable to initialize flight booking system');
    }
});

function updateFlightDisplay(flights) {
    const timeSelector = document.getElementById('timeSelector');
    const ticketContainer = document.getElementById('ticketContainer');
    
    // Clear existing content
    timeSelector.innerHTML = '';
    ticketContainer.innerHTML = '';

    // Create time options
    flights.forEach((flight, index) => {
        const timeOption = document.createElement('div');
        timeOption.className = 'time-option';
        timeOption.dataset.index = index;
        
        const departureTime = new Date(flight.flights[0].departure.time);
        const arrivalTime = new Date(flight.flights[flight.flights.length - 1].arrival.time);
        
        timeOption.innerHTML = `
            <div class="time-details">
                <span class="departure-time">${departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span class="arrival-time">${arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="price">$${flight.total_price}</div>
        `;

        timeOption.addEventListener('click', () => {
            document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
            timeOption.classList.add('selected');
            displayTicketDetails(flight);
        });

        timeSelector.appendChild(timeOption);
    });
}

function displayTicketDetails(flight) {
    const ticketContainer = document.getElementById('ticketContainer');
    ticketContainer.innerHTML = '';

    const ticketDetails = document.createElement('div');
    ticketDetails.className = 'ticket-details';
    
    // Create ticket details HTML based on flight data
    const detailsHTML = `
        <div class="flight-summary">
            <h3>Flight Details</h3>
            ${flight.flights.map(segment => `
                <div class="flight-segment">
                    <div class="segment-header">
                        <span class="flight-code">${segment.flight_code}</span>
                        <span class="class-type">${segment.class_type}</span>
                    </div>
                    <div class="segment-times">
                        <div class="departure">
                            <strong>${segment.departure.airport_code}</strong>
                            <span>${new Date(segment.departure.time).toLocaleString()}</span>
                        </div>
                        <div class="arrival">
                            <strong>${segment.arrival.airport_code}</strong>
                            <span>${new Date(segment.arrival.time).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="total-price">
                <strong>Total Price:</strong> $${flight.total_price}
            </div>
        </div>
    `;

    ticketDetails.innerHTML = detailsHTML;
    ticketContainer.appendChild(ticketDetails);
}

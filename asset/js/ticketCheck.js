import { planConfig } from "./planConfig";
import { animateDots } from "./laodingTicket";

let flightDatabase = {};
let isReturnFlight = false;

async function loadFlightData() {
    try {
        const response = await fetch('sampleData/flight.json');
        flightDatabase = await response.json();
        console.log(flightDatabase);
    } catch (error) {
        console.error('Error loading the JSON file:', error);
    }
}

async function fetchFlightsForDate(dateString) {
    try {
        const loading = document.getElementById('loading');
        loading.classList.add('active');

        await new Promise(resolve => setTimeout(resolve, 1000));

        const flights = flightDatabase[dateString];
        loading.classList.remove('active');
        return flights || { data: [] };
    } catch (error) {
        console.error('Error fetching flights:', error);
        loading.classList.remove('active');
        return { data: [] };
    }
}

function formatTime(isoTime) {
    return new Date(isoTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function createTimeOption(itinerary) {
    const div = document.createElement('div');
    div.className = 'time-option';

    const firstFlight = itinerary.flights[0];
    const lastFlight = itinerary.flights[itinerary.flights.length - 1];

    div.innerHTML = `
        <div class="time-details">
            ${formatTime(firstFlight.departure.time)} - ${formatTime(lastFlight.arrival.time)}
            <div class="small text-muted">
                ${firstFlight.departure.airport_code} → ${lastFlight.arrival.airport_code}
                (${itinerary.flights.length > 1 ? itinerary.flights.length + ' flights' : 'Direct'})
            </div>
        </div>
        <div class="price">
            ${itinerary.total_price.currency} ${itinerary.total_price.amount}
        </div>
    `;
    return div;
}

function createTicket(itinerary) {
    const ticket = document.createElement('div');
    ticket.className = 'ticket';

    let ticketHTML = '';
    itinerary.flights.forEach((flight, index) => {
        ticketHTML += `
            <div class="ticket-segment ${index > 0 ? 'mt-3' : ''}">
                <div class="ticket-header">
                    <span>
                        <i class="fas fa-plane-departure me-2"></i>
                        ${flight.airline.name}
                    </span>
                    <span class="badge bg-light text-dark">
                        ${flight.class_type.toUpperCase()}
                    </span>
                </div>
                <div class="ticket-body">
                    <div class="row g-4">
                        <div class="col-6">
                            <small>Flight</small>
                            <div>${flight.flight_code}</div>
                        </div>
                        <div class="col-6">
                            <small>Duration</small>
                            <div>${formatDuration(flight.duration)}</div>
                        </div>
                        <div class="col-6">
                            <small>From</small>
                            <div>${flight.departure.airport_code}</div>
                            <div class="small text-muted">${formatTime(flight.departure.time)}</div>
                        </div>
                        <div class="col-6">
                            <small>To</small>
                            <div>${flight.arrival.airport_code}</div>
                            <div class="small text-muted">${formatTime(flight.arrival.time)}</div>
                        </div>
                    </div>
                </div>
                <div class="terminal-section">
                    <div>Terminal ${flight.departure.terminal}</div>
                    <div>Terminal ${flight.arrival.terminal}</div>
                </div>
            </div>
        `;
    });

    // Add price badge
    ticketHTML += `
        <div class="price-badge">
            ${itinerary.total_price.currency} ${itinerary.total_price.amount}
        </div>
    `;

    ticket.innerHTML = ticketHTML;
    return ticket;
}

function updateTickets(flights, selectedIndex) {
    const ticketContainer = document.getElementById('ticketContainer');
    ticketContainer.innerHTML = '';

    const ticket = createTicket(flights[selectedIndex]);
    ticketContainer.appendChild(ticket);
}

async function updatePageForDate(dateString) {
    const timeSelector = document.getElementById('timeSelector');
    const ticketContainer = document.getElementById('ticketContainer');

    timeSelector.innerHTML = '';
    ticketContainer.innerHTML = '';

    const flights = await fetchFlightsForDate(dateString);

    if (flights.data.length === 0) {
        timeSelector.innerHTML = '<div class="alert alert-info">No flights available for this date</div>';
        return;
    }

    flights.data.forEach((flight, index) => {
        const timeOption = createTimeOption(flight);
        if (index === 0) timeOption.classList.add('selected');
        timeSelector.appendChild(timeOption);

        timeOption.addEventListener('click', () => {
            document.querySelectorAll('.time-option').forEach(opt =>
                opt.classList.remove('selected'));
            timeOption.classList.add('selected');
            updateTickets(flights.data, index);
        });
    });

    updateTickets(flights.data, 0);
}

function initializePage() {
    loadFlightData();
    const dateInput = document.getElementById('flightDate');
    
    // Modify the check to look specifically for returnTicketCheck.html
    isReturnFlight = window.location.pathname.includes('returnTicketCheck');
    console.log('Current page is return flight:', isReturnFlight); // Debug log
    
    if (isReturnFlight) {
        // Set minimum date as the day after departure
        const departureDateObj = new Date(planConfig.tripTime.startDate);
        const minReturnDate = new Date(departureDateObj);
        minReturnDate.setDate(minReturnDate.getDate() + 1);
        
        dateInput.min = minReturnDate.toISOString().split('T')[0];
        dateInput.value = planConfig.tripTime.returnDate || 
            minReturnDate.toISOString().split('T')[0];
    } else {
        // For departure flight
        const today = new Date();
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.value = planConfig.tripTime.startDate || 
            today.toISOString().split('T')[0];
    }

    dateInput.addEventListener('change', (e) => {
        updatePageForDate(e.target.value);
    });

    updatePageForDate(dateInput.value);
}


async function handleFlightSelection(selectedDate, selectedTimeOption) {
    const flights = await fetchFlightsForDate(selectedDate);
    const timeOptions = Array.from(document.querySelectorAll('.time-option'));
    const selectedIndex = timeOptions.indexOf(selectedTimeOption);
    const selectedFlight = flights.data[selectedIndex];

    if (!selectedFlight) {
        throw new Error('Selected flight data not found');
    }

    // Clear existing tickets
    planConfig.clearTickets(isReturnFlight ? 'inbound' : 'outbound');

    // Add flight segments to planConfig
    selectedFlight.flights.forEach(flight => {
        const ticket = isReturnFlight ?
            planConfig.addInboundTicket(
                flight.departure.airport_code,
                flight.arrival.airport_code,
                flight.flight_code,
                flight.departure.country === flight.arrival.country
            ) :
            planConfig.addOutboundTicket(
                flight.departure.airport_code,
                flight.arrival.airport_code,
                flight.flight_code,
                flight.departure.country === flight.arrival.country
            );

        ticket.date = new Date(flight.departure.time);
        ticket.setClassAndPackage(flight.class_type, 'standard');

        if (flight.extras) {
            flight.extras.forEach(extra => ticket.addTravelExtra(extra));
        }
    });

    // Update trip dates in planConfig
    if (isReturnFlight) {
        planConfig.tripTime.returnDate = selectedDate;
    } else {
        planConfig.tripTime.startDate = selectedDate;
    }

    planConfig.save();

    // Store ticket details
    const ticketDetails = {
        date: selectedDate,
        flights: selectedFlight.flights,
        totalPrice: selectedFlight.total_price,
        itinerary: {
            departure: {
                time: selectedFlight.flights[0].departure.time,
                airport: selectedFlight.flights[0].departure.airport_code,
                terminal: selectedFlight.flights[0].departure.terminal
            },
            arrival: {
                time: selectedFlight.flights[selectedFlight.flights.length - 1].arrival.time,
                airport: selectedFlight.flights[selectedFlight.flights.length - 1].arrival.airport_code,
                terminal: selectedFlight.flights[selectedFlight.flights.length - 1].arrival.terminal
            },
            numberOfFlights: selectedFlight.flights.length
        }
    };

    sessionStorage.setItem(
        isReturnFlight ? 'selectedReturnTicket' : 'selectedDepartureTicket', 
        JSON.stringify(ticketDetails)
    );

    return selectedFlight;
}

document.addEventListener('DOMContentLoaded', function() {
    initializePage();

    const confirmButton = document.querySelector('.confirm-btn');
    
    confirmButton.addEventListener('click', async function() {
        const selectedDate = document.getElementById('flightDate').value;
        const selectedTimeOption = document.querySelector('.time-option.selected');

        if (!selectedDate || !selectedTimeOption) {
            alert('Please select both a date and time slot');
            return;
        }

        try {
            await handleFlightSelection(selectedDate, selectedTimeOption);

            const loadingContainer = document.createElement('div');
            loadingContainer.className = 'loading-container';
            loadingContainer.innerHTML = `
                <div class="loading-text">
                    Processing your ${isReturnFlight ? 'return ' : ''}flight selection<span class="dots">...</span>
                </div>
            `;
            document.body.appendChild(loadingContainer);

            const dotsInterval = animateDots();

            // Modified redirect logic to be more explicit
            setTimeout(() => {
                clearInterval(dotsInterval);
                loadingContainer.classList.add('fade-out');
                
                setTimeout(() => {
                    const currentPage = window.location.pathname;
                    if (currentPage.includes('returnTicketCheck')) {
                        window.location.href = 'ticketConfirmation.html';
                    } else {
                        window.location.href = 'returnTicketCheck.html';
                    }
                }, 1000);
            }, 2000);

        } catch (error) {
            console.error('Error processing flight selection:', error);
            alert('There was an error processing your selection. Please try again.');
        }
    });
});
import { planConfig } from "./planConfig";

let flightDatabase = {}

async function loadFlightData() {
    try {
        const response = await fetch('sampleData/flight.json');
        flightDatabase = await response.json();
        console.log(flightDatabase); // verify the data is loaded
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

    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    dateInput.value = defaultDate;

    dateInput.addEventListener('change', (e) => {
        updatePageForDate(e.target.value);
    });

    updatePageForDate(defaultDate);
}

document.addEventListener('DOMContentLoaded', initializePage);
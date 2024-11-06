import { planConfig } from "./planConfig";

const flightDatabase = {
    "2024-11-15": {
        "data": [{
            "itinerary_id": "IT67890",
            "total_price": {
                "amount": 850.00,
                "currency": "USD"
            },
            "flights": [
                {
                    "flight_code": "AA456",
                    "departure": {
                        "airport_code": "JFK",
                        "airport_name": "John F. Kennedy International Airport",
                        "terminal": "T4",
                        "time": "2024-11-15T10:00:00Z"
                    },
                    "arrival": {
                        "airport_code": "ORD",
                        "airport_name": "Chicago O'Hare International Airport",
                        "terminal": "T3",
                        "time": "2024-11-15T12:00:00Z"
                    },
                    "duration": 120,
                    "airline": {
                        "code": "AA",
                        "name": "American Airlines"
                    },
                    "aircraft": {
                        "code": "B738",
                        "name": "Boeing 737-800"
                    },
                    "class_type": "economy",
                    "available_seats": 10,
                    "baggage_allowance": {
                        "cabin": {
                            "weight": 7,
                            "unit": "kg"
                        },
                        "checked": {
                            "weight": 23,
                            "unit": "kg"
                        }
                    }
                },
                {
                    "flight_code": "AA789",
                    "departure": {
                        "airport_code": "ORD",
                        "airport_name": "Chicago O'Hare International Airport",
                        "terminal": "T5",
                        "time": "2024-11-15T14:00:00Z"
                    },
                    "arrival": {
                        "airport_code": "LAX",
                        "airport_name": "Los Angeles International Airport",
                        "terminal": "T5",
                        "time": "2024-11-15T16:40:00Z"
                    },
                    "duration": 160,
                    "airline": {
                        "code": "AA",
                        "name": "American Airlines"
                    },
                    "aircraft": {
                        "code": "A321",
                        "name": "Airbus A321"
                    },
                    "class_type": "economy",
                    "available_seats": 20,
                    "baggage_allowance": {
                        "cabin": {
                            "weight": 7,
                            "unit": "kg"
                        },
                        "checked": {
                            "weight": 23,
                            "unit": "kg"
                        }
                    }
                }
            ]
        }]
    },
    "2024-11-16": {
        "data": [{
            "itinerary_id": "IT67891",
            "total_price": {
                "amount": 1250.00,
                "currency": "USD"
            },
            "flights": [{
                "flight_code": "AA123",
                "departure": {
                    "airport_code": "JFK",
                    "airport_name": "John F. Kennedy International Airport",
                    "terminal": "T8",
                    "time": "2024-11-16T08:00:00Z"
                },
                "arrival": {
                    "airport_code": "LAX",
                    "airport_name": "Los Angeles International Airport",
                    "terminal": "T4",
                    "time": "2024-11-16T11:30:00Z"
                },
                "duration": 330,
                "airline": {
                    "code": "AA",
                    "name": "American Airlines"
                },
                "aircraft": {
                    "code": "B777",
                    "name": "Boeing 777-300ER"
                },
                "class_type": "business",
                "available_seats": 5,
                "baggage_allowance": {
                    "cabin": {
                        "weight": 10,
                        "unit": "kg"
                    },
                    "checked": {
                        "weight": 32,
                        "unit": "kg"
                    }
                }
            }]
        }]
    },
    "2024-11-16": {
        "data": [
            {
                "flights": [
                    {
                        "airline": {
                            "name": "United Airlines",
                            "code": "UA"
                        },
                        "flight_code": "UA1234",
                        "class_type": "economy",
                        "duration": 180,
                        "departure": {
                            "airport_code": "JFK",
                            "terminal": "4",
                            "time": "2024-11-16T06:30:00"
                        },
                        "arrival": {
                            "airport_code": "LAX",
                            "terminal": "5",
                            "time": "2024-11-16T09:30:00"
                        }
                    }
                ],
                "total_price": {
                    "currency": "USD",
                    "amount": "299"
                }
            },
            {
                "flights": [
                    {
                        "airline": {
                            "name": "Delta Airlines",
                            "code": "DL"
                        },
                        "flight_code": "DL2468",
                        "class_type": "business",
                        "duration": 195,
                        "departure": {
                            "airport_code": "JFK",
                            "terminal": "2",
                            "time": "2024-11-16T10:15:00"
                        },
                        "arrival": {
                            "airport_code": "LAX",
                            "terminal": "3",
                            "time": "2024-11-16T13:30:00"
                        }
                    }
                ],
                "total_price": {
                    "currency": "USD",
                    "amount": "689"
                }
            },
            {
                "flights": [
                    {
                        "airline": {
                            "name": "American Airlines",
                            "code": "AA"
                        },
                        "flight_code": "AA3456",
                        "class_type": "economy",
                        "duration": 120,
                        "departure": {
                            "airport_code": "JFK",
                            "terminal": "8",
                            "time": "2024-11-16T14:00:00"
                        },
                        "arrival": {
                            "airport_code": "ORD",
                            "terminal": "3",
                            "time": "2024-11-16T16:00:00"
                        }
                    },
                    {
                        "airline": {
                            "name": "American Airlines",
                            "code": "AA"
                        },
                        "flight_code": "AA3789",
                        "class_type": "economy",
                        "duration": 240,
                        "departure": {
                            "airport_code": "ORD",
                            "terminal": "3",
                            "time": "2024-11-16T17:00:00"
                        },
                        "arrival": {
                            "airport_code": "LAX",
                            "terminal": "4",
                            "time": "2024-11-16T21:00:00"
                        }
                    }
                ],
                "total_price": {
                    "currency": "USD",
                    "amount": "445"
                }
            }
        ]
    }
};

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
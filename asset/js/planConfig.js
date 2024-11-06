// Class definitions
class Location {
    constructor(country, city) {
        this.country = country;
        this.city = city;
    }

    getFullLocation() {
        return `${this.city}, ${this.country}`;
    }
}

class TripTime {
    constructor(startDate, returnDate) {
        // Convert string dates to Date objects if needed
        this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
        this.returnDate = returnDate instanceof Date ? returnDate : new Date(returnDate);
    }

    getTripTime() {
        return `${this.startDate}, ${this.returnDate}`;
    }
    
    getDayLength() {
        const timeDiff = this.returnDate.getTime() - this.startDate.getTime();
        const dayLength = timeDiff / (1000 * 3600 * 24);
        return dayLength;
    }
}


class Ticket {
    constructor(type = 'departure') { // type can be 'departure' or 'return'
        this.type = type;
        this.date = new Date();
        this.flight = "";
        this.departAirport = "";
        this.arrivalAirport = "";
        this.classes = "";
        this.packagePlan = "";
        this.travelExtras = [];
        this.isDomestic = false; // to identify domestic flights
    }

    setFlightDetails(departAirport, arrivalAirport, isDomestic = false) {
        this.departAirport = departAirport;
        this.arrivalAirport = arrivalAirport;
        this.isDomestic = isDomestic;
    }

    setClassAndPackage(classes, packagePlan) {
        this.classes = classes;
        this.packagePlan = packagePlan;
    }

    addTravelExtra(extra) {
        this.travelExtras.push(extra);
    }
}

class PlanConfig {
    constructor() {
        try {
            const savedConfig = localStorage.getItem('planConfig');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                this.userID = parsed.userID || "";
                this.location = new Location(parsed.location?.country || "Unknown", parsed.location?.city || "Unknown");
                this.tripTime = new TripTime(
                    parsed.tripTime?.startDate,
                    parsed.tripTime?.returnDate
                );
                // Initialize tickets array
                this.tickets = {
                    outbound: [], // Array for outbound journey (can include domestic connections)
                    inbound: []   // Array for return journey (can include domestic connections)
                };
                
                // Restore tickets if they exist
                if (parsed.tickets) {
                    if (parsed.tickets.outbound) {
                        this.tickets.outbound = parsed.tickets.outbound.map(t => Object.assign(new Ticket('departure'), t));
                    }
                    if (parsed.tickets.inbound) {
                        this.tickets.inbound = parsed.tickets.inbound.map(t => Object.assign(new Ticket('return'), t));
                    }
                }
                
                this.dayLength = this.tripTime.getDayLength();
                this.totalBudget = parsed.totalBudget || 0;
            } else {
                this.initializeDefaults();
            }
        } catch (e) {
            console.error('Error initializing PlanConfig:', e);
            this.initializeDefaults();
        }
    }

    initializeDefaults() {
        this.userID = "";
        this.location = new Location("Unknown", "Unknown");
        this.tripTime = new TripTime(new Date(), new Date());
        this.tickets = {
            outbound: [],
            inbound: []
        };
        this.dayLength = 0;
        this.totalBudget = 0;
    }

    // Add a new ticket for outbound journey
    addOutboundTicket(departAirport, arrivalAirport, isDomestic = false) {
        const ticket = new Ticket('departure');
        ticket.setFlightDetails(departAirport, arrivalAirport, isDomestic);
        ticket.date = new Date(this.tripTime.startDate); // Set to departure date
        this.tickets.outbound.push(ticket);
        return ticket;
    }

    // Add a new ticket for return journey
    addInboundTicket(departAirport, arrivalAirport, isDomestic = false) {
        const ticket = new Ticket('return');
        ticket.setFlightDetails(departAirport, arrivalAirport, isDomestic);
        ticket.date = new Date(this.tripTime.returnDate); // Set to return date
        this.tickets.inbound.push(ticket);
        return ticket;
    }

    // Remove a ticket
    removeTicket(journeyType, index) {
        if (this.tickets[journeyType] && this.tickets[journeyType][index]) {
            this.tickets[journeyType].splice(index, 1);
        }
    }

    // Clear all tickets for a journey type
    clearTickets(journeyType) {
        if (this.tickets[journeyType]) {
            this.tickets[journeyType] = [];
        }
    }

    save() {
        try {
            const configData = {
                userID: this.userID,
                location: this.location,
                tripTime: {
                    startDate: this.tripTime?.startDate instanceof Date ? 
                        this.tripTime.startDate.toISOString() : 
                        new Date().toISOString(),
                    returnDate: this.tripTime?.returnDate instanceof Date ? 
                        this.tripTime.returnDate.toISOString() : 
                        new Date().toISOString()
                },
                tickets: this.tickets,
                dayLength: this.tripTime?.getDayLength() || 0,
                totalBudget: this.totalBudget
            };
            localStorage.setItem('planConfig', JSON.stringify(configData));
        } catch (e) {
            console.error('Error saving PlanConfig:', e);
        }
    }


    reset() {
        localStorage.removeItem('planConfig');
        this.userID = "";
        this.location = new Location("Unknown", "Unknown");
        this.tripTime = new TripTime(new Date(), new Date());
        this.ticket = new Ticket();
        this.dayLength = 0;
        this.totalBudget = 0;
    }
}

// Usage example:
/*
// Adding outbound tickets (including domestic connection)
planConfig.addOutboundTicket('LAX', 'JFK', true); // Domestic flight
planConfig.addOutboundTicket('JFK', 'LHR'); // International flight

// Adding return tickets
planConfig.addInboundTicket('LHR', 'JFK'); // International flight
planConfig.addInboundTicket('JFK', 'LAX', true); // Domestic flight

// Accessing tickets
console.log(planConfig.tickets.outbound); // Array of outbound tickets
console.log(planConfig.tickets.inbound); // Array of return tickets

// Save configuration
planConfig.save();
*/

// Create singleton instance
const planConfig = new PlanConfig();

// Make it globally available
window.planConfig = planConfig;

export { Location, TripTime, Ticket, planConfig };
//OBJECT CREATION
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
    constructor(departureDate, returnDate) {
        this.departureDate = departureDate;
        this.returnDate = returnDate;
    }

    getTripTime() {
        return `${this.departureDate}, ${this.returnDate}`;
    }
    getDayLength() {
        const timeDiff = this.returnDate - this.departureDate;
        const dayLength = timeDiff / (1000 * 3600 * 24);
        return dayLength;
    }
}

class Ticket {
    constructor() {
        this.date = new Date();
        this.flight = "";
        this.departAirport = "";
        this.arrivalAirport = "";
        this.classes = "";
        this.packagePlan = "";
        this.travelExtras = [];
    }

    setFlightDetails(departAirport, arrivalAirport) {
        this.departAirport = departAirport;
        this.arrivalAirport = arrivalAirport;
    }

    setClassAndPackage(classes, packagePlan) {
        this.classes = classes;
        this.packagePlan = packagePlan;
    }

    addTravelExtra(extra) {
        this.travelExtras.push(extra);
    }
}

const defaultLocation = new Location("Unknown", "Unknown");
const defaultTripTime = new TripTime("2024-01-01", "2024-01-01");
const defaultTicket = new Ticket();

const planConfig = {
    userID: "",
    location: defaultLocation,
    tripTime: defaultTripTime,
    ticket: defaultTicket,
    dayLength: 0,
    totalBudget: 0,

    // Method to export properties to JSON
    toJSON() {
        return JSON.stringify({
            userID: this.userID,
            location: this.location,
            tripTime: {
                departureDate: this.tripTime.departureDate,
                returnDate: this.tripTime.returnDate,
                dayLength: this.tripTime.getDayLength(),
            },
            ticket: this.ticket,
            totalBudget: this.totalBudget,
        });
    }
}

function debugLog(obj, indent = 0) {
    const spacing = ' '.repeat(indent);
    
    for (let key in obj) {
        if (obj[key] === null) {
            console.log(`${spacing}${key}: null`);
        }
        else if (obj[key] === undefined) {
            console.log(`${spacing}${key}: undefined`);
        }
        else if (Array.isArray(obj[key])) {
            console.log(`${spacing}${key}: [${obj[key]}]`);
        }
        else if (typeof obj[key] === 'object' && obj[key] instanceof Date) {
            console.log(`${spacing}${key}: ${obj[key].toISOString()}`);
        }
        else if (typeof obj[key] === 'object') {
            console.log(`${spacing}${key}:`);
            debugLog(obj[key], indent + 2);
        }
        else if (typeof obj[key] === 'function') {
            console.log(`${spacing}${key}: [Function]`);
        }
        else {
            console.log(`${spacing}${key}: ${obj[key]}`);
        }
    }
}

// Usage example:
console.log('=== Plan Configuration Debug Log ===');
debugLog(planConfig);

export { Location, TripTime, Ticket, planConfig }
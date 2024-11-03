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

export { Location, TripTime, Ticket, planConfig }
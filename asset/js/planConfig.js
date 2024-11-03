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

const defaultLocation = new Location("Unknown", "Unknown");

class Airport {
    constructor(fromAirport, toAirport) {
        this.fromAirport = fromAirport;
        this.toAirport = toAirport;
    }

    getFullAirport() {
        return `${this.fromAirport}, ${this.toAirport}`;
    }
}
const defaultAirport = new Airport("Unknown", "Unknown");

class TripTime {
    constructor(departureDate, returnDate) {
        this.departureDate = departureDate;
        this.returnDate = returnDate;
    }

    getTripTime() {
        return `${this.departureDate}, ${this.returnDate}`;
    }
    getDayLength() {
        const timeDiff = this.returnDate - this.departureDate; // Difference in milliseconds
        const dayLength = timeDiff / (1000 * 3600 * 24); // Convert to days
        return dayLength;
    }
}
const defaultTripTime = new Location("2024-01-01", "2024-01-01");


const planConfig = {
    userID: "",
    location: defaultLocation,
    airport: defaultAirport,
    tripTime: defaultTripTime,
    dayLength: 0,
    totalBudget: 0,

    // Method to export properties to JSON
    toJSON() {
        return JSON.stringify({
            userID: this.userID,
            location: this.location,
            airport: this.airport,
            tripTime: {
                departureDate: this.tripTime.departureDate,
                returnDate: this.tripTime.returnDate,
                dayLength: this.tripTime.getDayLength(),
            },
            totalBudget: this.totalBudget,
        });
    }
}

export {Location, TripTime, planConfig}
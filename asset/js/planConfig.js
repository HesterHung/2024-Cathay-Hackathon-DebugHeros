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
                this.ticket = Object.assign(new Ticket(), parsed.ticket);
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
        this.ticket = new Ticket();
        this.dayLength = 0;
        this.totalBudget = 0;
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
                ticket: this.ticket,
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

// Create singleton instance
const planConfig = new PlanConfig();

// Make it globally available
window.planConfig = planConfig;

export { Location, TripTime, Ticket, planConfig };
import { writeFileSync } from 'fs';

function generateFlightData(startDate, endDate) {
    const airlines = [
        { code: "CX", name: "Cathay Pacific" },
        { code: "KA", name: "Cathay Dragon" },
        { code: "HX", name: "Hong Kong Airlines" },
        { code: "JL", name: "Japan Airlines" },
        { code: "NH", name: "All Nippon Airways" }
    ];

    const airports = [
        { code: "HKG", name: "Hong Kong International Airport" },
        { code: "NRT", name: "Narita International Airport" },
        { code: "HND", name: "Haneda Airport" },
        { code: "KIX", name: "Kansai International Airport" },
        { code: "ITM", name: "Osaka International Airport" }
    ];

    const classTypes = ["economy", "premium_economy", "business", "first"];
    const terminals = ["T1", "T2", "T3", "T4"];

    function randomPrice() {
        // Generate price between HKD 3000 and HKD 15000
        return Math.floor(Math.random() * 12000 + 3000);
    }

    function generateFlightCode(airline) {
        return `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`;
    }

    function addHours(date, hours) {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    }

    function formatDate(date) {
        return date.toISOString().split('.')[0] + 'Z';
    }

    function generateItinerary(date) {
        const itineraryCount = Math.floor(Math.random() * 2) + 2; // 2-3 itineraries per day
        const itineraries = [];

        for (let i = 0; i < itineraryCount; i++) {
            const hasLayover = Math.random() > 0.5; // 50% chance of layover
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const departureAirport = airports[0]; // HKG is always departure
            const arrivalAirport = airports[Math.floor(Math.random() * (airports.length - 1)) + 1];
            const classType = classTypes[Math.floor(Math.random() * classTypes.length)];

            const baseTime = new Date(date);
            baseTime.setHours(Math.floor(Math.random() * 14) + 6); // Flights between 6 AM and 8 PM

            const flights = [];
            if (hasLayover) {
                // First flight
                const layoverAirport = airports[Math.floor(Math.random() * (airports.length - 1)) + 1];
                const firstDuration = Math.floor(Math.random() * 2) + 2; // 2-3 hours
                flights.push({
                    flight_code: generateFlightCode(airline),
                    departure: {
                        airport_code: departureAirport.code,
                        airport_name: departureAirport.name,
                        terminal: terminals[Math.floor(Math.random() * terminals.length)],
                        time: formatDate(baseTime)
                    },
                    arrival: {
                        airport_code: layoverAirport.code,
                        airport_name: layoverAirport.name,
                        terminal: terminals[Math.floor(Math.random() * terminals.length)],
                        time: formatDate(addHours(baseTime, firstDuration))
                    },
                    duration: firstDuration * 60,
                    airline: airline,
                    class_type: classType
                });

                // Second flight
                const layoverTime = 2; // 2 hours layover
                const secondDuration = Math.floor(Math.random() * 2) + 2; // 2-3 hours
                const secondFlightTime = addHours(baseTime, firstDuration + layoverTime);
                flights.push({
                    flight_code: generateFlightCode(airline),
                    departure: {
                        airport_code: layoverAirport.code,
                        airport_name: layoverAirport.name,
                        terminal: terminals[Math.floor(Math.random() * terminals.length)],
                        time: formatDate(secondFlightTime)
                    },
                    arrival: {
                        airport_code: arrivalAirport.code,
                        airport_name: arrivalAirport.name,
                        terminal: terminals[Math.floor(Math.random() * terminals.length)],
                        time: formatDate(addHours(secondFlightTime, secondDuration))
                    },
                    duration: secondDuration * 60,
                    airline: airline,
                    class_type: classType
                });
            } else {
                // Direct flight
                const duration = Math.floor(Math.random() * 3) + 3; // 3-5 hours
                flights.push({
                    flight_code: generateFlightCode(airline),
                    departure: {
                        airport_code: departureAirport.code,
                        airport_name: departureAirport.name,
                        terminal: terminals[Math.floor(Math.random() * terminals.length)],
                        time: formatDate(baseTime)
                    },
                    arrival: {
                        airport_code: arrivalAirport.code,
                        airport_name: arrivalAirport.name,
                        terminal: terminals[Math.floor(Math.random() * terminals.length)],
                        time: formatDate(addHours(baseTime, duration))
                    },
                    duration: duration * 60,
                    airline: airline,
                    class_type: classType
                });
            }

            itineraries.push({
                itinerary_id: `IT${Math.floor(Math.random() * 90000) + 10000}`,
                total_price: {
                    amount: randomPrice(),
                    currency: "HKD"
                },
                flights: flights
            });
        }

        return itineraries;
    }

    const result = {};
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate <= endDateTime) {
        const dateString = currentDate.toISOString().split('T')[0];
        result[dateString] = {
            data: generateItinerary(currentDate)
        };
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
}

// Generate data for specific dates
const data = generateFlightData('2024-11-07', '2024-11-14');

// Save to file (if using Node.js)
writeFileSync('flight_data.json', JSON.stringify(data, null, 2));

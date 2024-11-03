// Sample data structure - in real application, this would come from an API
const packageData = {
    hotels: [
        {
            name: "xxx Hotel",
            price: 789,
            rating: 4,
            bonus: "A34617",
            image: "hotel1.jpg"
        },
        {
            name: "xxx Hotel",
            price: 789,
            rating: 4,
            bonus: "A34617",
            insurance: {
                price: 3712,
                bonus: "A22437"
            },
            image: "hotel2.jpg"
        }
    ],
    itinerary: [
        { title: "Check In at xxx Hotel" },
        { title: "Transportation" },
        { title: "Activity 2" }
    ],
    flights: {
        outbound: {
            from: "HKG",
            to: "HND",
            date: "12/1/2025",
            time: "19:40",
            class: "Economy",
            type: "Flex",
            flightNo: "CX489"
        },
        inbound: {
            from: "HND",
            to: "HKG",
            date: "20/1/2025",
            time: "19:40",
            class: "Economy",
            type: "Flex",
            flightNo: "CX639"
        }
    }
};

function renderStars(count) {
    return "★".repeat(count) + "☆".repeat(5 - count);
}

function renderHotelPackage(hotel) {
    const packageElement = document.createElement('div');
    packageElement.className = 'hotel-card';
    packageElement.innerHTML = `
        <div class="row">
            <div class="col-md-9">
                <div class="star">${renderStars(hotel.rating)}</div>
                <h4>${hotel.name}</h4>
                <div class="price">$ ${hotel.price}</div>
                <div class="bonus-miles">From ${hotel.bonus} bonus Asia Miles for the first passenger</div>
                ${hotel.insurance ? `
                    <hr>
                    <div>Travel Insurance</div>
                    <div class="price">$ ${hotel.insurance.price}</div>
                    <div class="bonus-miles">From ${hotel.insurance.bonus} bonus Asia Miles for the first passenger</div>
                ` : ''}
            </div>
            <div class="col-md-3">
                <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image">
            </div>
        </div>
    `;
    return packageElement;
}

function renderItinerary(items) {
    const container = document.getElementById('itineraryContainer');
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="me-2">—</span>
                <span>${item.title}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderFlights(flights) {
    const container = document.getElementById('flightContainer');
    container.innerHTML = `
        <div class="col-md-6">
            <div class="flight-info">
                <h5>${flights.outbound.from} → ${flights.outbound.to}</h5>
                <div class="row">
                    <div class="col-md-8">
                        <div>Date: ${flights.outbound.date}</div>
                        <div>Time: ${flights.outbound.time}</div>
                        <div>${flights.outbound.class} ${flights.outbound.type}</div>
                        <div>Flight No. ${flights.outbound.flightNo}</div>
                    </div>
                    <div class="col-md-4">
                        <img src="ticket.jpg" class="ticket-image">
                    </div>
                </div>
                <button class="btn btn-outline-custom mt-2">choose another ticket</button>
                <button class="btn btn-outline-custom mt-2">SAVE Ticket to My Planner</button>
            </div>
        </div>
        <div class="col-md-6">
            <div class="flight-info">
                <h5>${flights.inbound.from} → ${flights.inbound.to}</h5>
                <div class="row">
                    <div class="col-md-8">
                        <div>Date: ${flights.inbound.date}</div>
                        <div>Time: ${flights.inbound.time}</div>
                        <div>${flights.inbound.class} ${flights.inbound.type}</div>
                        <div>Flight No. ${flights.inbound.flightNo}</div>
                    </div>
                    <div class="col-md-4">
                        <img src="ticket.jpg" class="ticket-image">
                    </div>
                </div>
                <button class="btn btn-outline-custom mt-2">choose another ticket</button>
                <button class="btn btn-custom mt-2">Claim & Purchase Your Ticket</button>
            </div>
        </div>
    `;
}

function renderBannerImg() {
    const bannerImg = document.getElementById("banner-img");
    if (!bannerImg) {
        console.error("Banner image element not found");
        return;
    }
    bannerImg.src = '../img/temp-banner-plan.png';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const packageContainer = document.getElementById('packageContainer');
    packageData.hotels.forEach(hotel => {
        packageContainer.appendChild(renderHotelPackage(hotel));
    });

    renderItinerary(packageData.itinerary);
    renderFlights(packageData.flights);
    renderBannerImg();
});

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

const updatedPackageData = {
    ...packageData,
    itinerary: [
        { 
            time: "MORNING",
            items: [
                { title: "Check In at xxx Hotel", type: "event" },
                { title: "Take the subway to Asakusa station", type: "transport" },
                { title: "Visit Sensoji Temple, one of Tokyo's most famous temples. Explore the Nakamise shopping street leading up to the temple.", type: "event" },
                { title: "Walk to the Sumida River and board a sightseeing cruise boat. Enjoy views of the city skyline and landmarks along the river.\nBook on: Klook", type: "event" },
                { title: "Disembark the river cruise and have lunch at one of the restaurants in the Asakusa district.", type: "event" }
            ]
        },
        {
            time: "AFTERNOON",
            items: []
        },
        {
            time: "EVENING",
            items: []
        }
    ]
};

class ItineraryManager {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.draggedItem = null;
        this.render();
        this.initializeDragAndDrop();
    }

    render() {
        this.container.innerHTML = `
            <div class="itinerary-section">
                <div class="toggle-group">
                    <div class="toggle-item active">
                        <span class="toggle-circle"></span>
                        <span>Event</span>
                    </div>
                    <div class="toggle-item">
                        <span class="toggle-circle"></span>
                        <span>Transportation</span>
                    </div>
                </div>
                ${this.data.itinerary.map(section => `
                    <div class="time-section" data-time="${section.time}">
                        <div class="time-header">${section.time}</div>
                        <div class="items-container">
                            ${section.items.map((item, index) => this.renderItem(item, index)).join('')}
                        </div>
                        <div class="custom-event-input">
                            <button class="add-event-btn">+</button>
                            <input type="text" placeholder="Enter customized event here">
                            <button class="location-btn">📍</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.attachEventListeners();
    }

    renderItem(item, index) {
        return `
            <div class="itinerary-item ${item.type || ''}" 
                 draggable="true" 
                 data-index="${index}">
                <div class="drag-handle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="item-content">${item.title}</div>
                <div class="action-icon">☰</div>
            </div>
        `;
    }

    initializeDragAndDrop() {
        const items = this.container.querySelectorAll('.itinerary-item');
        const containers = this.container.querySelectorAll('.items-container');
    
        items.forEach(item => {
            const dragHandle = item.querySelector('.drag-handle');
            
            // Only initiate drag when clicking the drag handle
            dragHandle.addEventListener('mousedown', () => {
                item.draggable = true;
            });
            
            item.addEventListener('mouseup', () => {
                item.draggable = false;
            });
    
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = item;
                item.classList.add('dragging');
            });
    
            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                this.draggedItem = null;
            });
        });
    
        containers.forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(container, e.clientY);
                if (this.draggedItem) {
                    if (afterElement) {
                        container.insertBefore(this.draggedItem, afterElement);
                    } else {
                        container.appendChild(this.draggedItem);
                    }
                }
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.itinerary-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    attachEventListeners() {
        // Toggle buttons
        const toggles = this.container.querySelectorAll('.toggle-item');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
            });
        });

        // Custom event inputs
        const customEventInputs = this.container.querySelectorAll('.custom-event-input');
        customEventInputs.forEach(inputContainer => {
            const input = inputContainer.querySelector('input');
            const addBtn = inputContainer.querySelector('.add-event-btn');
            const locationBtn = inputContainer.querySelector('.location-btn');
            const timeSection = inputContainer.closest('.time-section');
            const itemsContainer = timeSection.querySelector('.items-container');

            addBtn.addEventListener('click', () => {
                if (input.value.trim()) {
                    const newItem = {
                        title: input.value.trim(),
                        type: 'event'
                    };
                    
                    const itemElement = document.createElement('div');
                    itemElement.innerHTML = this.renderItem(newItem, itemsContainer.children.length);
                    itemsContainer.appendChild(itemElement.firstElementChild);
                    
                    input.value = '';
                    this.initializeDragAndDrop();
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addBtn.click();
                }
            });

            locationBtn.addEventListener('click', () => {
                // Implement location selection functionality
                console.log('Location selection clicked');
            });
        });
    }
}

// Update the initialization
document.addEventListener('DOMContentLoaded', () => {
    initializePackageSelector();
    new ItineraryManager('itineraryContainer', updatedPackageData);
    renderFlights(packageData.flights);
    renderBannerImg();
});

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

function initializePackageSelector() {
    const selectedPackage = document.querySelector('.selected-package');
    const packageOptions = document.querySelector('.package-options');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    let isOpen = false;

    // Set initial arrow state
    dropdownToggle.textContent = '▼';

    // Show initial selected package (first one)
    if (packageData.hotels.length > 0) {
        selectedPackage.appendChild(renderHotelPackage(packageData.hotels[0]));
    }

    // Clear and render options
    packageOptions.innerHTML = '';
    packageData.hotels.forEach(hotel => {
        packageOptions.appendChild(renderHotelPackage(hotel));
    });

    // Toggle dropdown
    function toggleDropdown(event) {
        event.stopPropagation();
        isOpen = !isOpen;
        packageOptions.style.display = isOpen ? 'block' : 'none';
        dropdownToggle.textContent = isOpen ? '▲' : '▼';
    }

    // Add click events
    dropdownToggle.addEventListener('click', toggleDropdown);
    selectedPackage.addEventListener('click', toggleDropdown);

    // Handle option selection
    packageOptions.addEventListener('click', (e) => {
        const hotelCard = e.target.closest('.hotel-card');
        if (hotelCard) {
            selectedPackage.innerHTML = '';
            selectedPackage.appendChild(hotelCard.cloneNode(true));
            isOpen = false;
            packageOptions.style.display = 'none';
            dropdownToggle.textContent = '▼';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.package-dropdown')) {
            isOpen = false;
            packageOptions.style.display = 'none';
            dropdownToggle.textContent = '▼';
        }
    });
}

class TripPlanner {
    constructor() {
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');
        this.dayButtonsContainer = document.getElementById('dayButtonsContainer');
        this.prevDayBtn = document.getElementById('prevDay');
        this.nextDayBtn = document.getElementById('nextDay');
        
        this.currentDay = 1;
        this.totalDays = 0;

        this.initializeEventListeners();
        this.loadSavedDates();
    }

    initializeEventListeners() {
        this.startDateInput.addEventListener('change', () => this.handleDateChange());
        this.endDateInput.addEventListener('change', () => this.handleDateChange());
        this.prevDayBtn.addEventListener('click', () => this.navigateDay('prev'));
        this.nextDayBtn.addEventListener('click', () => this.navigateDay('next'));
    }

    loadSavedDates() {
        const savedStartDate = localStorage.getItem('tripStartDate');
        const savedEndDate = localStorage.getItem('tripEndDate');
        const savedCurrentDay = localStorage.getItem('currentDay');

        if (savedStartDate && savedEndDate) {
            this.startDateInput.value = savedStartDate;
            this.endDateInput.value = savedEndDate;
            this.currentDay = savedCurrentDay ? parseInt(savedCurrentDay) : 1;
            this.handleDateChange();
        }
    }

    handleDateChange() {
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);

        if (startDate && endDate && startDate <= endDate) {
            const diffTime = Math.abs(endDate - startDate);
            this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            localStorage.setItem('tripStartDate', this.startDateInput.value);
            localStorage.setItem('tripEndDate', this.endDateInput.value);
            
            this.generateDayButtons();
            this.selectDay(this.currentDay);
        }
    }

    generateDayButtons() {
        this.dayButtonsContainer.innerHTML = '';
        
        for (let i = 1; i <= this.totalDays; i++) {
            const button = document.createElement('button');
            button.className = 'day-btn';
            button.textContent = `DAY ${i}`;
            button.addEventListener('click', () => this.selectDay(i));
            this.dayButtonsContainer.appendChild(button);
        }
    }

    selectDay(day) {
        if (day < 1 || day > this.totalDays) return;
        
        this.currentDay = day;
        localStorage.setItem('currentDay', day);
        
        const buttons = this.dayButtonsContainer.querySelectorAll('.day-btn');
        buttons.forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === day);
        });

        // Center the selected button
        const activeButton = this.dayButtonsContainer.querySelector('.active');
        if (activeButton) {
            activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Update navigation buttons
        this.prevDayBtn.disabled = day === 1;
        this.nextDayBtn.disabled = day === this.totalDays;

        // Load saved data for the selected day
        this.loadDayData(day);
    }

    navigateDay(direction) {
        const newDay = direction === 'prev' ? this.currentDay - 1 : this.currentDay + 1;
        if (newDay >= 1 && newDay <= this.totalDays) {
            this.selectDay(newDay);
        }
    }

    loadDayData(day) {
        const savedData = localStorage.getItem(`day${day}Data`);
        if (savedData) {
            // Implement your data loading logic here
            console.log(`Loading data for day ${day}`);
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializePackageSelector();
    const tripPlanner = new TripPlanner();
    new ItineraryManager('itineraryContainer', updatedPackageData);
    renderFlights(packageData.flights);
    renderBannerImg();
});
import { TripTime, Location, planConfig } from "./planConfig";

//GET ELEMENT
let inputElement = document.getElementById('inputFormBox');
let dataListElement = document.getElementById('dataListBox');
let questionTextElement = document.getElementById('questionText');
let invalidFeedback = document.getElementById('invalid-feedback');
let nextBtn = document.getElementById("btn-next");
let backBtn = document.getElementById("btn-back");
let formGroup = document.querySelector('.form-group');

//GLOBAL VARIABLE
const pageSets = ["departCountries", "departAirport", "arrivalCountries", "toCity", "arrivalAirport", "tripTime", "flightClasses", "travelExtra"];
let pageIndex = 0;
let currentPage;
//ARRAY
const apiLinks = {
    departCountries: 'https://api.example.com/countries',
    departAirport: 'https://api.example.com/countries',
    arrivalCountries: 'https://api.example.com/countries',
    cities: 'https://api.example.com/cities',
    arrialAirport: 'https://api.example.com/airlines',
};

const questionSet = {
    departCountries: 'Which country/ region would you depart form?',
    departAirport: "Which airport will you depart from?",
    arrivalCountries: 'Which country/ region do you want to travel?',
    toCity: "Which city do you wanna travel?",
    arrivalAirport: 'Which airport do you wanna land on?',
    tripTime: "When do you want your trip to start and end?",
    flightClasses: "Which flight classes would you want?",
    travelExtra: "Any Travel extra need for your trip? ",

}

const invalidFeedbackSet = {
    departCountries: 'Please select a country/region from the list.',
    departAirport: "Please select a airport from the list",
    arrivalCountries: 'Please select a country/region from the list.',
    toCity: 'Please select a city from the list.',
    arrivalAirport: 'Please select a airport from the list.',
    tripTime: 'Please fill in both time slot.',
    flightClasses: "Please select both flight classes and package plan.",
    travelExtra: "",
}

const placeholders = {
    departCountries: 'Type to search or select a country',
    departAirport: 'Type to search or select a airport',
    arrivalCountries: 'Type to search or select a country',
    toCity: 'Type to search or select a city',
    arrivalAirport: 'Type to search or select a airport',
    tripTime: 'Type to search or select the time'
};

const imageSources = {
    departCountries: 'asset/img/img-depart-countries.png',
    departAirport: 'asset/img/img-depart-airport.png',
    arrivalCountries: 'asset/img/img-arrival-countries.png',
    toCity: 'asset/img/img-to-city.png',
    arrivalAirport: 'asset/img/img-arrival-airport.png',
    tripTime: 'asset/img/img-trip-time.png'
};

//FUNCTION
function fetchData(apiKey, dataList) {
    fetch(this.apiLinks[apiKey])  // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
            // Populate the datalist with fetched country options
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country;  // Assuming the API returns country names
                dataList.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching countries:', error));
}

function createDataList() {
    const optionList = ["Hong Kong", "Japan"]; // Example option list
    dataListElement.innerHTML = ''; // Clear existing options

    // Populate the datalist with options
    optionList.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        dataListElement.appendChild(option);
    });

    return optionList; // Return the list of options
}

function previousQuestion() {
    if (pageIndex > 0) {
        pageIndex--;
        setQuestion();
    }
}

function isValidInput(inputValue, optionList) {
    return optionList.includes(inputValue);
}

function updateImage() {
    const mapImage = document.getElementById('mapImage');
    if (imageSources[currentPage]) {
        mapImage.src = imageSources[currentPage];
    } else {
        mapImage.src = 'asset/img/img-world-map.png'; // Default image
    }
}

function updateImportPlaceholder() {
    if (placeholders[currentPage]) {
        inputElement.placeholder = placeholders[currentPage];
    } else {
        inputElement.placeholder = 'Type to search or fill in';
    }
}

function showInvalidFeedback() {
    if (invalidFeedbackSet[currentPage]) {
        invalidFeedback.innerHTML = invalidFeedbackSet[currentPage];
    } else {
        invalidFeedback.innerHTML = 'Please Fill in All required field';
    }
    invalidFeedback.classList.add('show');
}

function hideInvalidFeedback() {
    invalidFeedback.classList.remove('show');
}

function setQuestion() {
    currentPage = pageSets[pageIndex];
    questionTextElement.innerHTML = questionSet[currentPage];
    createDataList(); //TODO: fetchData and create List 
    updateImage();
    updateImportPlaceholder();
}

function nextQuestion() {
    pageIndex++;
    currentPage = pageSets[pageIndex]
    setQuestion();
}

function setTripTimeForm() {
    formGroup.innerHTML = `
        <p class="h5 mb-1">From:</p>
        <input type="date" class="form-control mb-2" id="startDateInput" placeholder="Start Date" required>
        <p class="h5 mb-1">To:</p>
        <input type="date" class="form-control" id="endDateInput" placeholder="End Date" required>
        <div class="invalid-feedback" id="trip-time-invalid-feedback">
            Please fill in both start and end dates.
        </div>
    `;
}

const fillPlanConfig = (inputValue) => {
    switch (currentPage) {
        case "departAirport":
            planConfig.airport.fromAirport = inputValue;
            break;
        case "arrivalCountries":
            planConfig.location.country = inputValue;
            break;
        case "toCity":
            planConfig.location.city = inputValue;
            break;
        case "arrivalAirport":
            planConfig.airport.toAirport = inputValue;
            break;
    }
    console.log("input: " + inputValue)
}


//MAIN FLOW
document.addEventListener('DOMContentLoaded', function () {
    createDataList()
    setQuestion()

    nextBtn.onclick = () => {
        const inputValue = inputElement.value.trim();
        const optionList = createDataList();

        if (["departCountries", "departAirport", "arrivalCountries", "toCity", "arrivalAirport"].includes(currentPage)) {
            if (inputValue === '') {
                showInvalidFeedback();
                console.log('Input is empty!');
            } else if (isValidInput(inputValue, optionList)) {
                hideInvalidFeedback();
                fillPlanConfig(inputValue);
                nextQuestion();
            } else {
                showInvalidFeedback();
                console.log('Invalid input!');
            }
        } else if (currentPage === "tripTime") {
            setTripTimeForm();
        }

        console.log("NEXT!");
    };

    backBtn.onclick = () => {
        previousQuestion();
        console.log("BACK!");
    };

});




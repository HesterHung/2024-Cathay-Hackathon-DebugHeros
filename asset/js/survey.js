import { TripTime, Location, planConfig } from "./planConfig";

//GET ELEMENT
let inputElement = document.getElementById('inputFormBox');
let dataListElement = document.getElementById('dataListBox');
let questionTextElement = document.getElementById('questionText');
let invalidFeedback = document.getElementById('invalid-feedback');
let nextBtn = document.getElementById("btn-next");
let backBtn = document.getElementById("btn-back");
let formGroup = document.getElementById('form-group');
let tripTimeGroup = document.getElementById('trip-time-form-group');

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
    departCountries: 'img/img-depart-countries.png',
    departAirport: 'img/img-depart-airport.png',
    arrivalCountries: 'img/img-arrival-countries.png',
    toCity: 'img/img-to-city.png',
    arrivalAirport: 'img/img-arrival-airport.png',
    tripTime: 'img/img-trip-time.png',
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

    if (currentPage === "flightClasses") {
        const optionList = flightClasses.classes.map(cls => cls.name);
        return optionList;
    }
    // 

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
    }
    setQuestion();
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
    const invalidFeedback = document.getElementById('invalid-feedback');
    invalidFeedback.style.display = 'block';
    invalidFeedback.classList.add('show');
    if (currentPage === "tripTime") {
        if (!document.getElementById('startDate').value || !document.getElementById('endDate').value) {
            invalidFeedback.textContent = 'Please fill in both start and end dates.';
        } else {
            invalidFeedback.textContent = invalidFeedbackSet[currentPage] || 'Invalid input';
        }
    } else {
        invalidFeedback.textContent = invalidFeedbackSet[currentPage] || 'Invalid input';
    }
}

function hideInvalidFeedback() {
    const invalidFeedback = document.getElementById('invalid-feedback');
    invalidFeedback.style.display = 'none';
    invalidFeedback.classList.remove('show');
    invalidFeedback.textContent = '';
}

function setQuestion() {
    currentPage = pageSets[pageIndex];
    questionTextElement.innerHTML = questionSet[currentPage];
    updateImage();
    updateImportPlaceholder();
    hideInvalidFeedback();

    if (currentPage === "tripTime") {
        tripTimeGroup.style.display = 'block';
        formGroup.style.display = 'none';
    } else {
        tripTimeGroup.style.display = 'none';
        formGroup.style.display = 'block';
    }

    if (currentPage === "flightClasses") {
        // Store current state before redirecting
        localStorage.setItem('surveyPageIndex', pageIndex.toString());
        window.location.href = './formFillingClasses.html';
    } else if (currentPage === "travelExtra") {
        window.location.href = './FormFillingConfirmation.html';
    }
}

function nextQuestion() {
    pageIndex++;
    currentPage = pageSets[pageIndex]
    setQuestion();
    console.log("NEXT!");
}


const fillPlanConfig = (inputValue) => {
    switch (currentPage) {
        case "departAirport":
            planConfig.ticket.departAirport = inputValue;
            break;
        case "arrivalCountries":
            planConfig.location.country = inputValue;
            break;
        case "toCity":
            planConfig.location.city = inputValue;
            break;
        case "arrivalAirport":
            planConfig.ticket.arrivalAirport = inputValue;
            break;
        case "flightClasses":
            planConfig.ticket.classes = inputValue;
            break;
        case "packagePlan":
            planConfig.ticket.packagePlan = inputValue;
            break;
    }
    console.log("input: " + inputValue)
}

function validateTripTime() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    console.log('Start Date Element:', startDateInput);
    console.log('End Date Element:', endDateInput);

    if (!startDateInput || !endDateInput) {
        console.error('Start date or end date input not found!');
        return false;
    }

    const startDateValue = startDateInput.value.trim();
    const endDateValue = endDateInput.value.trim();

    if (startDateValue === '' || endDateValue === '') {
        showInvalidFeedback();
        console.log('One or both date inputs are empty!');
        return false;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    if (startDate >= endDate) {
        const invalidFeedback = document.getElementById('invalid-feedback');
        invalidFeedback.style.display = 'block';
        invalidFeedback.classList.add('show');
        invalidFeedback.textContent = 'Start date must be before end date.';
        console.log('Start date is not before end date!');
        return false;
    }

    hideInvalidFeedback();
    planConfig.tripTime = { start: startDate, end: endDate };
    return true;
}

//MAIN FLOW
document.addEventListener('DOMContentLoaded', function () {
    const storedPageIndex = localStorage.getItem('surveyPageIndex');
    if (storedPageIndex) {
        pageIndex = parseInt(storedPageIndex);
        localStorage.removeItem('surveyPageIndex'); // Clear it after using
    }

    // Retrieve stored planConfig if it exists
    const storedPlanConfig = localStorage.getItem('planConfig');
    if (storedPlanConfig) {
        Object.assign(planConfig, JSON.parse(storedPlanConfig));
        localStorage.removeItem('planConfig'); // Clear it after using
    }

    tripTimeGroup.style.display = 'none';
    createDataList();
    setQuestion();

    nextBtn.onclick = () => {
        console.log(currentPage);

        if (currentPage === "tripTime") {
            if (validateTripTime()) {
                nextQuestion();
            }
            return;
        }

        const inputValue = inputElement.value.trim();
        const optionList = createDataList();

        if (["departCountries", "departAirport", "arrivalCountries", "toCity", "arrivalAirport"].includes(currentPage)) {
            if (inputValue === '') {
                showInvalidFeedback();
                console.log('Input is empty!');
            } else if (isValidInput(inputValue, optionList)) {
                hideInvalidFeedback();
                fillPlanConfig(inputValue);
                setQuestion();
                nextQuestion();
            } else {
                showInvalidFeedback();
                console.log('Invalid input!');
            }
        }
    };

    backBtn.onclick = () => {
        tripTimeGroup.style.display = 'none';
        formGroup.style.display = 'none';
        previousQuestion();
        console.log("BACK!");
    };


});


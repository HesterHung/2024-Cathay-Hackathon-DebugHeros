import { TripTime, Location, planConfig } from "./planConfig";

//GET ELEMENT
let inputElement = document.getElementById('inputFormBox');
let dataListElement = document.getElementById('dataListBox');
let questionTextElement = document.getElementById('questionText');
let invalidFeedback = document.getElementById('invalid-feedback');
let nextBtn = document.getElementById("btn-next");

//GLOBAL VARIABLE
const sets = ["departCountries", "arrivalCountries", 'cities', 'airports']
let CurrentPage = sets[0]

//ARRAY
const apiLinks = {
    departCountries: 'https://api.example.com/countries',
    arrivalCountries: 'https://api.example.com/countries',
    cities: 'https://api.example.com/cities',
    airports: 'https://api.example.com/airlines',
};

const questionSet = {
    departCountries: 'Which country/ region would you depart form?',
    arrivalCountries: 'Which country/ region do you depart form?',
    cities: 'Which city do you wanna travel?',
    airports: 'Which airport do you wanna land on?',
}

const invalidFeedbackSet = {
    departCountries: 'Please select a country/region from the list.',
    arrivalCountries: 'Please select a country/region from the list.',
    cities: 'Please select a city from the list.',
    airports: 'Please select a airport from the list.',
}

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
    // Example option list
    const optionList = ["Hong Kong", "Japan"];

    // Clear existing options
    dataListElement.innerHTML = '';
    

    // Populate the datalist with options
    for (let i = 0; i < optionList.length; i++) {
        const option = document.createElement('option');
        option.value = optionList[i];
        dataListElement.appendChild(option);
        console.log(option.value)
    }
}

function setQuestion(){
    questionTextElement.innerHTML = questionSet[CurrentPage];
}

const showInvalidFeedback = () => {
    invalidFeedback.innerHTML = invalidFeedbackSet[CurrentPage];
}


document.addEventListener('DOMContentLoaded', function () {
    createDataList()
    setQuestion()
    showInvalidFeedback()

    nextBtn.onclick = () => {
        console.log("NEXT!")
    }
    
});




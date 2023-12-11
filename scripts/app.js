import { apiKey } from "./environment.js"

// Define Variables
let userSearch = document.getElementById("userSearch");
let searchBtn = document.getElementById("searchBtn");

let cityName = document.getElementById("cityName");
let currentWeatherIcon = document.getElementById("currentWeatherIcon");
let currentTemp = document.getElementById("currentTemp");
let currentDesc = document.getElementById("currentDesc");
let currentHigh = document.getElementById("currentHigh");
let currentLow = document.getElementById("currentLow");

// let time = document.getElementById("time");
let morningIcon = document.getElementById("morningIcon");
let morningTemp = document.getElementById("morningTemp");
let afternoonIcon = document.getElementById("afternoonIcon");
let afternoonTemp = document.getElementById("afternoonTemp");
let nightIcon = document.getElementById("nightIcon");
let nightTemp = document.getElementById("nightTemp");

let dateDayOne = document.getElementById("dateDayOne");
let dayOneIcon = document.getElementById("dayOneIcon");
let dayOneHigh = document.getElementById("dayOneHigh");
let dayOneLow = document.getElementById("dayOneLow");

let dateDayTwo = document.getElementById("dateDayTwo");
let dayTwoIcon = document.getElementById("dayTwoIcon");
let dayTwoHigh = document.getElementById("dayTwoHigh");
let dayTwoLow = document.getElementById("dayTwoLow");

let dateDayThree = document.getElementById("dateDayThree");
let dayThreeIcon = document.getElementById("dayThreeIcon");
let dayThreeHigh = document.getElementById("dayThreeHigh");
let dayThreeLow = document.getElementById("dayThreeLow");

let dateDayFour = document.getElementById("dateDayFour");
let dayFourIcon = document.getElementById("dayFourIcon");
let dayFourHigh = document.getElementById("dayFourHigh");
let dayFourLow = document.getElementById("dayFourLow");

let dateDayFive = document.getElementById("dateDayFive");
let dayFiveIcon = document.getElementById("dayFiveIcon");
let dayFiveHigh = document.getElementById("dayFiveHigh");
let dayFiveLow = document.getElementById("dayFiveLow");

let favoritesAddBtn = document.getElementById("favoritesAddBtn");
let favoritesArray = [];

// JavaScript Variables
let userLat, userLon;
let currentWeatherData, locationData, hourlyWeatherData;
let todayUnix, todayDateTime, futureDate1, futureDate2, futureDate3, futureDate4, futureDate5;

//Geo location is a built in API that allows the user to share their location upon request
navigator.geolocation.getCurrentPosition(success, errorFunc);

//If the user accepts we run success function
async function success(position) {

    if (userSearch.value) {
        const promise = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value}&limit=5&appid=${apiKey}`);
        const data = await promise.json();
        userLat = data[0].lat;
        userLon = data[0].lon;
    }
    else {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
    }

    await currentWeatherAPI();
    await hourlyWeatherAPI();
    await reverseGeoAPI();
    updateDateTime();
    getDates();
    hourlyForecast();
    updateFavoritesIcon();
}

//If the user denies we run errorFunc
async function errorFunc(error) {
    console.log(error.message);
    userLat = 37.9616;
    userLon = -121.2756;

    await currentWeatherAPI();
    await hourlyWeatherAPI();
    await reverseGeoAPI();
    updateDateTime();
    getDates();
    hourlyForecast();
    updateFavoritesIcon();
}

//async function allows us to use the key word await, it pauses the execution of the code until the promise is fufilled
async function currentWeatherAPI() {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${apiKey}&units=imperial`);
    const data = await promise.json();
    currentWeatherData = data;

    currentTemp.innerHTML = Math.round(currentWeatherData.main.temp);
    currentDesc.innerHTML = currentWeatherData.weather[0].main.toLowerCase();
    currentHigh.innerHTML = Math.round(currentWeatherData.main.temp_max);
    currentLow.innerHTML = Math.round(currentWeatherData.main.temp_min);
    setIcon(currentWeatherIcon, currentWeatherData.weather[0].main);
}

async function reverseGeoAPI() {
    const location = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${userLat}&lon=${userLon}&limit=5&appid=${apiKey}`)
    const data = await location.json();
    locationData = data;

    cityName.innerHTML = locationData[0].name.toUpperCase();
}

async function hourlyWeatherAPI() {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${userLat}&lon=${userLon}&appid=${apiKey}&units=imperial`);
    const data = await promise.json();
    hourlyWeatherData = data;
}

function setIcon(element, weather) {
    switch (weather) {
        case "Clear":
            element.innerHTML = "1";
            break;
        case "Clouds":
            element.innerHTML = "A";
            break;
        case "Drizzle":
            element.innerHTML = "M";
            break;
        case "Rain":
            element.innerHTML = "U";
            break;
        case "Snow":
            element.innerHTML = "I";
            break;
        case "Thunderstorm":
            element.innerHTML = "Q";
            break;
        default:
            element.innerHTML = "Z";
            break;
    }
}


// create a function to update the time
function updateDateTime() {
    // create a new `Date` object
    const now = new Date();

    // get the current time as a string
    const currentDateTime = now.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });

    // update the `innerHTML` property of the element with the `id` of `time`
    document.querySelector("#time").innerHTML = currentDateTime;
}

// call the `updateDateTime` function every second
setInterval(updateDateTime, 1000);

function getDates() {
    todayUnix = currentWeatherData.dt;
    todayDateTime = new Date(todayUnix * 1000);

    futureDate1 = new Date(todayDateTime.setHours(todayDateTime.getHours() + (24)));
    futureDate2 = new Date(todayDateTime.setHours(todayDateTime.getHours() + (24)));
    futureDate3 = new Date(todayDateTime.setHours(todayDateTime.getHours() + (24)));
    futureDate4 = new Date(todayDateTime.setHours(todayDateTime.getHours() + (24)));
    futureDate5 = new Date(todayDateTime.setHours(todayDateTime.getHours() + (24)));

    //Set Dates for Forecast
    dateDayOne.innerHTML = futureDate1.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase() + " " + futureDate1.toLocaleDateString('en-US', { month: "2-digit", day: "numeric" }).toUpperCase();
    dateDayTwo.innerHTML = futureDate2.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase() + " " + futureDate2.toLocaleDateString('en-US', { month: "2-digit", day: "numeric" }).toUpperCase();
    dateDayThree.innerHTML = futureDate3.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase() + " " + futureDate3.toLocaleDateString('en-US', { month: "2-digit", day: "numeric" }).toUpperCase();
    dateDayFour.innerHTML = futureDate4.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase() + " " + futureDate4.toLocaleDateString('en-US', { month: "2-digit", day: "numeric" }).toUpperCase();
    dateDayFive.innerHTML = futureDate5.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase() + " " + futureDate5.toLocaleDateString('en-US', { month: "2-digit", day: "numeric" }).toUpperCase();
}

function hourlyForecast() {
    let highDay1 = [], highDay2 = [], highDay3 = [], highDay4 = [], highDay5 = [];
    let lowDay1 = [], lowDay2 = [], lowDay3 = [], lowDay4 = [], lowDay5 = [];
    let weatherDay1 = [], weatherDay2 = [], weatherDay3 = [], weatherDay4 = [], weatherDay5 = [];
    let morningTempsArr = [], afternoonTempsArr = [], nightTempsArr = [];
    let morningCondition, afternoonCondition, nightCondition;

    for (let i = 0; i < hourlyWeatherData.list.length; i++) {
        let unixFutureTime = new Date(hourlyWeatherData.list[i].dt * 1000)
        //All Highs & Lows for Each Day
        if (unixFutureTime.toLocaleDateString('default') === futureDate1.toLocaleDateString('default')) {
            highDay1.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay1.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay1.push(hourlyWeatherData.list[i].weather[0].main)

            //Today's Morning, Afternoon, Night Temps Based on Tomorrow's Data
            const hours = unixFutureTime.getHours();

            const morningStart = 7, morningEnd = 9;
            const afternoonStart = 11, afternoonEnd = 13;
            const nightStart = 17, nightEnd = 19;

            if (hours >= morningStart && hours <= morningEnd) {
                morningTempsArr.push(hourlyWeatherData.list[i].main.temp);
                morningCondition = hourlyWeatherData.list[i].weather[0].main;
            } else if (hours >= afternoonStart && hours <= afternoonEnd) {
                afternoonTempsArr.push(hourlyWeatherData.list[i].main.temp);
                afternoonCondition = hourlyWeatherData.list[i].weather[0].main;
            } else if (hours >= nightStart && hours <= nightEnd) {
                nightTempsArr.push(hourlyWeatherData.list[i].main.temp);
                nightCondition = hourlyWeatherData.list[i].weather[0].main;
            }
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDate2.toLocaleDateString('default')) {
            highDay2.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay2.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay2.push(hourlyWeatherData.list[i].weather[0].main)
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDate3.toLocaleDateString('default')) {
            highDay3.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay3.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay3.push(hourlyWeatherData.list[i].weather[0].main)
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDate4.toLocaleDateString('default')) {

            highDay4.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay4.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay4.push(hourlyWeatherData.list[i].weather[0].main)
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDate5.toLocaleDateString('default')) {
            highDay5.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay5.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay5.push(hourlyWeatherData.list[i].weather[0].main)
        }
    }

    //Average Calculations (Today's Morning, Afternoon, Night Temps)
    let sumMorning = 0, sumAfternoon = 0, sumNight = 0;
    for (let i = 0; i < morningTempsArr.length; i++) {
        sumMorning += morningTempsArr[i];
    }
    let morningTempsAverage = sumMorning / morningTempsArr.length;

    for (let i = 0; i < afternoonTempsArr.length; i++) {
        sumAfternoon += afternoonTempsArr[i];
    }
    let afternoonTempsAverage = sumAfternoon / afternoonTempsArr.length;

    for (let i = 0; i < nightTempsArr.length; i++) {
        sumNight += nightTempsArr[i];
    }
    let nightTempsAverage = sumNight / nightTempsArr.length;

    // Today Morning, Afternoon, Night Set
    setIcon(morningIcon, morningCondition);
    morningTemp.innerHTML = Math.round(morningTempsAverage);

    setIcon(afternoonIcon, afternoonCondition);
    afternoonTemp.innerHTML = Math.round(afternoonTempsAverage);

    // setIcon(nightIcon, nightCondition);
    nightIcon.innerHTML = "6";
    nightTemp.innerHTML = Math.round(nightTempsAverage);

    // 5 Day Forcast Set (Calculate Highest & Lowest)
    setIcon(dayOneIcon, weatherDay1[0]);
    dayOneHigh.innerHTML = Math.round(Math.max(...highDay1));
    dayOneLow.innerHTML = Math.round(Math.min(...lowDay1));

    setIcon(dayTwoIcon, weatherDay2[0]);
    dayTwoHigh.innerHTML = Math.round(Math.max(...highDay2));
    dayTwoLow.innerHTML = Math.round(Math.min(...lowDay2));

    setIcon(dayThreeIcon, weatherDay3[0]);
    dayThreeHigh.innerHTML = Math.round(Math.max(...highDay3));
    dayThreeLow.innerHTML = Math.round(Math.min(...lowDay3));

    setIcon(dayFourIcon, weatherDay4[0]);
    dayFourHigh.innerHTML = Math.round(Math.max(...highDay4));
    dayFourLow.innerHTML = Math.round(Math.min(...lowDay4));

    setIcon(dayFiveIcon, weatherDay5[0]);
    dayFiveHigh.innerHTML = Math.round(Math.max(...highDay5));
    dayFiveLow.innerHTML = Math.round(Math.min(...lowDay5));
}

//Search
userSearch.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        success(userSearch.value)
        e.preventDefault();
        updateFavoritesIcon();
        userSearch.value = "";
        return false;
    }
});
searchBtn.addEventListener('click', function () {
    success(userSearch.value);
    updateFavoritesIcon();
    userSearch.value = "";
});

// Local Storage
if(localStorage.getItem("favorites")){
    favoritesArray = JSON.parse(localStorage.getItem("favorites"))
};

favoritesAddBtn.addEventListener('click', function () {
    if (favoritesArray.includes(cityName.textContent)) {
        let index = favoritesArray.indexOf(cityName.textContent);
        favoritesArray.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favoritesArray));
    } else {
        favoritesArray.push(cityName.textContent);
        localStorage.setItem("favorites", JSON.stringify(favoritesArray));
    }
    updateFavoritesIcon();
});

function updateFavoritesIcon(){
    if (favoritesArray.includes(userSearch.value.toUpperCase() || cityName.textContent)) {
        favoritesAddBtn.src = "../assets/like.png";
    } else {
        favoritesAddBtn.src = "../assets/heart.png";
    }
    userSearch.value = "";
}

//Create Elements on Open Modal
let favoritesList = document.getElementById("favoritesList");
const favoritesModal = document.getElementById('favoritesModal');

// Assuming using Bootstrap for modal, use the 'shown.bs.modal' event
favoritesModal.addEventListener('shown.bs.modal', event => {
    // Clear the existing content before adding the elements
    favoritesList.innerHTML = "";

    // Loop through the favoritesArray and add each city to the modal
    for (let i = 0; i < favoritesArray.length; i++) {
        addElement(favoritesArray[i]);
    }
});

function addElement(city) {
    // Create a new div element for the row
    const newRow = document.createElement("div");
    newRow.classList.add("row", "mb-2", "align-items-center"); // Add Bootstrap classes for spacing
    newRow.style.backgroundColor = "#ffffff";
    newRow.style.borderRadius = "10px";
    newRow.style.padding = "10px";

    // Create a new div element for the city name (left column)
    const cityNameColumn = document.createElement("div");
    cityNameColumn.classList.add("col");
    const cityNameContent = document.createTextNode(city);
    cityNameColumn.appendChild(cityNameContent);
    cityNameColumn.addEventListener("click", () => {
        $('#favoritesModal').modal('hide'); // Close the modal (jQuery)
        userSearch.value = city;
        success(userSearch.value); // Return to the weather application for the chosen city
    });

    // Create a new div element for the remove button (right column)
    const removeButtonColumn = document.createElement("div");
    removeButtonColumn.classList.add("col-auto"); // "col-auto" for a column that only takes the necessary space
    const removeButton = document.createElement("button");
    removeButton.classList.add("btn", "remove-button", "btn-md"); // Add Bootstrap button classes
    removeButton.textContent = "X";
    removeButton.addEventListener("click", () => removeCity(city)); // Add a click event to remove the city
    removeButtonColumn.appendChild(removeButton);

    // Add the left and right columns to the row
    newRow.appendChild(cityNameColumn);
    newRow.appendChild(removeButtonColumn);

    // Add the row to the favoritesList
    favoritesList.appendChild(newRow);
}

function removeCity(city) {
    // Handle the removal of the city from the favoritesArray and update the modal
    const index = favoritesArray.indexOf(city);
    if (index !== -1) {
        favoritesArray.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favoritesArray)); // Update local storage
        updateFavoritesModalContent(); // Update the modal content immediately
    }
    updateFavoritesIcon();
}

function updateFavoritesModalContent() {
    // Clear the existing content before adding the elements
    favoritesList.innerHTML = "";

    // Loop through the favoritesArray and add each city to the modal
    for (let i = 0; i < favoritesArray.length; i++) {
        addElement(favoritesArray[i]);
    }
}

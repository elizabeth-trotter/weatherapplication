import apiKey from "./env.js"
import { userSearch, searchBtn, cityName, currentWeatherIcon, currentTemp, currentDesc, currentHigh, currentLow, morningIcon, morningTemp, afternoonIcon, afternoonTemp, nightTemp, dateDayOne, dayOneIcon, dayOneHigh, dayOneLow, dateDayTwo, dayTwoIcon, dayTwoHigh, dayTwoLow, dateDayThree, dayThreeIcon, dayThreeHigh, dayThreeLow, dateDayFour, dayFourIcon, dayFourHigh, dayFourLow, dateDayFive, dayFiveIcon, dayFiveHigh, dayFiveLow, favoritesAddBtn, tempUnit1, tempUnit2, tempUnit3, tempUnit4 } from './variables.js';
import { stateAb } from "./stateabr.js";
import { setIcon } from "./setweathericon.js";

// JavaScript Variables
let userLat, userLon;
let currentWeatherData, locationData, hourlyWeatherData;
let futureDates = [];
// Query Params for API
let stateCode = "", countryCode = "US", limit = 5, units = "imperial";
let favoritesArray = [], recentsArray = [];

//Geo location is a built in API that allows the user to share their location upon request
navigator.geolocation.getCurrentPosition(success, errorFunc);

//If the user accepts we run success function
async function success(position) {

    if (userSearch.value) {
        const promise = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`);
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
    hideAutocompleteDropdown();
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
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${apiKey}&units=${units}`);
    const data = await promise.json();
    currentWeatherData = data;

    currentTemp.innerHTML = Math.round(currentWeatherData.main.temp);
    currentDesc.innerHTML = currentWeatherData.weather[0].main.toLowerCase();
    currentHigh.innerHTML = Math.round(currentWeatherData.main.temp_max);
    currentLow.innerHTML = Math.round(currentWeatherData.main.temp_min);
    setIcon(currentWeatherIcon, currentWeatherData.weather[0].main);
    currentWeatherIcon.classList.remove('weatherIconFont');
}

async function reverseGeoAPI() {
    const location = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${userLat}&lon=${userLon}&limit=5&appid=${apiKey}`)
    const data = await location.json();
    locationData = data;

    if (stateAb[locationData[0].state]) {
        cityName.innerHTML = locationData[0].name + ", " + stateAb[locationData[0].state];
    } else if (locationData[0].state) {
        cityName.innerHTML = locationData[0].name + ", " + locationData[0].state;
    } else {
        cityName.innerHTML = locationData[0].name;
    }
}

async function hourlyWeatherAPI() {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${userLat}&lon=${userLon}&appid=${apiKey}&units=${units}`);
    const data = await promise.json();
    hourlyWeatherData = data;
}

function frequentCondition(arr) {
    let count = 1, max = 0, el;

    for (let i = 1; i < arr.length; ++i) {
        if (arr[i] === arr[i - 1]) {
            count++;
        } else {
            count = 1;
        }
        if (count > max) {
            max = count;
            el = arr[i];
        }
    }

    return el;
}

// create a function to update the time
function updateDateTime() {
    // create a new `Date` object
    const now = new Date();

    // get the current time as a string
    const currentDateTime = now.toLocaleDateString('en-US', { month: 'long', day: "numeric", year: "numeric" }) + "&nbsp | &nbsp" + now.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric", timeZoneName: "short" });

    // update the `innerHTML` property of the element with the `id` of `time`
    document.querySelector("#time").innerHTML = currentDateTime;
}

// call the `updateDateTime` function every second
setInterval(updateDateTime, 1000);

function getDates() {
    const todayUnix = currentWeatherData.dt;
    const todayDateTime = new Date(todayUnix * 1000);

    for (let i = 1; i <= 5; i++) {
        futureDates.push(new Date(todayDateTime.getTime() + (24 * 60 * 60 * 1000 * i)));
    }

    const dateElements = [dateDayOne, dateDayTwo, dateDayThree, dateDayFour, dateDayFive];
    futureDates.forEach((date, index) => {
        dateElements[index].innerHTML = date.toLocaleDateString('en-US', { weekday: "long", month: "short", day: "numeric" });
    });
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
        if (unixFutureTime.toLocaleDateString('default') === futureDates[0].toLocaleDateString('default')) {
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
        else if (unixFutureTime.toLocaleDateString('default') === futureDates[1].toLocaleDateString('default')) {
            highDay2.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay2.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay2.push(hourlyWeatherData.list[i].weather[0].main)
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDates[2].toLocaleDateString('default')) {
            highDay3.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay3.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay3.push(hourlyWeatherData.list[i].weather[0].main)
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDates[3].toLocaleDateString('default')) {

            highDay4.push(hourlyWeatherData.list[i].main.temp_max)
            lowDay4.push(hourlyWeatherData.list[i].main.temp_min)
            weatherDay4.push(hourlyWeatherData.list[i].weather[0].main)
        }
        else if (unixFutureTime.toLocaleDateString('default') === futureDates[4].toLocaleDateString('default')) {
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

    // Night icon is always set to moon
    nightTemp.innerHTML = Math.round(nightTempsAverage);

    // 5 Day Forcast Set (Calculate Highest & Lowest)
    setIcon(dayOneIcon, frequentCondition(weatherDay1));
    dayOneHigh.innerHTML = Math.round(Math.max(...highDay1));
    dayOneLow.innerHTML = Math.round(Math.min(...lowDay1));

    setIcon(dayTwoIcon, frequentCondition(weatherDay2));
    dayTwoHigh.innerHTML = Math.round(Math.max(...highDay2));
    dayTwoLow.innerHTML = Math.round(Math.min(...lowDay2));

    setIcon(dayThreeIcon, frequentCondition(weatherDay3));
    dayThreeHigh.innerHTML = Math.round(Math.max(...highDay3));
    dayThreeLow.innerHTML = Math.round(Math.min(...lowDay3));

    setIcon(dayFourIcon, frequentCondition(weatherDay4));
    dayFourHigh.innerHTML = Math.round(Math.max(...highDay4));
    dayFourLow.innerHTML = Math.round(Math.min(...lowDay4));

    setIcon(dayFiveIcon, frequentCondition(weatherDay5));
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
        updateRecents();
        createRecents();
        hideAutocompleteDropdown();
        return false;
    }
});
searchBtn.addEventListener('click', function () {
    success(userSearch.value);
    updateFavoritesIcon();
    userSearch.value = "";
    updateRecents();
    createRecents();
    hideAutocompleteDropdown();
});

//Autocomplete
const autocompleteDropdown = document.getElementById("autocompleteDropdown");

// Listen for input changes in the search box
userSearch.addEventListener('input', function () {
    const inputValue = userSearch.value.trim();

    // Check if the input length is greater than 3 characters
    if (inputValue.length >= 3) {
        // Make a request to the geocoding API
        fetchGeocodingData(inputValue)

    } else {
        // If input length is less than 3 characters, hide the dropdown
        hideAutocompleteDropdown();
    }
});

// Fetch geocoding data from the API
async function fetchGeocodingData(input) {
    const promise_1 = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input},US&limit=5&appid=${apiKey}`);
    const data_1 = await promise_1.json();
    let lat_1, lon_1;

    for (let i = 0; i < data_1.length; i++) {

        lat_1 = data_1[i].lat;
        lon_1 = data_1[i].lon;

        const promise_2 = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat_1}&lon=${lon_1}&limit=5&appid=${apiKey}`)
        const data_2 = await promise_2.json();

        if (data_2[0].name.toLowerCase().includes("county")) {
            data_1.splice(i, 1);
        }
    }
    // Check if there are multiple city options
    if (data_1.length > 0) {
        showAutocompleteDropdown(data_1);
    } else {
        hideAutocompleteDropdown();
    }
}

// Show the autocomplete dropdown with city options
function showAutocompleteDropdown(cityOptions) {
    autocompleteDropdown.innerHTML = '';

    let duplicateCheck = [];

    for (let i = 0; i < cityOptions.length; i++) {
        if (duplicateCheck.includes(cityOptions[i].state)) {
        } else {
            const option = document.createElement('div');
            option.textContent = cityOptions[i].name + ", " + cityOptions[i].state;
            option.classList.add('autocomplete-option');

            option.addEventListener('click', function () {
                // Handle the selection of a city option
                stateCode = cityOptions[i].state;
                userSearch.value = cityOptions[i].name;
                success(userSearch.value); // Return to the weather application for the chosen city
                hideAutocompleteDropdown();
                stateCode = "";
                updateRecents();
                createRecents();
            });

            autocompleteDropdown.appendChild(option);

            duplicateCheck.push(cityOptions[i].state);
        }
    }

    autocompleteDropdown.style.display = 'block';
}

// Hide the autocomplete dropdown
function hideAutocompleteDropdown() {
    autocompleteDropdown.innerHTML = '';
    autocompleteDropdown.style.display = 'none';
}

// Local Storage
if (localStorage.getItem("recents")) {
    recentsArray = JSON.parse(localStorage.getItem("recents"))
};

function updateRecents() {
    if (recentsArray.includes(cityName.textContent)) {
        let indexDuplicate = recentsArray.indexOf(cityName.textContent);
        if (indexDuplicate !== 2) {
            recentsArray.splice(indexDuplicate, 1);
            recentsArray.push(cityName.textContent);
            localStorage.setItem("recents", JSON.stringify(recentsArray));
        }
    } else {
        if (recentsArray.length > 2) {
            recentsArray.shift();
            recentsArray.push(cityName.textContent);
            localStorage.setItem("recents", JSON.stringify(recentsArray));
        } else {
            recentsArray.push(cityName.textContent);
            localStorage.setItem("recents", JSON.stringify(recentsArray));
        }
    }
}

if (localStorage.getItem("favorites")) {
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
    createFavorites();
});

function updateFavoritesIcon() {
    if (favoritesArray.includes(userSearch.value || cityName.textContent)) {
        favoritesAddBtn.classList.remove("fa-regular");
        favoritesAddBtn.classList.add("fa-solid");
    } else {
        favoritesAddBtn.classList.remove("fa-solid");
        favoritesAddBtn.classList.add("fa-regular");
    }
    userSearch.value = "";
}

//Recents Navbar
let recentsNav = document.getElementById("recentsNav");

createRecents();

function createRecents() {
    recentsNav.innerHTML = "";

    if (recentsArray.length > 0) {
        // Loop through each favorite city and create divs with city names and delete buttons
        recentsArray.forEach(location => {
            // Create a div for the city
            const cityDiv = document.createElement('div');
            cityDiv.classList.add('favCities', 'ps-3', 'pe-4', 'mb-4', 'border-bottom', 'border-light', 'border-opacity-10');

            const cityText = document.createElement('p');
            cityText.textContent = location;
            cityText.classList.add('pb-2');

            cityDiv.appendChild(cityText);
            cityText.style.cursor = 'pointer';

            // Add event listeners for hover effects
            cityText.addEventListener('mouseover', function () {
                // Change text color when hovering
                cityText.style.color = '#EDA169';
            });

            cityText.addEventListener('mouseout', function () {
                // Restore the original text color when not hovering
                cityText.style.color = ''; // Set to an empty string to use the CSS-defined color
            });

            if (location === recentsArray[recentsArray.length - 1]) {
                cityDiv.classList.remove('border-bottom', 'border-light', 'border-opacity-10', 'mb-4');
                cityText.classList.remove('pb-2');
                cityText.classList.add('mb-2');
            }

            // Create a delete button
            const deleteButton = document.createElement('div');
            // Create an <i> tag and assign a class
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid', 'fa-circle-minus');
            deleteButton.appendChild(deleteIcon);
            // Remove default button styling
            deleteButton.style.cursor = 'pointer'; // Change cursor to indicate it's clickable

            // Add event listeners for hover effects
            deleteButton.addEventListener('mouseover', function () {
                // Change text color when hovering
                deleteButton.style.color = '#EDA169';
            });

            deleteButton.addEventListener('mouseout', function () {
                // Restore the original text color when not hovering
                deleteButton.style.color = ''; // Set to an empty string to use the CSS-defined color
            });

            deleteButton.addEventListener('click', () => removeRecent(location));

            // Style the city div and delete button
            cityDiv.style.display = 'flex'; // Use flex to control the layout
            cityDiv.style.justifyContent = 'space-between'; // Space between city name and delete button

            // Append the city div and delete button to the container div
            cityDiv.appendChild(deleteButton);

            // Append the container div to the favorites list
            recentsNav.appendChild(cityDiv);

            cityText.addEventListener('click', function () {
                let locationArr = location.split(", ");
                userSearch.value = locationArr[0];

                locationArr[1] = Object.keys(stateAb).find(key => stateAb[key] === locationArr[1]);
                stateCode = locationArr[1];
                success(userSearch.value);
                updateFavoritesIcon();
                hideAutocompleteDropdown();
            });

        });
    } else {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.classList.add('text-center', 'pb-3');

        const textP = document.createElement('p');
        textP.classList.add('favCities');
        textP.textContent = "No recent searches";

        placeholderDiv.appendChild(textP);

        recentsNav.appendChild(placeholderDiv);
    }
}

function removeRecent(city) {
    // Handle the removal of the city from the favoritesArray and update the content
    const index = recentsArray.indexOf(city);
    if (index !== -1) {
        recentsArray.splice(index, 1);
        localStorage.setItem("recents", JSON.stringify(recentsArray)); // Update local storage
        createRecents(); // Update the content immediately
    }
}

//Favorites Navbar
let favoritesNav = document.getElementById("favoritesNav");

createFavorites();

function createFavorites() {
    favoritesNav.innerHTML = "";

    if (favoritesArray.length > 0) {
        // Loop through each favorite city and create divs with city names and delete buttons
        favoritesArray.forEach(location => {
            // Create a div for the city
            const cityDiv = document.createElement('div');
            cityDiv.classList.add('favCities', 'ps-3', 'pe-4', 'mb-4', 'border-bottom', 'border-light', 'border-opacity-10');

            const cityText = document.createElement('p');
            cityText.textContent = location;
            cityText.classList.add('pb-2');

            cityDiv.appendChild(cityText);
            cityText.style.cursor = 'pointer';

            // Add event listeners for hover effects
            cityText.addEventListener('mouseover', function () {
                // Change text color when hovering
                cityText.style.color = '#EDA169';
            });

            cityText.addEventListener('mouseout', function () {
                // Restore the original text color when not hovering
                cityText.style.color = ''; // Set to an empty string to use the CSS-defined color
            });

            if (location === favoritesArray[favoritesArray.length - 1]) {
                cityDiv.classList.remove('border-bottom', 'border-light', 'border-opacity-10', 'mb-4');
                cityText.classList.remove('pb-2');
                cityText.classList.add('mb-1');
            }

            // Create a delete button
            const deleteButton = document.createElement('div');
            // Create an <i> tag and assign a class
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid', 'fa-circle-minus');
            deleteButton.appendChild(deleteIcon);
            // Remove default button styling
            deleteButton.style.cursor = 'pointer'; // Change cursor to indicate it's clickable

            // Add event listeners for hover effects
            deleteButton.addEventListener('mouseover', function () {
                // Change text color when hovering
                deleteButton.style.color = '#EDA169';
            });

            deleteButton.addEventListener('mouseout', function () {
                // Restore the original text color when not hovering
                deleteButton.style.color = ''; // Set to an empty string to use the CSS-defined color
            });

            deleteButton.addEventListener('click', () => removeFavorite(location));

            // Style the city div and delete button
            cityDiv.style.display = 'flex'; // Use flex to control the layout
            cityDiv.style.justifyContent = 'space-between'; // Space between city name and delete button

            // Append the city div and delete button to the container div
            cityDiv.appendChild(deleteButton);

            // Append the container div to the favorites list
            favoritesNav.appendChild(cityDiv);

            cityText.addEventListener('click', function () {
                let locationArr = location.split(", ");
                userSearch.value = locationArr[0];

                locationArr[1] = Object.keys(stateAb).find(key => stateAb[key] === locationArr[1]);
                stateCode = locationArr[1];
                success(userSearch.value);
                updateFavoritesIcon();
                hideAutocompleteDropdown();
            });

        });
    } else {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.classList.add('text-center', 'py-5');

        const textP = document.createElement('p');
        textP.classList.add('favCities');
        textP.textContent = "No favorites saved";

        const instructP = document.createElement('p');
        instructP.classList.add('pt-5', 'pb-2', 'favCities');
        instructP.textContent = "Add a city by clicking the heart";

        placeholderDiv.appendChild(textP);
        placeholderDiv.appendChild(instructP);

        favoritesNav.appendChild(placeholderDiv);
    }

}

function removeFavorite(city) {
    // Handle the removal of the city from the favoritesArray and update the content
    const index = favoritesArray.indexOf(city);
    if (index !== -1) {
        favoritesArray.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favoritesArray)); // Update local storage
        createFavorites(); // Update the content immediately
    }
    updateFavoritesIcon();
}

// Temperature Change Radio Buttons

// Function to handle radio button click event
function handleRadioClick(event) {
    // Check which radio button is clicked
    if (event.target.id === 'btnradio1') {
        units = 'imperial';
        tempUnit1.textContent = 'F';
        tempUnit2.textContent = 'F';
        tempUnit3.textContent = 'F';
        tempUnit4.textContent = 'F';
    } else if (event.target.id === 'btnradio2') {
        units = 'metric';
        tempUnit1.textContent = 'C';
        tempUnit2.textContent = 'C';
        tempUnit3.textContent = 'C';
        tempUnit4.textContent = 'C';
    }

    let locationArr = cityName.innerText.split(", ");
    userSearch.value = locationArr[0];

    locationArr[1] = Object.keys(stateAb).find(key => stateAb[key] === locationArr[1]);
    stateCode = locationArr[1];
    success(userSearch.value);
    updateFavoritesIcon();
    hideAutocompleteDropdown();
}

// Add click event listeners to radio buttons
const radioButtons = document.querySelectorAll('.btn-check');
radioButtons.forEach(button => {
    button.addEventListener('click', handleRadioClick);
});
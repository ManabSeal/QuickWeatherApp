import { saveData, checkData, saveLocation } from "./database.js";
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");


const loginModalButton = document.getElementById("open-login-modal");
const closeModalButton = document.getElementById("close-modal-btn");
const aboutPageNav = document.getElementById("about-page");
const homePageNav = document.getElementById("home-page");
const myAccountPageNav = document.getElementById("my-account-page");
const logoutNav = document.getElementById("logout");

const signupModalBtn = document.getElementById("signup-modal-btn");
const closeModalButton2  = document.getElementById("close-modal-btn2");
const loginModalButton2 = document.getElementById("login-modal-btn");
const mainLoginBtn = document.getElementById("main-login-btn");
const mainSignupBtn = document.getElementById("main-signup-btn");
const passwordInputLogin = document.getElementById("password-input");
const passwordInputSignup = document.getElementById("password-input-signup");
const confirmPasswordInputSignup = document.getElementById("password-confirm-input-signup");

const openMenu = document.getElementById("open-menu");
const closeMenu = document.getElementById("close-menu");

const API_KEY = "91bcfbbf724997250681860f25a7ee4e"; 

const quickWeatherData = window.localStorage.getItem("quickWeatherData");

if(quickWeatherData){
    loginModalButton.style.display = "none";
    myAccountPageNav.style.display = "block";
    logoutNav.style.display = "block";
    let data = JSON.parse(quickWeatherData);
    checkData(data["email"], data["password"]).then((res) => {
        if(!res){
            window.localStorage.removeItem("quickWeatherData");
            window.location.reload();
        }
        else{
            autoWeatherDetails(data["lat"], data["lon"]);
        }
    });
    
}else{
    loginModalButton.style.display = "block";
    myAccountPageNav.style.display = "none";
    logoutNav.style.display = "none";
}

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { 
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { 
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        console.log(uniqueForecastDays);
        
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 5){
                return;
            }
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            
            console.log(latitude, longitude);
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
                saveLocation(latitude, longitude, name);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

loginModalButton.addEventListener("click", () => {
    var modal = document.getElementById("log-in-modal");
    console.log("on modal");
    modal.style.display = "block";
});


closeModalButton.addEventListener("click", () =>{
    var modal = document.getElementById("log-in-modal");
    modal.style.display = "none";
});

aboutPageNav.addEventListener("click", () => {
    window.location.href = "./about.html";
});

homePageNav.addEventListener("click", () => {
    window.location.href = "./index.html";
});



signupModalBtn.addEventListener("click", ()=>{
    var modal = document.getElementById("log-in-modal");
    modal.style.display = "none";
    var modal2 = document.getElementById("sign-up-modal");
    modal2.style.display = "block";
});

closeModalButton2.addEventListener("click", () => {
    var modal = document.getElementById("sign-up-modal");
    modal.style.display = "none";
});

loginModalButton2.addEventListener("click", () => {
    var modal = document.getElementById("sign-up-modal");
    modal.style.display = "none";
    var modal2 = document.getElementById("log-in-modal");
    modal2.style.display = "block";
});


mainLoginBtn.addEventListener("click", () => {
    var email = document.getElementById("email-input").value;
    var password = passwordInputLogin.value;
    if(email === "" || password === ""){
        alert("Enter Email/Password");
        return;
    }
    console.log(email, password);
    checkData(email, password).then((res) => {
        if(res){
            console.log("matched from listener");
            var modal = document.getElementById("log-in-modal");
            modal.style.display = "none";
            console.log(window.localStorage.getItem("quickWeatherData"));
            window.location.reload(true);
        }
    });
});

mainSignupBtn.addEventListener("click", () => {
    var name = document.getElementById("name-input-signup").value;
    var email = document.getElementById("email-input-signup").value;
    var password = passwordInputSignup.value;
    var confirmPassword = confirmPasswordInputSignup.value;

    if(name === "" || email === "" || password === "" || confirmPassword === ""){
        alert("Please fill all of the fields");
        return;
    }

    if(password != confirmPassword){
        alert("Password didn't match");
        return
    }
    console.log(name, email, password, confirmPassword);
    saveData(name, email, password).then((res) => {
        console.log("anything");
        if(res){
            console.log(res);
            alert("Signed Up successfully!");
            var modal = document.getElementById("sign-up-modal");
            modal.style.display = "none";
            var modal2 = document.getElementById("log-in-modal");
            modal2.style.display = "block";
        }
    }).catch((error) => {
        console.log(error);
    });
});


passwordInputLogin.addEventListener("mouseenter", () => {
    passwordInputLogin.type = "text";
});

passwordInputLogin.addEventListener("mouseleave", () => {
    passwordInputLogin.type = "password";
});


passwordInputSignup.addEventListener("mouseenter", () => {
    passwordInputSignup.type = "text";
});

passwordInputSignup.addEventListener("mouseleave", () => {
    passwordInputSignup.type = "password";
});


confirmPasswordInputSignup.addEventListener("mouseenter", () => {
    confirmPasswordInputSignup.type = "text";
});

confirmPasswordInputSignup.addEventListener("mouseleave", () => {
    confirmPasswordInputSignup.type = "password";
});

myAccountPageNav.addEventListener("click", () => {
    console.log("go to my account");
    window.location.href = "/account.html";
});

logoutNav.addEventListener("click", () => {
    window.localStorage.removeItem("quickWeatherData");
    window.location.reload(true);
});

openMenu.addEventListener("click", () => {
    var sidemenu = document.getElementById("sidemenu");
    sidemenu.style.right = "0";
});

closeMenu.addEventListener("click", () => {
    var sidemenu = document.getElementById("sidemenu");
    sidemenu.style.right = "-200px";
});

const autoWeatherDetails = (lat, lon) =>{
    const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    fetch(API_URL).then(response => response.json()).then(data => {
        console.log("1");
        const { name } = data[0];
        console.log(name, lat, lon);
        getWeatherDetails(name, lat, lon);
        console.log("2");
    }).catch(() => {
        alert("An error occurred while fetching the city name!");
    });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
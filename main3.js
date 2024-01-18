import { saveData, checkData } from "./database.js";


const aboutPageNav = document.getElementById("about-page");
const homePageNav = document.getElementById("home-page");
const myAccountPageNav = document.getElementById("my-account-page");
const logoutNav = document.getElementById("logout");

const name = document.getElementById("name");
const email = document.getElementById("email");
const location = document.getElementById("location");
const city = document.getElementById("city");

const openMenu = document.getElementById("open-menu");
const closeMenu = document.getElementById("close-menu");

const quickWeatherData = window.localStorage.getItem("quickWeatherData");
if(quickWeatherData){
    let data = JSON.parse(quickWeatherData);
    name.textContent = data["username"];
    email.textContent = `Email ID: ${data["email"]}`;
    location.textContent = `Latitude: ${data["lat"]}, Longitude: ${data["lon"]}`;
    city.textContent = `City: ${data["city"]}`;
    checkData(data["email"], data["password"]).then((res) => {
        if(!res){
            window.localStorage.removeItem("quickWeatherData");
            window.location.reload();
        }
    });
    
}else{
    window.location.href = "/index.html";
}


aboutPageNav.addEventListener("click", () => {
    window.location.href = "./about.html";
});

homePageNav.addEventListener("click", () => {
    window.location.href = "./index.html";
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
import { saveData, checkData } from "./database.js";

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
    });
    
}else{
    loginModalButton.style.display = "block";
    myAccountPageNav.style.display = "none";
    logoutNav.style.display = "none";
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
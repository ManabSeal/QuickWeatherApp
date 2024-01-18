// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {getDatabase, ref, set, get, child} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDf4GA--DwP8POVz3EKF4-ZvlqK8tfKcqk",
  authDomain: "quick-weather-app.firebaseapp.com",
  databaseURL: "https://quick-weather-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quick-weather-app",
  storageBucket: "quick-weather-app.appspot.com",
  messagingSenderId: "742484429707",
  appId: "1:742484429707:web:55ef89b9005501116dfd8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export function saveData(name, email_add, pass){
    return new Promise((resolve, reject) => {
      const db = getDatabase(app);
      const encodedEmail = btoa(email_add);
      const dbref = ref(db, "users/" + encodedEmail);
      get(dbref).then((snapshot) => {
        if(snapshot.exists()){
          alert("Email already exists! Try loging in.");
          resolve(false);
        }else{
          set(dbref, {
            email: email_add,
            username: name,
            password: pass,
            city: "",
            lat: 0,
            lon: 0
          });
          resolve(true);
        }
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });  
}


export function checkData(email_add, pass){
  return new Promise((resolve, reject) => {
    const db = getDatabase(app);
    const encodedEmail = btoa(email_add);
    const dbref = ref(db, "users/" + encodedEmail);
    get(dbref).then((snapshot) => {
      if(snapshot.exists()){
        get(child(dbref, "password/")).then((snapshot2) => {
          if(snapshot2.exists()){
            if(snapshot2.val() === pass){
              console.log("matched");
              //console.log(snapshot.val());
              window.localStorage.setItem("quickWeatherData", JSON.stringify(snapshot.val()));
              resolve(true);
            }else{
              console.log("password didn't match");
              alert("Password didn't match")
              resolve(false);
            }
          }
        });
      }else{
        console.log("email does not exist");
        alert("Email does not exist! Try Signing Up.");
        resolve(false);
      }
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
}

export function saveLocation(lat, lon, city){
  const db = getDatabase(app);
  const data = JSON.parse(window.localStorage.getItem("quickWeatherData"));
  if(!data){
    return;
  }
  const encodedEmail = btoa(data["email"]);
  const dbref = ref(db, "users/" + encodedEmail);
  get(dbref).then((snapshot) => {
    if(snapshot.exists()){
      data["lat"] = lat;
      data["lon"] = lon;
      data["city"] = city;
      set(dbref, data);
      window.localStorage.setItem("quickWeatherData", JSON.stringify(data));
      return;
    }else{
      alert("You have been logged out!");
      window.location.href = "/index.html";
    }
  }).catch((error) => {
    console.log(error);
  });
}
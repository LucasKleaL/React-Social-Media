import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage"
import "firebase/auth";

let firebaseConfig = {
    apiKey: "AIzaSyCewgzXUnaF2O8qi2Gx7etfdCMfbrHfg-k",
    authDomain: "kmf-social-media.firebaseapp.com",
    projectId: "kmf-social-media",
    storageBucket: "kmf-social-media.appspot.com",
    messagingSenderId: "732693080480",
    appId: "1:732693080480:web:2402e3d89f6aab78621cc5",
    measurementId: "G-D43R4QNQCE"
  };

if(!firebase.apps.lenght){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS5zt2HDHAKo_XtDDETe3ajjuBiuqgWGE",
  authDomain: "registropacman.firebaseapp.com",
  projectId: "registropacman",
  storageBucket: "registropacman.appspot.com",
  messagingSenderId: "53892477432",
  appId: "1:53892477432:web:5c8c7b8d3e7673b124a60d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = app.firestore();



export const addUser = (puntaje) => {
    db.collection("usuarios").add({
        nombre: localStorage.getItem('nombre'),
        apellido: localStorage.getItem('apellido'),
        mail: localStorage.getItem('email'),
        puntaje
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
};
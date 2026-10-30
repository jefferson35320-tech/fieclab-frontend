import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA9YkzBeuaLwGrxzL561nWJz3MrBJdwNUU",
  authDomain: "fieclab.firebaseapp.com",
  projectId: "fieclab",
  storageBucket: "fieclab.firebasestorage.app",
  messagingSenderId: "1023652959236",
  appId: "1:1023652959236:web:83da14ced6d25cd3599151",
  measurementId: "G-JRT0HG6W6H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
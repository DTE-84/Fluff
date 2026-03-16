import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, onIdTokenChanged, IdTokenResult,  UserCredential, UserMetadata,  Auth, AuthError, AdditionalUserInfo, AuthProvider, AuthCredential  } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

import { collection, addDoc } from 'firebase/firestore';

const db = getFirestore();


const usersCollection = collection(db, 'users');

addDoc(usersCollection, {
  name: 'John Doe',
  email: 'johndoe@example.com'
})
  .then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
  });

dotenv.config();
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

firebase.initializeApp(firebaseConfig);


const email = 'johndoe@example.com';
const password = 'password123';

// Create a new user with email and password
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // User created successfully
    const user = userCredential.user;
    // Add the user data to Firestore
    const usersCollection = collection(db, 'users');
    addDoc(usersCollection, {
      email: user.email,
      uid: user.uid
    });
  })
  .catch((error) => {
    // Handle error
    console.error(error);
  });


  function someFunction() {
    // Use db to store and retrieve data
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // You can now use the exported values
    return {
      app,
      auth,
      db
    };
  }
  
  export default someFunction;
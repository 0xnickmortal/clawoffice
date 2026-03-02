import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA0z6HqeXvH2Z_8ybXMRSRXP4Qr6EYbWGY",
  authDomain: "claw-office.firebaseapp.com",
  projectId: "claw-office",
  storageBucket: "claw-office.firebasestorage.app",
  messagingSenderId: "726039200400",
  appId: "1:726039200400:web:31f8cec950b8271d648e15",
  measurementId: "G-1XZVKHDY37"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

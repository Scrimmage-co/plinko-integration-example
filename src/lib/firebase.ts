/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { initializeApp } from 'firebase/app'
import { useDeviceLanguage, getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SCRIMMAGE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_SCRIMMAGE_FIREBASE_AUTH_DOMAIN,
  projectId: 'bright-practice-331514',
  storageBucket: 'bright-practice-331514.appspot.com',
  messagingSenderId: '1066767678808',
  appId: import.meta.env.VITE_SCRIMMAGE_FIREBASE_APP_ID,
  measurementId: 'G-L539R7ELBV'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const database = getDatabase(app)

export const functions = getFunctions(app)

useDeviceLanguage(auth)

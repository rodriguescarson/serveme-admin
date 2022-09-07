import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// import 'firebase/firestore';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCAJz0iWb-xGKo4MQ_s4OcaUD7XZQbrvFg',
  authDomain: 'serveme-9906a.firebaseapp.com',
  databaseURL: 'https://serveme-9906a-default-rtdb.firebaseio.com',
  projectId: 'serveme-9906a',
  storageBucket: 'serveme-9906a.appspot.com',
  messagingSenderId: '686369981334',
  appId: '1:686369981334:web:aa25b5d3d6fb6ae448d3b7',
  measurementId: 'G-6175TRQF88',
}

// export {db};
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getDatabase(app)

export { auth, db }

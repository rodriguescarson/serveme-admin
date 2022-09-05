import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

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
// const db = firebase.firestore();

// export {db};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const auth = firebase.auth()
// var docData = {
//   stringExample: 'Hello world!',
//   booleanExample: true,
//   numberExample: 3.14159265,
//   dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
//   arrayExample: [5, true, 'hello'],
//   nullExample: null,
//   objectExample: {
//     a: 5,
//     b: {
//       nested: 'foo',
//     },
//   },
// }
// db.collection('serveme-admin')
//   .doc()
//   .set(docData)
//   .then(() => {
//     console.log('Document successfully written!')
//   })
export { db, auth }

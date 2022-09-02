import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// import 'firebase/firestore';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCRWKnQII7abE1DECObcpf0kZZI8VZhx9g',
  authDomain: 'chatbot-dbce.firebaseapp.com',
  projectId: 'chatbot-dbce',
  storageBucket: 'chatbot-dbce.appspot.com',
  messagingSenderId: '1082274589518',
  appId: '1:1082274589518:web:ccb2b09481273e6bea4c1f',
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

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  setDoc,
  connectFirestoreEmulator,
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
} from 'firebase/auth'

// テストデータをインポートする
import customers from './test-data-customers.json'
import products from './test-data-products.json'
import users from './test-data-users.json'
import firebase from 'firebase/compat/app'

const firebaseConfig = {
  apiKey: "AIzaSyDsno6Y7F3Rn5jQ0zPdgl17CwD4rZJoK18",
  authDomain: "clouderp-26a4c.firebaseapp.com",
  databaseURL: "https://clouderp-26a4c-default-rtdb.firebaseio.com",
  projectId: "clouderp-26a4c",
  storageBucket: "clouderp-26a4c.appspot.com",
  messagingSenderId: "16712299211",
  appId: "1:16712299211:web:bbfdc77072215c0f00e14e",
}

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()

// Firestoreエミュレーターに接続
connectFirestoreEmulator(db, 'localhost', 8080)

// Authenticationエミュレーターに接続
connectAuthEmulator(auth, 'http://127.0.0.1:9099')

async function importTestData(): Promise<void> {
  // 顧客データのインポート
  for (const customer of customers) {
    const customerRef = doc(db, 'customers', customer.id)
    await setDoc(customerRef, customer)
  }

  // 商品データのインポート
  for (const product of products) {
    const productRef = doc(db, 'products', product.productId)
    await setDoc(productRef, product)
  }

  // // Authenticationユーザーのインポート
  // for (const user of users) {
  //   try {
  //     await createUserWithEmailAndPassword(auth, user.email, user.password)
  //   } catch (error: unknown) { // TypeScript 4.0以降の構文
  //     if (error instanceof Error && error.name === 'FirebaseError') {
  //       const firebaseError = error as firebase.FirebaseError // エラーをFirebaseError型にキャスト
  //       if (firebaseError.code === 'auth/email-already-in-use') {
  //         console.log(`User already exists: ${user.email}`)
  //       } else {
  //         console.error('Error creating user:', firebaseError)
  //       }
  //     } else {
  //       console.error('Unknown error:', error)
  //     }
  //   }
  // }

  console.log('All test data imported successfully.')
}

importTestData().catch(console.error)

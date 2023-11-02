import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  DocumentSnapshot
} from "firebase/firestore"
import { Customer } from "../types"
import { db } from "../firebase"

// Firestoreから取得したデータをCustomer型に変換するヘルパー関数
function convertDocToCustomer(doc: DocumentSnapshot): Customer {
  const data = doc.data()
  if (!data) throw new Error('Document data is undefined')
  // ここでデータの検証や変換を行う
  return {
    id: doc.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    // 他の 'Customer' 型のプロパティ...
  } as Customer // ここでは型アサーションを使用していますが、実際にはより厳密な型チェックが必要です
}

// 顧客情報を取得する関数
export async function getCustomers(): Promise<Customer[]> {
  const customersCol = collection(db, 'customers')
  const customerSnapshot = await getDocs(customersCol)
  return customerSnapshot.docs.map(convertDocToCustomer)
}

// 特定の顧客情報を取得する関数
export async function getCustomer(id: string): Promise<Customer> {
  const customerRef = doc(db, 'customers', id)
  const customerSnap = await getDoc(customerRef)
  if (!customerSnap.exists()) throw new Error('Customer does not exist')
  return convertDocToCustomer(customerSnap)
}

// 顧客情報を更新する関数
export async function updateCustomer(id: string, updateData: Partial<Customer>): Promise<void> {
  const customerRef = doc(db, 'customers', id)
  await updateDoc(customerRef, updateData)
}

// 新しい顧客をFirestoreに追加する関数
export async function addNewCustomer(customerData: Customer): Promise<void> {
  try {
    await addDoc(collection(db, "customers"), {
      ...customerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding customer: ", error)
    throw new Error('Error adding customer')
  }
}

import {
  collection,
  getDocs,
  setDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  DocumentSnapshot,
  runTransaction
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

// カウンターをトランザクションを使用して更新する関数
async function getNewCustomerId(): Promise<string> {
  const counterRef = doc(db, "counters", "customers")

  try {
    const newCount = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef)
      const currentCount = counterDoc.data()?.count || 0
      const newCount = currentCount + 1
      transaction.set(counterRef, { count: newCount })
      return newCount
    })

    return newCount.toString() // 新しいIDを文字列として返す
  } catch (error) {
    console.error("Transaction failed: ", error)
    throw new Error('Transaction failed')
  }
}

// 新しい顧客をFirestoreに追加する関数
export async function addNewCustomer(customerData: Customer): Promise<void> {
  try {
    const newId = await getNewCustomerId() // 新しいIDを取得
    const customerRef = doc(db, "customers", newId)
    await setDoc(customerRef, {
      ...customerData,
      id: newId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding customer: ", error)
    throw new Error('Error adding customer')
  }
}
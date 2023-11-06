import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase' // あなたのFirebase設定をインポートするパスに置き換えてください
import { Customer } from '../types'

/**
 * 顧客情報検索クエリ
 */

/** 顧客名検索 */
export async function customerSearchByName(customerName:string){
  const customersQuery = query(collection(db, 'customers'), where('name', '>=', customerName))
  const querySnapshot = await getDocs(customersQuery)
  const searchResults = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[]
  return searchResults
}



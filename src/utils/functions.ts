// functions.ts

import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Customer } from "./types";

// 新しい顧客をFirestoreに追加する関数
export async function addNewCustomer(customerData: Customer): Promise<void> {
  try {
    await addDoc(collection(db, "customers"), {
      ...customerData,
      // FirestoreのTimestampに変換
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding customer: ", error);
  }
}

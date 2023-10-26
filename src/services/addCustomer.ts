import { firestore } from "./firebase";

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export const addCustomer = async (customerData: Customer): Promise<void> => {
  try {
    const docRef = await firestore.collection("customers").add(customerData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

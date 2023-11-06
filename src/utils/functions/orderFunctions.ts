// src/utils/orderFunctions.ts
import { collection, Timestamp, doc, setDoc, runTransaction } from 'firebase/firestore'
import { db } from '../firebase' // 正しいパスに修正してください
import { Customer, Order, OrderItem } from '../types' // 正しいパスに修正してください

export const submitOrder = async (
  customer: Customer | null,
  order: Order,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  alert: (msg: string) => void
) => {
  if (!customer || !customer.id) {
    alert('顧客情報が不足しています。')
    return
  }

  setIsLoading(true)
  try {
    // 注文番号を取得・更新するトランザクションを開始
    const orderNumber = await runTransaction(db, async (transaction) => {
      const currentYear = new Date().getFullYear()
      const counterRef = doc(db, 'counters', 'orders')
      const counterDoc = await transaction.get(counterRef)
      let newCount = 1 // 新しい年の場合は1から開始

      if (counterDoc.exists()) {
        const data = counterDoc.data()
        if (data.year === currentYear) {
          newCount = data.count + 1
        }
      }

      const newOrderNumber = `${currentYear}-${String(newCount).padStart(8, '0')}`
      transaction.set(counterRef, { count: newCount, year: currentYear })
      return newOrderNumber
    })

    // 注文アイテムごとの小計を計算
    const updatedOrderItems = orderItems.map(item => ({
      ...item,
      subtotal: item.price * item.quantity // 小計を計算して追加
    }))

    // Order型に基づいて注文データを作成
    const orderData: Order = {
      orderNumber: orderNumber,
      customerId: customer.id,
      orderDate: Timestamp.now(),
      totalAmount: updatedOrderItems.reduce((total, item) => total + item.subtotal, 0),
      items: updatedOrderItems
    }

    // 注文ドキュメントを作成
    const orderRef = doc(db, 'orders', orderNumber)
    await setDoc(orderRef, orderData)

    // 注文アイテムをサブコレクションに追加
    const orderItemsCol = collection(orderRef, 'orderItems')
    const orderItemsPromises = updatedOrderItems.map((item, index) => {
      const itemId = `${index + 1}`
      const orderItemRef = doc(orderItemsCol, itemId)
      return setDoc(orderItemRef, item)
    })

    await Promise.all(orderItemsPromises)

    alert('注文が登録されました。')
    setOrderItems([{ productId: '', name: '', quantity: 1, price: 0, productData: null, subtotal: 0 }])
  } catch (error) {
    console.error('Error adding order: ', error)
    alert('注文の登録に失敗しました。')
  } finally {
    setIsLoading(false)
  }
}

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../../src/utils/firebase'
import { Order, OrderItem } from '../../../src/utils/types'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import Button from '../../../src/components/button'

const OrderDetailsPage = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { orderId } = router.query

  // 前のページに戻る関数
  const handleBack = () => {
    router.back()
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return

      try {
        const orderRef = doc(db, 'orders', orderId as string)
        const orderSnap = await getDoc(orderRef)

        // 注文詳細を取得する部分
        if (orderSnap.exists()) {
          // スプレッド演算子を使用する前にorderIdを設定します
          const orderData: Order = {
            orderId: orderSnap.id,
            ...(orderSnap.data() as Omit<Order, 'orderId'>) // orderIdプロパティを除外
          }
          setOrder(orderData)
        
          // OrderItemsのサブコレクションを取得
          const orderItemsRef = collection(orderRef, 'orderItems')
          const orderItemsSnap = await getDocs(orderItemsRef)
          const items = orderItemsSnap.docs.map(doc => ({
            id: doc.id, // OrderItem型にidプロパティを追加
            ...(doc.data() as Omit<OrderItem, 'id'>) // idプロパティを除外
          })) as OrderItem[]
        
          setOrderItems(items)
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">注文情報</h2>
      <div>
        <p><strong>注文番号:</strong> {order.orderId}</p>
        <p><strong>注文者名:</strong> {order.customerId}</p>
        <p><strong>注文日:</strong> {order.orderDate.toDate().toLocaleString()}</p>
        <p><strong>注文合計金額:</strong> {order.totalAmount}</p>
        {/* 他の注文情報もここに表示 */}
      </div>
      {/* 注文の詳細情報を表示 */}
      <div>
        {/* ...他の注文詳細情報 */}
        <h2 className="text-xl font-bold mb-4">注文アイテム</h2>
        <table>
          <thead>
            <tr>
              <th>商品ID</th>
              <th>商品名</th>
              <th>数量</th>
              <th>単価</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.orderIndex}>
                <td>{item.productId}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <span className="block w-full rounded-md shadow-sm">
          <Button label="戻る"
            onClick={handleBack} // onClickイベントにhandleBackを割り当てる
          />
        </span>
      </div>
    </div>
  )
}

export default OrderDetailsPage

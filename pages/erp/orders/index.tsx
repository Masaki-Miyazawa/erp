// pages/orders.tsx
import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../../src/utils/firebase' // 正しいパスに修正してください
import { Order } from '../../../src/utils/types' // Order 型を適切に定義してください

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Firestore から注文データを取得
        const ordersQuery = query(collection(db, 'orders'), orderBy('orderDate', 'desc'))
        const querySnapshot = await getDocs(ordersQuery)
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[]

        setOrders(fetchedOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        // エラーハンドリングを適切に行ってください
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">注文一覧</h1>
      <div>
        {orders.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr>
                <th>注文番号</th>
                <th>顧客ID</th>
                <th>注文日</th>
                <th>合計金額</th>
                {/* 必要に応じて他のヘッダーを追加 */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerId}</td>
                  <td>{order.orderDate.toDate().toLocaleDateString()}</td>
                  <td>{order.totalAmount}</td>
                  {/* 必要に応じて他のデータを表示 */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>注文はありません。</p>
        )}
      </div>
    </div>
  )
}

export default OrdersPage

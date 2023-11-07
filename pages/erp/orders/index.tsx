// pages/orders.tsx
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../../src/utils/firebase' // 正しいパスに修正してください
import { Order } from '../../../src/utils/types' // Order 型を適切に定義してください
import Button from '../../../src/components/button'
import Link from 'next/link'

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  // 前のページに戻る関数
  const handleBack = () => {
    router.back()
  }

  // 注文登録画面へ遷移
  const handleOrderForm = () => {
    router.push('./orders/order-form')
  }


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Firestore から注文データを取得
        const ordersQuery = query(collection(db, 'orders'), orderBy('orderDate', 'desc'))
        const querySnapshot = await getDocs(ordersQuery)
        const fetchedOrders = querySnapshot.docs.map((doc) => {
          // doc.data() が Order 型に適合することを確認し、id を含める
          const data = doc.data() as Order
          return {
            ...data,
          }
        })
  
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
      <div className="mt-6">
        <span className="block w-full rounded-md shadow-sm">
          <Button label="新規注文追加"
            onClick={handleOrderForm} // onClickイベントにhandleBackを割り当てる
          />
        </span>
      </div>
      <div>
        {orders.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr>
                <th>注文ID</th>{/* 注文IDのヘッダーを追加 */}
                <th>顧客ID</th>
                <th>注文日</th>
                <th>合計金額</th>
                {/* 必要に応じて他のヘッダーを追加 */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    {/* 注文IDをクリックすると注文詳細ページに遷移するリンクを追加 */}
                    <Link href={`./orders/${order.orderId}`}>
                      {order.orderId}
                    </Link>
                  </td>
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

export default OrdersPage

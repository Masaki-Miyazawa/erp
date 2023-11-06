// pages/order-form.tsx
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc, Timestamp} from 'firebase/firestore'
import { db } from '../../../src/utils/firebase'
import Button from '../../../src/components/button'
import Modal from '../../../src/components/modal'
import { Customer, Product} from '../../../src/utils/types'
import { submitOrder } from '../../../src/utils/functions/orderFunctions'
import { Order, OrderItem } from '../../../src/utils/types'


const OrderForm = () => {

  const [customer, setCustomer] = useState<Customer>({
    id: '',
    name: '',
    email: '',
    phone:'',
    address:'',
    createdAt: null,
    updatedAt: null,
  })
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>('')
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false) // ローディング状態を管理するステート
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: '', name: '', quantity: 1, price: 0, productData: null, subtotal:0},
  ])

  // 注文情報を状態として保持
  // 注文情報を状態として保持
  const [order, setOrder] = useState<Omit<Order, 'id' | 'orderDate'>>({
    customerId: '',
    orderItems: [],
    totalAmount: 0,
  })


  const addOrderItem = () => {
    setOrderItems(currentOrderItems => [
      ...currentOrderItems,
      { productId: '', name: '', quantity: 1, price: 0, productData: null, subtotal: 0 },
    ])
  }

  
  
  // 商品IDが入力されたらその商品データを取得する関数
  const fetchProductData = async (productId: string, index: number) => {
    if (!productId) return
  
    const productRef = doc(db, 'products', productId)
    const productSnap = await getDoc(productRef)
  
    setOrderItems(currentOrderItems => {
      const newOrderItems = [...currentOrderItems]
      if (productSnap.exists()) {
        const productData = productSnap.data() as Product
        newOrderItems[index] = {
          ...newOrderItems[index],
          productData: productData,
          price: productData.price,
          name: productData.name,
          // 商品データが取得できたらsubtotalを更新
          subtotal: newOrderItems[index].quantity * productData.price,
        }
      } else {
        // 商品が見つからなかった場合、productDataをnullに設定し、fetchAttemptedをtrueにする
        newOrderItems[index] = {
          ...newOrderItems[index],
          productData: null,
          fetchAttempted: true,
        }
      }
  
      // 合計金額を更新
      setOrder(prevOrder => ({
        ...prevOrder,
        totalAmount: calculateTotalAmount(newOrderItems),
      }))
  
      return newOrderItems
    })
  }
  

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setCustomerSearchResults([]) // モーダルを閉じるときに検索結果をクリア
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    setOrderItems(currentOrderItems => {
      const newOrderItems = [...currentOrderItems]
      const newItem = { ...newOrderItems[index] }
  
      if (field === 'productId') {
        newItem.productId = value as string
        // fetchProductDataは非同期関数なので、ここでは呼び出さない
      } else if (field === 'quantity' || field === 'price') {
        newItem[field] = Number(value)
        // 新しいsubtotalを計算
        newItem.subtotal = newItem.price * newItem.quantity
      }
  
      newOrderItems[index] = newItem
  
      // 合計金額を更新
      setOrder(prevOrder => ({
        ...prevOrder,
        totalAmount: calculateTotalAmount(newOrderItems),
      }))
  
      return newOrderItems
    })
  }
  
  
  const removeOrderItem = (index: number) => {
    setOrderItems(currentOrderItems => {
      const newOrderItems = [...currentOrderItems]
      newOrderItems.splice(index, 1)
  
      // Update the total amount after the order item has been removed
      setOrder(prevOrder => ({
        ...prevOrder,
        totalAmount: calculateTotalAmount(newOrderItems),
      }))
  
      return newOrderItems
    })
  }
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
  
    // 注文日時を設定
    const orderToSubmit = {
      ...order,
      id: "", // このIDは後で生成するか、またはサーバー側で生成されるべきです。
      orderItems: orderItems,
      orderDate: Timestamp.now(),
    }
  
    setIsLoading(true)
    try {
      // submitOrder 関数を呼び出し、order オブジェクトを渡す
      await submitOrder(customer, orderToSubmit, setIsLoading, alert)
      // 注文が成功したらアラートを表示し、状態を初期化する
      alert('注文が正常に登録されました。')
      // 状態を初期化する
      setCustomer({
        id: '',
        name: '',
        email: '',
        phone:'',
        address:'',
        createdAt: null,
        updatedAt: null,
      })
      setOrderItems([{ productId: '', name: '', quantity: 1, price: 0, productData: null, subtotal:0 }])
      setOrder({
        customerId: '',
        orderItems: [],
        totalAmount: 0,
      })
    } catch (error) {
      // エラーが発生した場合はユーザーに通知する
      console.error('注文の登録に失敗しました:', error)
      alert('注文の登録に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCustomerSearchChange = (value: string) => {
    setCustomerSearchTerm(value)
  }

  const searchCustomers = async () => {
    const customersQuery = query(collection(db, 'customers'), where('name', '>=', customerSearchTerm))
    const querySnapshot = await getDocs(customersQuery)
    const searchResults = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[]
    setCustomerSearchResults(searchResults)
  }

  const selectCustomer = (customer: Customer) => {
    setCustomer(customer)
    setCustomerSearchResults([]) // 検索結果をクリア
  }

  // 商品IDが入力されるたびにfetchProductDataを呼び出す
  useEffect(() => {
    const fetchAllProductData = async () => {
      setIsLoading(true)
      try {
        await Promise.all(orderItems.map(async (item, index) => {
          // 商品データがまだない、かつ商品IDが空でない、かつフェッチがまだ試みられていない場合にのみフェッチする
          if (!item.productData && item.productId && !item.fetchAttempted) {
            await fetchProductData(item.productId, index)
          }
        }))
      } catch (error) {
        console.error('Error fetching product data:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    // 商品IDが存在し、かつ商品データがまだない、かつフェッチがまだ試みられていないアイテムがある場合のみフェッチを行う
    if (orderItems.some(item => item.productId && !item.productData && !item.fetchAttempted)) {
      fetchAllProductData()
    }
  }, [orderItems])

  const calculateTotalAmount = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.subtotal, 0)
  }

  // 注文アイテムの金額を計算する関数
  const calculateItemTotal = (index: number) => {
    const item = orderItems[index]
    return item.productData ? item.productData.price * item.quantity : 0
  }

  // 注文アイテムが変更されるたびに合計金額を再計算
  useEffect(() => {
    setOrder(prevOrder => ({
      ...prevOrder,
      totalAmount: calculateTotalAmount(orderItems),
    }))
  }, [orderItems])
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">注文フォーム</h1>
      <Button label="顧客検索" onClick={openModal} />
      {/* モーダル */}
      <Modal show={isModalOpen} onClose={closeModal} title="顧客検索">
        <div className="mt-2">
          <input
            type="text"
            placeholder="顧客名で検索"
            value={customerSearchTerm}
            onChange={(e) => handleCustomerSearchChange(e.target.value)}
            className="border p-1 mr-2 w-full"
          />
          <Button label="検索" onClick={searchCustomers} />
          <ul className="mt-3">
            {customerSearchResults.map((result) => (
              <li key={result.id} className="cursor-pointer hover:bg-gray-100" onClick={() => { selectCustomer(result); closeModal() }}>
                {result.name} ({result.email})
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <form onSubmit={handleSubmit}>
        {/* 選択された顧客情報 */}
        {customer.id != null && (
          <div className="mb-4">
            <p>顧客ID: {customer.id ? customer.id.toString() : 'IDがありません'}</p>
            <p>顧客名: {customer.name}</p>
            <p>顧客メール: {customer.email}</p>
          </div>
        )}

        {/* 注文アイテム入力フィールド */}
        {orderItems.map((item, index) => (
          
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder="商品ID"
              value={item.productId}
              onChange={(e) => {
                handleItemChange(index, 'productId', e.target.value)
                fetchProductData(e.target.value, index) // IDが変更されたときに商品データを取得
              }}
              className="border p-1 mr-2"
            />

            {/* 商品データを表示 */}
            {item.productData && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{item.productData.name}</h3>
                <p>{item.productData.description}</p>
                <p>価格: ¥{item.productData.price}</p>
                {/* 必要に応じて他の商品詳細を表示 */}
              </div>
            )}
            {/* 商品データが見つからなかったときのメッセージ */}
            {item.fetchAttempted && !item.productData && (
              <div className="text-red-500">
                商品が見つかりませんでした。別の商品IDを試してください。
              </div>
            )}
            {/* 数量入力フィールド */}
            <input
              type="number"
              placeholder="数量"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="border p-1 mr-2"
            />

            {/* 商品単価と金額を表示 */}
            <div className="flex-1">
              {item.productData && (
                <p>単価: ¥{item.productData.price} - 金額: ¥{calculateItemTotal(index)}</p>
              )}
            </div>
            
            <Button label="削除" onClick={() => removeOrderItem(index)} disabled={isLoading}/>
          </div>
        ))}
        <Button label="アイテムを追加" onClick={addOrderItem} disabled={isLoading} />
        {/* 合計金額を表示 */}
        <div className="my-4">
          <h3 className="text-lg font-semibold">合計金額: ¥{order.totalAmount}</h3>
        </div>


        <Button label="注文を登録" type="submit" disabled={isLoading} />
        {/* 商品データが見つからなかったときのメッセージ */}
        
      </form>
      {/* ローディングインジケーターを表示 */}
      {isLoading && <div>Loading...</div>}
    </div>
  )
}

export default OrderForm
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { getCustomers } from '../../src/utils/functions/customerfunctions'
import { Customer } from '../../src/utils/types'
import { Key } from 'react'

// Propsの型定義
interface CustomersPageProps {
  customerList: Customer[]
  error?: string
}

// サーバーサイドレンダリングのための関数
export const getServerSideProps: GetServerSideProps<CustomersPageProps> = async () => {
  try {
    const customerList = await getCustomers()
    return { props: { customerList } }
  } catch (e) {
    console.error(e)
    return { props: { customerList: [], error: '顧客情報の取得に失敗しました。' } }
  }
}

// コンポーネントの定義
const CustomersPage: React.FC<CustomersPageProps> = ({ customerList, error }) => {
  const router = useRouter()

  // 前のページに戻る関数
  const handleBack = () => {
    router.back()
  }

  // 顧客の新規登録ページに遷移する関数
  const handleAddNewCustomer = () => {
    router.push('add-new-customer')
  }
  // ボタンクリックで編集ページに遷移するハンドラ
  const handleEditClick = (customerId: Key | null | undefined) => {
    // customerIdがnullまたはundefinedでないことを確認し、stringに変換する
    if (customerId !== null && customerId !== undefined) {
      router.push(`/crm/edit/${String(customerId)}`)
    } else {
      // customerIdがnullまたはundefinedの場合のエラーハンドリング
      console.error('Customer ID is null or undefined')
    }
  }

  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">顧客一覧</h1>
      <div className="mt-6">
        <span className="block w-full rounded-md shadow-sm">
          <button
            type="button" // ここを 'button' に変更してください
            onClick={handleAddNewCustomer} // onClickイベントにhandleBackを割り当てる
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
          >
          新規顧客登録
          </button>
        </span>
      </div>
      <div className="flex flex-wrap -mx-2">
        {customerList.map((customer) => (
          <div key={customer.id} className="p-2 w-1/2 md:w-1/3 lg:w-1/4">
            <div className="border rounded shadow p-4 bg-white flex justify-between items-center">
              <div>
                <p className="mr-2">名前: {customer.name}</p>
                <p>メール: {customer.email}</p>
                {/* 他の顧客情報も同様に追加 */}
              </div>
              {/* ボタンを使用して編集ページに遷移 */}
              <button
                onClick={() => handleEditClick(customer.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                編集
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <span className="block w-full rounded-md shadow-sm">
          <button
            type="button" // ここを 'button' に変更してください
            onClick={handleBack} // onClickイベントにhandleBackを割り当てる
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
          >
          戻る
          </button>
        </span>
      </div>
    </div>
    
  )
}

export default CustomersPage
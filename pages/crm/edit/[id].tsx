import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getCustomer, updateCustomer } from '../../../src/utils/functions/customerfunctions'
import { Customer } from '../../../src/utils/types'

export default function EditCustomerPage() {
  const router = useRouter()
  const { id } = router.query
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof id === 'string') {
      setLoading(true)
      getCustomer(id)
        .then((data) => {
          setCustomer(data)
        })
        .catch((error) => {
          console.error(error)
          // エラーハンドリングを適切に行う
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id])

  // 前のページに戻る関数
  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (customer && typeof id === 'string') {
      setLoading(true)
      try {
        await updateCustomer(id, customer)
        router.push('/crm') // 更新後に顧客一覧ページに戻る
      } catch (error) {
        console.error(error)
        // エラーハンドリングを適切に行う
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (!customer) return <div>顧客情報を読み込めませんでした。</div>

  // 以下のinputフィールドでcustomerがnullでないことを保証するために、
  // customerの存在を確認する条件を追加します。
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">顧客情報編集</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            名前
          </label>
          <input
            type="text"
            id="name"
            value={customer?.name || ''}
            onChange={(e) => customer && setCustomer({ ...customer, name: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {/* 他のフィールドも同様に追加 */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            更新
          </button>
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
      </form>
    </div>
  )
}

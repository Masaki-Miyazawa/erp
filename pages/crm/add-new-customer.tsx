// pages/resistorationCustomer.tsx
import { useState } from "react"
import { addNewCustomer } from "../../src/utils/functions/customerFunctions"
import { Customer } from "../../src/utils/types"
import { Timestamp } from "firebase/firestore"
import { GetServerSideProps } from "next"
import { checkAuth } from "../../src/utils/auth"
import { useRouter } from 'next/router'

export default function CRM() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  
  // useRouterフックを使用してrouterオブジェクトを取得
  const router = useRouter()

  // 前のページに戻る関数
  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    //Dateオブジェクト
    const dateObject = new Date()

    // DateオブジェクトからFirestoreのTimestampに変換
    const timestamp = Timestamp.fromDate(dateObject)

    // Customer インターフェースに基づいて顧客データを作成
    const customerData: Customer = {
      id: undefined,
      name,
      email,
      phone,
      address,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    

    try {
      await addNewCustomer( customerData )
      // 登録後の処理
      setName("")
      setEmail("")
      setPhone("")
      setAddress("")
    } catch (err) {
      setError("データの保存に失敗しました。")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          CRM顧客情報登録
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                名前
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                メールアドレス
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                電話番号
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="phone"
                  type="tel"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                住所
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <textarea
                  id="address"
                  required
                  rows={3}
                  className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  登録
                </button>
              </span>
            </div>
          </form>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // checkAuthヘルパー関数を使用して認証チェックを行う
  return await checkAuth(context)
}

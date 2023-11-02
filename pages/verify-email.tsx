// pages/verify-email.tsx
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { auth } from "../src/utils/firebase"
import { onAuthStateChanged } from "firebase/auth"

const VerifyEmail = () => {
  const router = useRouter()

  useEffect(() => {
    // Firebase Authの状態を監視し、メールが検証されたらユーザーをダッシュボードにリダイレクトします
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        router.push('/dashboard') // メール検証後にユーザーをダッシュボードにリダイレクトします
      }
    })

    // コンポーネントのアンマウント時にリスナーを解除します
    return unsubscribe
  }, [router])

  //サイインページに遷移する
  const handleSignIn = () => {
    router.push('/signin')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          メールアドレスの検証
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ご登録のメールアドレスに送信された検証リンクをクリックしてください。
          メールが見つからない場合は、迷惑メールフォルダをご確認いただくか、
          下記から再送信してください。
        </p>

        {/* 再送信用のボタンやリンクを提供します */}
        <div className="mt-6 flex justify-center">
          <Link href="/resend-verification">
            <button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            検証メールを再送信
            </button>
          </Link>
        </div>
        <div className="mt-6">
          <span className="block w-full rounded-md shadow-sm">
            <button
              type="button" // ここを 'button' に変更してください
              onClick={handleSignIn} // onClickイベントにhandleBackを割り当てる
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
            >
                サインイン
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

// pages/signin.tsx
import { useState } from "react"
import { useRouter } from "next/router"
import { signInWithEmailAndPassword } from "../src/utils/firebase" // Firebase 設定をインポート
import { setCookie } from "nookies"
import { getAuth } from "firebase/auth"
import Link from "next/link"

export default function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [emailVerified, setEmailVerified] = useState(true)
  const router = useRouter()

  // 前のページに戻る関数
  const handleSignUp = () => {
    router.push('/signup')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    try {
      const auth = getAuth() // Firebase v9+ のAuthインスタンスの取得方法
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // メールが検証されているかチェック
      if (!userCredential.user.emailVerified) {
        setEmailVerified(false) // メールが検証されていない場合はfalseに設定
        setError("メールアドレスがまだ検証されていません。メールを確認してください。")
        return // ここで処理を終了
      }

      console.log("You are signed in!")
      const token = await userCredential.user.getIdToken()
      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
      router.push("/home")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("サインイン中にエラーが発生しました。")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            サインイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Emailアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Emailアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              サインイン
            </button>
          </div>
          <div className="mt-6">
            <span className="block w-full rounded-md shadow-sm">
              <button
                type="button" // ここを 'button' に変更してください
                onClick={handleSignUp} // onClickイベントにhandleBackを割り当てる
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
              >
                サインアップ
              </button>
            </span>
          </div>
        </form>
        {error && (
          <div className="mt-2 text-center">
            <p className="text-sm text-red-600">{error}</p>
            {!emailVerified && ( // emailVerifiedがfalseの場合にリンクを表示
              <Link href="/resend-verification">
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  検証メールを再送信
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

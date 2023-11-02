// pages/home.tsx
import { useRouter } from 'next/router'
import { getAuth, signOut } from 'firebase/auth'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { checkAuth } from '../src/utils/auth'
import { destroyCookie } from 'nookies'

export default function Home() {
  const router = useRouter()

  const handleLogout = async () => {
    const auth = getAuth()
    try {
      await signOut(auth)
      // サインアウト成功後、Cookieを削除
      destroyCookie(null, 'token', { path: '/' })
      // ログアウト後にサインインページにリダイレクト
      router.push('/signin')
    } catch (error) {
      // エラーハンドリング
      console.error('ログアウトに失敗しました', error)
    }
  }

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">ホームページ</h1>
        <nav>
          <ul className="space-y-4">
            {/* 他のメニューアイテム */}
            <li>
              <Link href="/crm/customers">
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >  CRM
                </button>
              </Link>
            </li>
            <li>
              <Link href="/crm/customers">
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >  CRM
                </button>
              </Link>
            </li>
            <li>
              <Link href="/update-profile">
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >  ユーザー情報
                </button>
              </Link>
            </li>
            {/* 他のメニューアイテム */}
            <li>
              {/* ログアウトボタン */}
              <button
                onClick={handleLogout}
                className="inline-block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ログアウト
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // checkAuthヘルパー関数を使用して認証チェックを行う
  return await checkAuth(context)
}
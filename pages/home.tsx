// pages/home.tsx
import { useRouter } from 'next/router'
import { getAuth, signOut } from 'firebase/auth'
import { GetServerSideProps } from 'next'
import { checkAuth } from '../src/utils/auth'
import { destroyCookie } from 'nookies'
import Button from '../src/components/button' // 正しいパスに変更してください


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

  const handleCrm = () =>{
    // crmページにリダイレクト
    router.push('/crm/customers')
  }
  const handleErp = () =>{
    // Erpページにリダイレクト
    router.push('/erp/erp-top')
  }
  const handleUserProfile = () =>{
    // ユーザー情報ページにリダイレクト
    router.push('/update-profile')
  }

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">ホームページ</h1>
        <nav>
          <ul className="space-y-4">
            {/* 他のメニューアイテム */}
            <li>
              <Button label="CRM" onClick={handleCrm}/>
            </li>
            <li>
              <Button label="ERP" onClick={handleErp}/>
            </li>
            <li>
              <Button label="ユーザー情報" onClick={handleUserProfile}/>
            </li>
            {/* 他のメニューアイテム */}
            <li>
              {/* ログアウトボタン */}
              <Button label="ログアウト" onClick={handleLogout}/>
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
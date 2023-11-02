// pages/update-profile.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../src/utils/firebase' // utils/firebase.ts から auth をインポート
import { GetServerSideProps } from 'next'
import { checkAuth } from '../src/utils/auth'

export default function UpdateProfile() {
  const [displayName, setDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()


  useEffect(() => {
    // ユーザーがログインしているかチェック
    if (auth.currentUser) {
      // nullでないことを確認してから値をセットする
      setDisplayName(auth.currentUser.displayName ?? '')
      setPhotoURL(auth.currentUser.photoURL ?? '')
      setEmail(auth.currentUser.email ?? '')
    } else {
      // ログインしていない場合はサインインページにリダイレクト
      router.push('/signin')
    }
  }, [auth, router])

  // 前のページに戻る関数
  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    // 現在のユーザーがnullでないことを確認
    if (auth.currentUser) {
      try {
        // プロフィール更新
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: photoURL,
        })

        // メールアドレス更新
        if (auth.currentUser.email !== email) {
          await updateEmail(auth.currentUser, email)
        }

        // パスワード更新（新しいパスワードが入力されている場合のみ）
        if (newPassword) {
          // 現在のユーザーとそのメールがnullでないことを確認
          if (auth.currentUser && auth.currentUser.email) {
            // ユーザーを再認証する
            const credential = EmailAuthProvider.credential(
              auth.currentUser.email,
              password
            )
            await reauthenticateWithCredential(auth.currentUser, credential)
            await updatePassword(auth.currentUser, newPassword)
          } else {
            // ユーザーまたはメールがnullの場合はエラーをセット
            setError('メールアドレスが見つかりません。')
          }
        }

        // 成功した場合はホームページにリダイレクト
        router.push('/signin')
      } catch (error) {
        setError('プロフィールの更新に失敗しました。')
        console.error(error)
      } finally {
        setLoading(false)
      }
    } else {
      setError('ユーザーがログインしていません。')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">ユーザ情報</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
            表示名
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="photoURL" className="block text-gray-700 text-sm font-bold mb-2">
            プロフィール写真URL
          </label>
          <input
            type="text"
            id="photoURL"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            現在のパスワード（パスワードを変更する場合）
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
            新しいパスワード
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            更新
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
      </form>
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

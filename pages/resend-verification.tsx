// pages/resend-verification.tsx
import { useState } from "react"
import { useRouter } from "next/router"
import { auth } from "../src/utils/firebase"
import { sendEmailVerification } from "firebase/auth"

const ResendVerification = () => {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const resendVerificationEmail = async () => {
    const user = auth.currentUser
    if (user) {
      try {
        await sendEmailVerification(user)
        setMessage('検証メールを再送信しました。メールボックスをご確認ください。')
      } catch (err) {
        setError('メールの再送信に失敗しました。後ほどお試しください。')
      }
    } else {
      setError('ログインしていないため、メールを再送信できません。')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          検証メールの再送信
        </h2>
        {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        <div className="mt-6">
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={resendVerificationEmail}
          >
            検証メールを再送信
          </button>
        </div>
        <div className="mt-6 text-center">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
            onClick={(e) => {
              e.preventDefault()
              router.push('/verify-email')
            }}
          >
            メール検証ページに戻る
          </a>
        </div>
      </div>
    </div>
  )
}

export default ResendVerification

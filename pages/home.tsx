// pages/home.tsx
import Link from "next/link"
import { GetServerSideProps } from "next"
import { checkAuth } from "../src/utils/auth"

export default function Home() {
  return (
    <main>
      <div>Home</div>
      <nav>
        <ul>
          {/* 他のメニューアイテム */}
          <li>
            <Link href="/crm" passHref>
              <button>CRM</button>
            </Link>
          </li>
          {/* 他のメニューアイテム */}
        </ul>
      </nav>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // checkAuthヘルパー関数を使用して認証チェックを行う
  return await checkAuth(context)
}

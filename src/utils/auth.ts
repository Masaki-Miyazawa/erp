// utils/auth.ts
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

export async function checkAuth(context: GetServerSidePropsContext) {
  const cookies = nookies.get(context);
  const token = cookies.token; // トークンのキーは実際に設定したものを使用してください。

  if (!token) {
    // トークンがない、または認証が無効な場合は、サインインページにリダイレクトします。
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
      props: {} as never, // propsを返さない場合はnever型を使用して型エラーを防ぐ
    };
  }

  // 認証が成功した場合は、propsを返してページをレンダリングします。
  return {
    props: {},
  };
}

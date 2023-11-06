import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Button from '../../src/components/button'


const Menu: NextPage = () => {
  const router = useRouter()
  const handleCrm = () =>{
    // crmページにリダイレクト
    router.push('/crm/customers')
  }

  const handleOrders = () =>{
    // crmページにリダイレクト
    router.push('/erp/orders')
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline text-center my-6">
        小売業向けERPシステム
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <Button label='顧客管理' onClick={handleCrm}/>
        </div>
        <div className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          <Button label='受注管理' onClick={handleOrders}/>
        </div>
        <div className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          売上管理
        </div>
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          在庫管理
        </div>
        
        
        {/* 他のメニュー項目を追加 */}
      </div>
    </div>
  )
}

export default Menu


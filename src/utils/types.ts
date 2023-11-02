// types.ts

import { Timestamp } from "firebase/firestore"
import { Key } from "react"

/**
 * 顧客データを表すインターフェース。
 */
export interface Customer {
  id: Key | null | undefined
  name: string // 顧客の名前
  email: string // 顧客のメールアドレス
  phone: string // 顧客の電話番号
  address: string // 顧客の住所
  birthdate?: Timestamp // 顧客の生年月日（オプショナル）
  gender?: "男性" | "女性" | "その他" // 顧客の性別（オプショナル）
  preferences?: CustomerPreferences // 顧客の好み（オプショナル）
  communicationPreferences?: CommunicationPreferences // 顧客のコミュニケーション設定（オプショナル）
  communicationNotes?: CommunicationNote[] // 顧客とのコミュニケーションメモドキュメントID（オプショナル）
  communicationLogs?: CommunicationLog //顧客とのコミュニケーションログID（オプショナル）
  loyaltyPoints?: number // 顧客のロイヤリティポイント（オプショナル）
  createdAt: Timestamp // レコードの作成日時
  updatedAt: Timestamp // レコードの最終更新日時
}

/**
 * 顧客の好みを表すインターフェース。
 */
export interface CustomerPreferences {
  categories: string[] // 興味のあるカテゴリのリスト
  brands: string[] // 好きなブランドのリスト
}

/**
 * 顧客のコミュニケーション設定を表すインターフェース。
 */
export interface CommunicationPreferences {
  newsletter: boolean // ニュースレターを受け取るかどうかのフラグ
  sms: boolean // SMS通知を受け取るかどうかのフラグ
}

/**
 * コミュニケーションログを表すインターフェース。
 */
interface CommunicationLog {
  logId: string // コミュニケーションログの一意のID
  customerId: string // ログが紐づいている顧客のID
  interactions: Interaction[] // インタラクションのリスト
}

/**
 * 顧客とのインタラクションを表すインターフェース。
 */
interface Interaction {
  interactionId: string // インタラクションの一意のID
  type: "email" | "call" | "meeting" // コミュニケーションのタイプ
  content: string // インタラクションの内容やメモ
  createdBy: string // インタラクションを記録した担当者のID
  createdAt: Timestamp // レコードの作成日時
  updatedAt: Timestamp // レコードの最終更新日時
}

/**
 * 顧客とのコミュニケーションにより発生したメモのインターフェース
 */
export interface CommunicationNote {
  noteId: string // メモの一意のID
  customerId: string // メモが紐づいている顧客のID
  content: string // メモの内容
  createdBy: string // メモを作成した担当者のID
  createdAt: Timestamp // レコードの作成日時
  updatedAt: Timestamp // レコードの最終更新日時
}

/**
 * 購入履歴アイテムを表すインターフェース。
 */
export interface PurchaseHistoryItem {
  productId: string // 購入した商品のID
  quantity: number // 購入した数量
  price: number // 購入時の単価
}

/**
 * 購入履歴を表すインターフェース。
 */
export interface PurchaseHistory {
  customerId: string // 購入を行った顧客のID
  items: PurchaseHistoryItem[] // 購入された商品アイテムのリスト
  totalAmount: number // 総購入額
  purchaseDate: Timestamp // 購入日時
  paymentMethod: string // 支払い方法
  status: string // 購入のステータス（例: 処理中、配送済みなど）
}

/**
 * 商品レビューを表すインターフェース。
 */
export interface ProductReview {
  customerId: string // レビューを書いた顧客のID
  rating: number // レビューの評価（星の数など）
  comment: string // レビューのコメント
  date: Timestamp // レビューを書いた日時
}

/**
 * 商品データを表すインターフェース。
 */
export interface Product {
  name: string // 商品名
  description: string // 商品説明
  price: number // 商品価格
  categories: string[] // 商品カテゴリのリスト
  images: string[] // 商品画像のURLのリスト
  stock: number // 在庫数
  tags: string[] // 商品を説明するタグのリスト
  reviews: ProductReview[] // 商品のレビューリスト
  createdAt: Timestamp // 商品レコードの作成日時
  updatedAt: Timestamp // 商品レコードの最終更新日時
}

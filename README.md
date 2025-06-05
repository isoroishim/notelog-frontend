# Notelog Frontend

Notelog は、ノートとブログのような機能を兼ね備えた個人開発用の Web アプリケーションです。  
このリポジトリはフロントエンド（SPA）部分であり、Vue 3 および Vuetify 3 を用いて構築されています。

---

## 技術スタック

| 項目              | 内容                                 |
| ----------------- | ------------------------------------ |
| フレームワーク    | Vue 3 (Composition API + TypeScript) |
| UI ライブラリ     | Vuetify 3                            |
| ルーティング      | Vue Router                           |
| 状態管理          | Pinia（導入予定）                    |
| HTTP クライアント | axios（導入予定）                    |
| ビルドツール      | Vite                                 |

---

## ディレクトリ構成（抜粋）

```
notelog-frontend/
├── src/
│   ├── assets/             # CSS 等の静的アセット
│   ├── components/         # UI コンポーネント（今後追加予定）
│   ├── plugins/            # Vuetify などのプラグイン設定
│   ├── router/             # ルーティング設定ファイル
│   │   └── index.ts
│   ├── stores/             # 状態管理（Pinia 用予定）
│   ├── views/              # 各ページビュー
│   │   ├── HomeView.vue
│   │   └── LoginView.vue   # 画面は未実装
│   ├── App.vue             # ルートコンポーネント
│   └── main.ts             # アプリケーションエントリポイント
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
```

---

## 現在の実装状況（2025年6月5日時点）

| 機能                      | 状態     | 補足                                             |
| ------------------------- | -------- | ------------------------------------------------ |
| Vuetify 導入              | 完了     | デザインフレームワーク構築済み                   |
| Vue Router 設定           | 完了     | `/home`, `/login` パス定義済み                   |
| ログイン画面の UI 実装    | 未着手   | LoginView.vue のファイルのみ存在                 |
| axios 通信設定            | 未着手   | JWT ログインに向けて今後導入予定                 |
| 状態管理（Pinia）         | 未着手   | JWT の保存や認証状態管理に使用予定               |
| コンポーネント分割        | 未実施   | components ディレクトリは空の状態                |
| 共通レイアウト（App.vue） | 一部実装 | 基本構成は存在。今後ヘッダー・サイドバー追加予定 |

---

## 今後の実装予定

- LoginView.vue の UI 実装（v-text-field, v-btn）
- axios によるログイン API 通信機能の追加
- JWT の保存とログイン状態の制御（Pinia 導入）
- グローバルレイアウト（ヘッダー、ナビゲーション）
- 投稿機能（テキストエリア → Markdown 対応）
- 記事一覧表示、記事詳細ページの追加
- ユーザー設定画面の追加

---

## 開発用起動方法

```
npm install
npm run dev
```

起動後、`http://localhost:5173` にアクセスしてください。

---

## 補足情報

- バックエンド API は Django REST Framework（notelog-api）を使用予定
- 認証方式は JWT（JSON Web Token）によるトークン認証
- 本リポジトリは `notelog` モノレポのフロントエンド部分に該当

# Word Registrator

Webページから選択したテキストを登録・管理するChrome拡張機能とWebアプリケーション。

## 構成

- **Chrome Extension**: ウェブページでテキストを選択して右クリックで単語を登録
- **Nuxt 3**: Vue.js ベースのフロントエンドアプリケーション（http://localhost:3000）
- **FastAPI**: Python製のRESTful APIバックエンド（http://localhost:8000）
- **PostgreSQL**: 単語データを永続化するデータベース
- **Docker**: コンテナ化による簡単なセットアップ

## セットアップ

### 1. バックエンド起動

```bash
docker-compose up -d
```

### 2. フロントエンド起動

```bash
cd nuxt-app
npm install
npm run dev
```

### 3. Chrome拡張機能インストール

1. `chrome://extensions/` を開く
2. 「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `extension` フォルダを選択

## 使い方

1. 任意のウェブページでテキストを選択
2. 右クリックメニューから「単語を登録」を選択
3. http://localhost:3000 で登録した単語を確認

## API仕様

- `GET /api/words` - 単語一覧取得
- `POST /api/words` - 単語登録
- `DELETE /api/words/{id}` - 単語削除

## 技術スタック

- **Frontend**: Nuxt 3, Vue.js, TypeScript, Pinia
- **Backend**: FastAPI, SQLAlchemy, Python 3.11
- **Database**: PostgreSQL
- **Extension**: Manifest V3, JavaScript
- **Infrastructure**: Docker, Docker Compose

## アーキテクチャ

```
Chrome Extension → FastAPI → PostgreSQL
       ↓
   Nuxt App (3秒ポーリングで自動更新)
```

---

開発者：Shogo (goshalways@gmail.com)

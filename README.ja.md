# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/コミュニティに参加-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![フォロー](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![クラウド](https://img.shields.io/badge/クラウド-☁️-blue)](https://app.useautumn.com)
[![ドキュメント](https://img.shields.io/badge/ドキュメント-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) は、Stripe とアプリケーションの間のオープンソースレイヤーで、あらゆる価格モデルを作成し、数行のコードで埋め込むことができます。Autumn では以下を構築できます：
- サブスクリプション
- クレジットシステムとチャージ
- 使用量ベースのモデルと超過料金
- 大規模顧客向けのカスタムプラン

これらすべてを、Webhook、アップグレード/ダウングレード、キャンセル、または支払い失敗を処理することなく実現できます。

## はじめに

**クラウド**：Autumn を使い始める最も簡単な方法は、[クラウドサービス](https://app.useautumn.com)を利用することです。

**セルフホスティング**：Autumn をセルフホストする場合：

1. `bun` がインストールされていることを確認してください
2. プロジェクトの依存関係をインストールします
```bash
bun install
```
3. セットアップスクリプトを実行します：
```bash
bun setup
```

4. Postgres データベースに関連テーブルを生成します
```bash
bun db:generate && bun db:migrate
```

5. Autumn を実行します：

Windows の場合：
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux の場合：
```bash
docker compose -f docker-compose.unix.yml up
```

完了です！`http://localhost:3000` で Autumn ダッシュボードが表示されるはずです。

> ⚠️ ログインするには、サインインページでメールアドレスを入力すると、OTP がコンソール/ターミナルに表示されます。通常、OTP をメールで送信するために Resend を使用するか、Google OAuth を使用します。これらは `server/.env` に認証情報を提供することで設定できます

> ℹ️ セットアップスクリプトは、必要な環境変数と（オプションで）Supabase インスタンスを初期化します。独自の Postgres インスタンスを使用したい場合は、`server/.env` の `DATABASE_URL` 環境変数に接続文字列を貼り付けてください

## トラブルシューティング

以前に `bun setup` を実行した後、再度実行すると `SyntaxError: Unexpected end of JSON input` エラーが発生する場合は、最初にデータベーステーブルをクリアする必要があるかもしれません。これは、データベースマイグレーションを複数回実行すると発生する可能性がある[既知の問題](https://github.com/drizzle-team/drizzle-orm/issues/4529)です。

解決方法：

1. データベースに接続します
2. 既存のすべてのテーブルを削除します
3. セットアップスクリプトを再度実行します

## なぜ Autumn なのか

**1️⃣ 請求インフラは急速に複雑になります**

支払いだけではありません：権限管理、メータリング、cron ジョブによる使用制限の構築、そしてそれをアップグレード、ダウングレード、キャンセル、支払い失敗の状態に接続することです。競合状態、エッジケース、その他のバグが開発を遅らせます。

**2️⃣ 請求とアプリロジックは分離すべきです**

成長企業は価格設定を頻繁に繰り返します：価格の引き上げ、クレジットの実験、新機能への課金。データベースマイグレーション、アプリ内フローの再構築、カスタム価格設定のための内部ダッシュボード、古い価格設定でのユーザーの継続は悪夢です。

## 仕組み

まず、ダッシュボードで製品とプランを作成します。**あらゆる**価格モデルをサポートしています。よく見られる人気のあるモデルには以下があります：

1. **使用量と超過** ⚡：リアルタイムの使用制限を設定し、リセットするタイミングを選択します。ユーザーが超過した場合に課金します。
2. **クレジット** 💰：ユーザーは、多くの機能が利用できる金銭的または任意のクレジットにアクセスできます
3. **シート単位の制限付きシートベース** 👥：顧客のユーザー（または他のエンティティ）に対して請求します
4. **前払い** 💳：ユーザーが機能の固定数量を前払いで購入し、時間をかけて使用できるようにします

次に、すべての請求ロジックは 3 つの関数だけで実装できます：

1. `/attach`：すべての購入フローに対する 1 つの関数呼び出し。Stripe Checkout URL を返すか、アップグレード/ダウングレードを処理します。

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  プロにアップグレード
</button>
```

2. `/check`：顧客が製品、機能、または残りの使用量にアクセスできるかどうかを確認します。
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI 制限に達しました")
```

3. `/track`：顧客が使用量ベースの機能を使用したときに、使用イベントを記録します。

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## その他

**貢献** 🤝：貢献に興味がある場合は、[こちら](/.github/CONTRIBUTING.md)のガイドをご覧ください。あらゆる種類のサポートを歓迎します :)

**サポート** 💬：サポートが必要な場合は、通常 [Discord チャンネル](https://discord.gg/STqxY92zuS)で最も迅速に対応していますが、`hey@useautumn.com` にメールを送っていただいても構いません！

## コントリビューター

Autumn をより良い製品にするために協力してくれたすべてのコントリビューターに感謝します！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) は Stripe とあなたのアプリケーションの間に位置するオープンソースレイヤーで、数行のコードで任意の価格モデルを作成し、埋め込むことができます。Autumn では以下を構築できます：
- サブスクリプション
- クレジットシステムとトップアップ
- 使用量ベースのモデルと超過料金
- 大口顧客向けのカスタムプラン

すべてを webhooks、アップグレード/ダウングレード、キャンセル、支払い失敗を処理することなく。

## はじめに

**クラウド**：Autumn を使用する最も速い方法は、私たちの[クラウドサービス](https://app.useautumn.com)を通じてです。

**セルフホスト**：Autumn をセルフホストしたい場合：

1. `bun` がインストールされていることを確認してください
2. プロジェクトの依存関係をインストールします
```bash
bun install
```
3. セットアップスクリプトを実行します：
```bash
bun setup
```

4. postgres DB で関連テーブルを生成します
```bash
bun db:generate && bun db:migrate
```

5. Autumn を実行します：

Windows の場合
```bash
docker compose -f docker-compose.dev.yml up
```

mac/linux の場合：
```bash
docker compose -f docker-compose.unix.yml up
```

それだけです！`http://localhost:3000` で Autumn ダッシュボードを見ることができるはずです。

> ⚠️ ログインするには、サインインページでメールアドレスを入力してください。OTP がコンソール/ターミナルに表示されます。通常、Resend を使用して OTP をメール送信したり、Google OAuth を使用します。これらは `server/.env` で資格情報を提供することで設定できます

> ℹ️ セットアップスクリプトは必要な env 変数を初期化し、オプションで Supabase インスタンスを初期化します。独自の Postgres インスタンスを使用したい場合は、それを使用できます —— 接続文字列を `server/.env` の `DATABASE_URL` env 変数に貼り付けるだけです

## トラブルシューティング

`bun setup` を実行する際に `SyntaxError: Unexpected end of JSON input` エラーが発生した場合、まずデータベーステーブルをクリアする必要があるかもしれません。これはデータベースマイグレーションを複数回実行する際に発生する可能性のある[既知の問題](https://github.com/drizzle-team/drizzle-orm/issues/4529)です。

これを解決するには：

1. データベースに接続します
2. 既存のすべてのテーブルを削除します
3. セットアップスクリプトを再度実行します：

## Autumn を選ぶ理由

**1️⃣ 課金インフラはすぐに複雑になる**

支払いだけではありません：権限管理、メータリング、使用制限を cron ジョブで構築し、それをアップグレード、ダウングレード、キャンセル、失敗した支払いの状態に接続します。競合状態、エッジケース、その他のバグがあなたの速度を低下させます。

**2️⃣ 課金とアプリケーションロジックは分離されるべき**

成長中の企業は価格を頻繁に反復します：価格の引き上げ、クレジットの実験、新しい機能の課金。DB マイグレーション、アプリ内フローの再構築、古い価格のユーザーを祖父条項で扱うための内部ダッシュボードは悪夢です。

## 仕組み

まず、ダッシュボードで製品とプランを作成します。私たちは**任意**の価格モデルをサポートします。私たちが見た人気のモデルには以下があります：

1. **使用量と超過** ⚡：リアルタイムの使用制限を設定し、リセットするタイミングを選択します。ユーザーが超過した場合に課金します。
2. **クレジット** 💰：ユーザーは多くの機能が引き出せる通貨または任意のクレジットにアクセスできます
3. **席ベースで席ごとの制限** 👥：顧客のユーザー（または他のエンティティ）に課金します
4. **前払い** 💳：ユーザーが時間の経過とともに使用される固定数量の機能を前払いで購入できるようにします

次に、すべての課金ロジックは 3 つの関数で実装できます：

1. `/attach`：すべての購入フローのための 1 つの関数呼び出し。私たちは Stripe Checkout URL を返したり、アップグレード/ダウングレードを処理します。

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Pro にアップグレード
</button>
```

2. `/check`：顧客が製品、機能、または残りの使用量にアクセスできるかどうかをチェックします。
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI 制限に達しました")
```

3. `/track`：顧客が使用量ベースの機能を使用した場合、使用イベントを記録します。

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## その他

**貢献** 🤝：貢献に興味がある場合、私たちのガイドを[ここ](/.github/CONTRIBUTING.md)で確認できます。すべてのタイプのヘルプが歓迎されます :)

**サポート** 💬：サポートが必要な場合、私たちは通常[Discord チャンネル](https://discord.gg/STqxY92zuS)で最も迅速に応答しますが、`hey@useautumn.com` までメールを送っていただいても構いません！

## 貢献者

Autumn をより良い製品にするために貢献してくれたすべての貢献者に感謝します！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>
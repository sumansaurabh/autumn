# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) は Stripe とあなたのアプリケーションの間に位置するオープンソースのレイヤーで、あらゆる価格モデルを作成し、数行のコードで埋め込むことができます。Autumn では以下を構築できます：
- サブスクリプション
- クレジットシステム & トップアップ
- 使用量ベースのモデル & オーバージ
- 大口顧客向けのカスタムプラン

これらすべてを、Webhook の処理、アップグレード/ダウングレード、キャンセル、または支払い失敗を扱うことなく実現できます。

## はじめに

**クラウド**: Autumn の使用を開始する最も速い方法は、[クラウドサービス](https://app.useautumn.com) を通じてです。

**セルフホスト**: Autumn をセルフホストしたい場合：

1. `bun` がインストールされていることを確認してください
2. プロジェクトの依存関係をインストールします
```bash
bun install
```

3. セットアップスクリプトを実行します：
```bash
bun setup
```

4. Postgres DB に必要なテーブルを生成します
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

これで完了です！`http://localhost:3000` で Autumn ダッシュボードを確認できます。

> ⚠️ ログインするには、サインインページでメールアドレスを入力してください。OTP がコンソール/ターミナルに表示されます。通常、Resend を使用して OTP をメール送信したり、Google OAuth を使用します。これらは `server/.env` で資格情報を提供することで設定できます。

> ℹ️ セットアップスクリプトは必要な環境変数を初期化し、オプションで Supabase インスタンスを初期化します。独自の Postgres インスタンスを使用したい場合は、`server/.env` の `DATABASE_URL` 環境変数に接続文字列を貼り付けてください。

## トラブルシューティング

`bun setup` を以前実行した後に再度実行すると `SyntaxError: Unexpected end of JSON input` エラーが発生する場合、まずデータベーステーブルをクリアする必要があるかもしれません。これは、データベースマイグレーションを複数回実行すると発生する[既知の問題](https://github.com/drizzle-team/drizzle-orm/issues/4529)です。

これを解決するには：

1. データベースに接続します
2. 既存のテーブルをすべて削除します
3. セットアップスクリプトを再度実行します：

## Autumn の理由

**1️⃣ 課金インフラはすぐに複雑になる**

支払い以上のもの：権限管理、測定、使用制限（cron ジョブ付き）、アップグレード、ダウングレード、キャンセル、支払い失敗状態への接続を構築することです。競合状態、エッジケース、その他のバグがあなたの進捗を遅らせます。

**2️⃣ 課金とアプリロジックは分離されるべき**

成長中の企業は価格を頻繁に変更します：価格の引き上げ、クレジットの実験、または新機能の課金。DB マイグレーション、アプリ内フローの再構築、大口顧客向けのカスタム価格設定のための内部ダッシュボード、古い価格のユーザーの祖父条項は悪夢です。

## 仕組み
まず、ダッシュボードで製品とプランを作成します。**あらゆる**価格モデルをサポートします。私たちがよく見かける人気のものは以下の通りです：

1. **使用量 & オーバージ** ⚡: リアルタイムの使用制限を設定し、リセットするタイミングを選択します。超過した場合にユーザーに課金します。
2. **クレジット** 💰: ユーザーが多くの機能が引き出すことができる通貨または任意のクレジットをアクセスできます
3. **シートベース（シートごとの制限付き）** 👥: 顧客のユーザー（または他のエンティティ）を課金します
4. **前払い** 💳: ユーザーが時間の経過とともに使用される機能の固定数量を前払いで購入できるようにします

次に、すべての課金ロジックをたった 3 つの関数で実装できます：

1. `/attach`: すべての購入フローのための 1 つの関数呼び出し。Stripe Checkout URL を返したり、アップグレード/ダウングレードを処理します。

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

2. `/check`: 顧客が製品、機能、または残りの使用量にアクセスできるかどうかを確認します。
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI 制限に達しました")
```

3. `/track`: 顧客が使用量ベースの機能を使用した場合、使用イベントを記録します。

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## その他

**貢献** 🤝: 貢献に興味がある場合、[こちら](/.github/CONTRIBUTING.md)でガイドを確認できます。すべての種類のヘルプを歓迎します :)

**サポート** 💬: サポートが必要な場合、[Discord チャンネル](https://discord.gg/STqxY92zuS)で最も迅速に対応しますが、`hey@useautumn.com` にメールを送っていただいても構いません！

## 貢献者

Autumn をより良い製品にするために貢献してくれたすべての貢献者に感謝します！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>
# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com)は、Stripeとあなたのアプリケーションの間のオープンソースレイヤーで、数行のコードであらゆる価格設定モデルを作成し、埋め込むことができます。Autumnで構築できるもの：
- サブスクリプション
- クレジットシステムとトップアップ
- 使用量ベースのモデルと超過料金
- 大口顧客向けのカスタムプラン

これらすべてを、Webhook、アップグレード/ダウングレード、キャンセル、支払い失敗を処理する必要なく実現できます。


## はじめに

**クラウド版**: Autumnを使い始める最も簡単な方法は、[クラウドサービス](https://app.useautumn.com)を利用することです。

**セルフホスト版**: Autumnを自分でホストする場合：

1. `bun`がインストールされていることを確認してください
2. プロジェクトの依存関係をインストールします
```bash
bun install
```
3. セットアップスクリプトを実行します：
```bash
bun setup
```

4. PostgreSQLデータベースに必要なテーブルを生成します
```bash
bun db:generate && bun db:migrate
```

5. Autumnを実行します：

Windows の場合
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux の場合：
 ```bash
docker compose -f docker-compose.unix.yml up
```

完了です！`http://localhost:3000` でAutumnダッシュボードにアクセスできます。

> ⚠️ ログインするには、サインインページでメールアドレスを入力してください。OTPがコンソール/ターミナルに表示されます。通常、ResendでOTPをメール送信するか、Google OAuthを使用します。これらは`server/.env`に認証情報を提供することで設定できます。

> ℹ️ セットアップスクリプトは、必要な環境変数と（オプションで）Supabaseインスタンスを初期化します。独自のPostgresインスタンスを使用したい場合は、`server/.env`の`DATABASE_URL`環境変数に接続文字列を貼り付けてください。

## トラブルシューティング

以前に実行した後、再度`bun setup`を実行する際に`SyntaxError: Unexpected end of JSON input`エラーが発生した場合、最初にデータベーステーブルをクリアする必要があるかもしれません。これは、データベースマイグレーションを複数回実行する際に発生する可能性がある[既知の問題](https://github.com/drizzle-team/drizzle-orm/issues/4529)です。

解決方法：

1. データベースに接続します
2. 既存のすべてのテーブルを削除します
3. セットアップスクリプトを再度実行します


## なぜAutumnなのか

**1️⃣ 請求インフラはすぐに複雑になります**

単なる支払いだけではありません：権限管理、メータリング、cronジョブを使った使用量制限の構築、そしてアップグレード、ダウングレード、キャンセル、支払い失敗の状態との接続が必要です。競合状態、エッジケース、その他のバグが開発を遅らせます。

**2️⃣ 請求とアプリロジックは分離すべきです**

成長企業は頻繁に価格設定を繰り返します：価格の引き上げ、クレジットの実験、新機能への課金などです。DBマイグレーション、アプリ内フローの再構築、カスタム価格設定用の内部ダッシュボード、旧価格での既存ユーザーの管理は悪夢です。


## 仕組み
まず、ダッシュボードで製品とプランを作成します。**あらゆる**価格設定モデルをサポートしています。よく見られる人気のモデルには以下があります：

1. **使用量と超過** ⚡: リアルタイムの使用量制限を設定し、リセット時期を選択します。超過した場合はユーザーに課金します。
2. **クレジット** 💰: ユーザーは、多くの機能が利用できる金銭的または任意のクレジットにアクセスできます
3. **シート単位の制限付きシートベース課金** 👥: ユーザー（または他のエンティティ）に対して顧客に請求します
4. **前払い** 💳: ユーザーが機能の一定量を前払いで購入し、時間をかけて使用します


次に、すべての請求ロジックはわずか3つの関数で実装できます：

1. `/attach`: すべての購入フローに対する1つの関数呼び出し。Stripe CheckoutのURLを返すか、アップグレード/ダウングレードを処理します。

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Proにアップグレード
</button>
```

2. `/check`: 顧客が製品、機能、または残りの使用量にアクセスできるかどうかを確認します。
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI制限に達しました")
```

3. `/track`: 顧客が使用量ベースの機能を使用する際に、使用イベントを記録します。

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## その他

**コントリビューション** 🤝: コントリビューションに興味がある場合は、[こちら](/.github/CONTRIBUTING.md)のガイドをご覧ください。あらゆる種類のヘルプを歓迎します :)

**サポート** 💬: サポートが必要な場合は、通常[Discordチャンネル](https://discord.gg/STqxY92zuS)で最も迅速に対応していますが、`hey@useautumn.com`にメールでお問い合わせいただいても構いません！


## コントリビューター

Autumnをより良い製品にするために協力してくれたすべてのコントリビューターに感謝します！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

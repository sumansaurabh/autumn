# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com)は、Stripeとあなたのアプリケーションをつなぐオープンソースレイヤーです。数行のコードで任意の価格設定モデルを作成し、埋め込むことができます。Autumnでは以下のようなモデルを構築できます：
- サブスクリプション
- クレジットシステム & トップアップ
- 使用量ベースのモデル & 超過料金
- 大口顧客向けのカスタムプラン

Webhookの処理、アップグレード/ダウングレード、キャンセル、決済失敗への対応などを実装する必要はありません。


## はじめに

**クラウド**: Autumnを使い始める最も簡単な方法は、[クラウドサービス](https://app.useautumn.com)を利用することです。

**セルフホスト**: Autumnをセルフホストする場合：

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

5. Autumnを起動します：

Windows の場合：
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux の場合：
```bash
docker compose -f docker-compose.unix.yml up
```

これで完了です！`http://localhost:3000`でAutumnダッシュボードが表示されるはずです。

> ⚠️ ログインするには、サインインページでメールアドレスを入力してください。OTPがコンソール/ターミナルに表示されます。通常、ResendによるOTPメール送信またはGoogle OAuthを使用していますが、これらは`server/.env`に認証情報を提供することで設定できます。

> ℹ️ セットアップスクリプトは、必要な環境変数と（オプションで）Supabaseインスタンスを初期化します。独自のPostgresインスタンスを使用する場合は、`server/.env`の`DATABASE_URL`環境変数に接続文字列を貼り付けてください。

## トラブルシューティング

以前に実行した後、再度`bun setup`を実行する際に`SyntaxError: Unexpected end of JSON input`エラーが発生する場合は、まずデータベーステーブルをクリアする必要があるかもしれません。これは、データベースマイグレーションを複数回実行する際に発生する可能性がある[既知の問題](https://github.com/drizzle-team/drizzle-orm/issues/4529)です。

この問題を解決するには：

1. データベースに接続します
2. 既存のテーブルをすべて削除します
3. セットアップスクリプトを再度実行します


## なぜAutumnなのか

**1️⃣ 請求インフラは急速に複雑化します**

単なる決済以上のもの：権限管理、メータリング、cronジョブによる使用制限の構築、そしてアップグレード、ダウングレード、キャンセル、決済失敗の状態への接続が必要です。競合状態、エッジケース、その他のバグが開発を遅らせます。

**2️⃣ 請求とアプリロジックは分離すべきです**

成長企業は価格設定を頻繁に反復します：値上げ、クレジットの実験、新機能への課金。DBマイグレーション、アプリ内フローの再構築、カスタム価格設定用の内部ダッシュボード、古い価格設定でのユーザーの既得権保護は悪夢です。


## 仕組み
まず、ダッシュボードで製品とプランを作成します。**任意の**価格設定モデルをサポートしています。人気のあるモデルには以下のようなものがあります：

1. **使用量 & 超過料金** ⚡: リアルタイムの使用制限を設定し、リセットタイミングを選択。ユーザーが超過した場合に課金します。
2. **クレジット** 💰: ユーザーは金銭的または任意のクレジットにアクセスでき、多くの機能がそこから引き出せます。
3. **シート数ベースでシートごとの制限付き** 👥: 顧客のユーザー数（または他のエンティティ）に応じて請求します。
4. **前払い** 💳: ユーザーが機能の固定数量を事前購入し、時間をかけて使用できるようにします。


次に、すべての請求ロジックは3つの関数だけで実装できます：

1. `/attach`: すべての購入フローに対応する1つの関数呼び出し。Stripe CheckoutのURLを返すか、アップグレード/ダウングレードを処理します。

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

3. `/track`: 顧客が使用量ベースの機能を使用したときに、使用イベントを記録します。

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## その他

**コントリビューション** 🤝: コントリビューションに興味がある方は、[こちら](/.github/CONTRIBUTING.md)のガイドをご覧ください。あらゆる種類のサポートを歓迎します :)

**サポート** 💬: サポートが必要な場合は、通常[Discordチャンネル](https://discord.gg/STqxY92zuS)で最も迅速に対応していますが、`hey@useautumn.com`へのメールもお気軽にどうぞ！



<!-- ## おめでとうございます！

数分で完全な請求システムをアプリケーションに組み込みました。必要な価格モデルの変更やカスタムプランの処理を、コードベースを変更することなく行えます。

Autumnを自由にセルフホストするか、https://useautumn.com でホストされたバージョンをご利用ください。ご質問、ご意見、フィードバックがございましたら、hey@useautumn.comまでお知らせください。 -->

## コントリビューター

Autumnをより良い製品にするためにご協力いただいたすべてのコントリビューターの皆様に感謝します！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

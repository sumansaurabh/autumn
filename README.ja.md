# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com)は、Stripeとあなたのアプリケーションをつなぐオープンソースのレイヤーです。数行のコードであらゆる価格モデルを作成し、埋め込むことができます。Autumnでは以下を構築できます：
- サブスクリプション
- クレジットシステム＆トップアップ
- 使用量ベースのモデル＆超過料金
- 大口顧客向けカスタムプラン

これらすべてをWebhook、アップグレード/ダウングレード、キャンセル、支払い失敗の処理を行うことなく実現できます。


## はじめに

**クラウド版**: Autumnを最も手軽に使い始めるには、[クラウドサービス](https://app.useautumn.com)をご利用ください。

**セルフホスティング**: Autumnをセルフホスティングする場合：

1. `bun`がインストールされていることを確認してください
2. プロジェクトの依存関係をインストールします
```bash
bun install
```
3. セットアップスクリプトを実行します：
```bash
bun setup
```

4. PostgresDBに必要なテーブルを生成します
```bash
bun db:generate && bun db:migrate
```

5. Autumnを起動します：

Windows向け
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux向け:
 ```bash
docker compose -f docker-compose.unix.yml up
```

以上です！ `http://localhost:3000`でAutumnダッシュボードが表示されます。

> ⚠️ ログインするには、サインインページでメールアドレスを入力してください。コンソール/ターミナルにOTPが表示されます。通常、ResendでOTPをメール送信するか、Google OAuthを使用しますが、これらは`server/.env`に認証情報を設定することで利用できます。

> ℹ️ セットアップスクリプトは必要な環境変数と（オプションで）Supabaseインスタンスを初期化します。独自のPostgresインスタンスを使用したい場合は、`server/.env`の`DATABASE_URL`環境変数に接続文字列を貼り付けてください。

## トラブルシューティング

以前に`bun setup`を実行した後、再度実行する際に`SyntaxError: Unexpected end of JSON input`エラーが発生する場合は、まずデータベーステーブルをクリアする必要があります。これは複数回データベースマイグレーションを実行した際に発生する可能性のある[既知の問題](https://github.com/drizzle-team/drizzle-orm/issues/4529)です。

解決方法：

1. データベースに接続します
2. 既存のテーブルをすべて削除します
3. セットアップスクリプトを再度実行します


## なぜAutumnなのか

**1️⃣ 課金インフラはすぐに複雑になる**

決済だけではありません：権限管理、メータリング、cronジョブによる使用制限の構築、そしてそれをアップグレード、ダウングレード、キャンセル、支払い失敗の状態に接続する必要があります。競合状態、エッジケース、その他のバグがあなたの開発速度を低下させます。

**2️⃣ 課金とアプリのロジックは分離すべき**

成長企業は価格設定を頻繁に繰り返します：価格の引き上げ、クレジットの実験、新機能への課金など。DBマイグレーション、アプリ内フローの再構築、カスタム価格設定のための内部ダッシュボード、古い価格設定でのユーザーの既得権保護は悪夢です。


## 仕組み
まず、ダッシュボードで製品とプランを作成します。**あらゆる**価格モデルに対応しています。よく見られる人気のモデルには以下があります：

1. **使用量＆超過料金** ⚡: リアルタイムの使用制限を設定し、リセット時期を選択できます。超過した場合はユーザーに課金します。
2. **クレジット** 💰: ユーザーは金銭的または任意のクレジットにアクセスでき、多くの機能がそこから引き出せます
3. **シート単位＆シートごとの制限** 👥: ユーザー（またはその他のエンティティ）に対して顧客に課金します
4. **前払い** 💳: ユーザーが機能の固定数量を前払いで購入し、時間をかけて使用できるようにします


次に、すべての課金ロジックをわずか3つの関数で実装できます：

1. `/attach`: すべての購入フロー用の1つの関数呼び出し。Stripe CheckoutのURLを返すか、アップグレード/ダウングレードを処理します。

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

**コントリビューション** 🤝: コントリビューションにご興味がある方は、[こちら](/.github/CONTRIBUTING.md)のガイドをご覧ください。あらゆる種類のサポートを歓迎します :)

**サポート** 💬: サポートが必要な場合は、通常[Discordチャンネル](https://discord.gg/STqxY92zuS)で最も迅速に対応していますが、`hey@useautumn.com`へのメールも歓迎します！


## コントリビューター

Autumnをより良い製品にするために協力してくださったすべてのコントリビューターに感謝します！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

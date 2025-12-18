# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) 是一个开源层，位于 Stripe 和您的应用程序之间，让您能够创建任何定价模型，并通过几行代码嵌入它。在 Autumn 上，您可以构建：
- 订阅
- 信用系统和充值
- 基于使用量的模型和超额费用
- 大型客户的自定义计划

所有这些都不需要处理 webhooks、升级/降级、取消或支付失败。


## 开始使用

**云端**：开始使用 Autumn 的最快方式是通过我们的[云服务](https://app.useautumn.com)。

**自托管**：如果您想自托管 Autumn：

1. 确保已安装 `bun`
2. 安装项目依赖
```bash
bun install
```
3. 运行我们的设置脚本：
```bash
bun setup
```

4. 在您的 postgres DB 中生成相关表
```bash
bun db:generate && bun db:migrate
```

5. 运行 Autumn：

对于 Windows
```bash
docker compose -f docker-compose.dev.yml up
```

对于 mac/linux：
 ```bash
docker compose -f docker-compose.unix.yml up
```

就是这样！您应该能够在 `http://localhost:3000` 上看到 Autumn 仪表板。

> ⚠️ 要登录，请在登录页面输入电子邮件，OTP 应该出现在您的控制台/终端中。通常，我们使用 Resend 发送 OTP 电子邮件或 Google OAuth——这些可以通过在 `server/.env` 中提供您的凭据来设置

> ℹ️ 我们的设置脚本初始化所需的 env 变量，并（可选）初始化一个 Supabase 实例。如果您想使用自己的 Postgres 实例，您可以这样做——只需将连接字符串粘贴到 `server/.env` 中的 `DATABASE_URL` env 变量中

## 故障排除

如果在之前运行过 `bun setup` 后再次运行时遇到 `SyntaxError: Unexpected end of JSON input` 错误，您可能需要先清除数据库表。这是运行数据库迁移多次时可能发生的[已知问题](https://github.com/drizzle-team/drizzle-orm/issues/4529)。

要解决此问题：

1. 连接到您的数据库
2. 删除所有现有表
3. 再次运行设置脚本：


## 为什么选择 Autumn

**1️⃣ 计费基础设施很快变得复杂**

不仅仅是支付：它是构建权限管理、计量、使用限制与 cron 作业，并将其连接到升级、降级、取消和失败支付状态。竞态条件、边缘情况和其他错误会拖慢您的进度。

**2️⃣ 计费和应用逻辑应该解耦**

成长中的公司经常迭代定价：提高价格、实验信用或为新功能收费。DB 迁移、重建应用内流程、内部仪表板用于自定义定价和对旧定价用户的祖父条款是一个噩梦。


## 它如何工作
首先，在仪表板上创建您的产品和计划。我们支持**任何**定价模型。我们看到的一些流行模型包括：

1. **使用量和超额** ⚡：设置实时使用限制，并选择何时重置。如果用户超额，则向他们收费。
2. **信用** 💰：用户可以访问货币或任意信用，许多功能可以从中提取
3. **基于席位的与每席位限制** 👥：为客户的用户（或其他实体）计费
4. **预付** 💳：让用户预先购买固定数量的功能，随着时间使用


接下来，所有您的计费逻辑都可以通过仅 3 个函数实现：

1. `/attach`：一个函数调用处理所有购买流程。我们返回一个 Stripe Checkout URL，或处理升级/降级。

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  升级到 Pro
</button>
```

2. `/check`：检查客户是否可以访问产品、功能或剩余使用量。
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI 限制已达到")
```

3. `/track`：当客户使用基于使用量的功能时，记录使用事件。

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## 其他

**贡献** 🤝：如果您有兴趣贡献，可以查看我们的指南[这里](/.github/CONTRIBUTING.md)。所有类型的帮助都受到欢迎 :)

**支持** 💬：如果您需要任何类型的支持，我们通常在我们的 [Discord 频道](https://discord.gg/STqxY92zuS)上最快响应，但也可以随时通过电子邮件联系我们 `hey@useautumn.com`！



<!-- ## 恭喜！

您已经在几分钟内将完整的计费系统嵌入到您的应用程序中。您可以进行任何需要的定价模型更改，或处理自定义计划，而无需更改您的代码库。

随时自托管 Autumn，或使用我们在 https://useautumn.com 的托管版本。并让我们知道任何问题、想法或反馈，发送至 hey@useautumn.com。 -->

## 贡献者

感谢所有贡献者帮助使 autumn 成为更好的产品！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>
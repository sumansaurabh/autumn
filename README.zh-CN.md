# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/加入社区-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![关注](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![云服务](https://img.shields.io/badge/云服务-☁️-blue)](https://app.useautumn.com)
[![文档](https://img.shields.io/badge/文档-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) 是一个开源的 Stripe 与应用程序之间的中间层，允许您创建任何定价模型并通过几行代码嵌入。在 Autumn 上您可以构建：
- 订阅服务
- 积分系统和充值
- 基于使用量的模型和超额收费
- 为大客户定制的计划

所有这些都无需处理 webhooks、升级/降级、取消或支付失败。

## 快速开始

**云服务**：开始使用 Autumn 最快的方式是通过我们的[云服务](https://app.useautumn.com)。

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

4. 在您的 Postgres 数据库中生成相关表
```bash
bun db:generate && bun db:migrate
```

5. 运行 Autumn：

Windows 系统：
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux 系统：
```bash
docker compose -f docker-compose.unix.yml up
```

就是这样！您应该能够在 `http://localhost:3000` 看到 Autumn 仪表板。

> ⚠️ 要登录，请在登录页面输入电子邮件，OTP（一次性密码）将显示在您的控制台/终端中。通常，我们使用 Resend 通过电子邮件发送 OTP 或使用 Google OAuth——这些可以通过在 `server/.env` 中提供您的凭据来设置

> ℹ️ 我们的设置脚本会初始化所需的环境变量和（可选的）Supabase 实例。如果您想使用自己的 Postgres 实例，可以这样做——只需将连接字符串粘贴到 `server/.env` 中的 `DATABASE_URL` 环境变量中

## 故障排除

如果在之前运行过 `bun setup` 后再次运行时遇到 `SyntaxError: Unexpected end of JSON input` 错误，您可能需要先清除数据库表。这是一个[已知问题](https://github.com/drizzle-team/drizzle-orm/issues/4529)，可能在多次运行数据库迁移时发生。

解决方法：

1. 连接到您的数据库
2. 删除所有现有表
3. 再次运行设置脚本

## 为什么选择 Autumn

**1️⃣ 计费基础设施很快就会变得复杂**

不仅仅是支付：它涉及构建权限管理、计量、使用限制（带定时任务）、以及将其连接到升级、降级、取消和支付失败状态。竞态条件、边缘情况和其他错误会拖慢您的进度。

**2️⃣ 计费和应用逻辑应该解耦**

成长中的公司经常迭代定价：提高价格、尝试积分或为新功能收费。数据库迁移、重建应用内流程、为定制定价和让用户保留旧定价的内部仪表板是一场噩梦。

## 工作原理

首先，在仪表板上创建您的产品和计划。我们支持**任何**定价模型。一些我们见过的流行模型包括：

1. **使用量和超额** ⚡：设置实时使用限制并选择何时重置。如果用户超出限制则收费。
2. **积分** 💰：用户可以访问货币或任意积分，许多功能可以从中提取
3. **基于席位的每席位限制** 👥：为客户的用户（或其他实体）计费
4. **预付费** 💳：让用户预先购买固定数量的功能，随时间使用

接下来，您的所有计费逻辑可以通过仅 3 个函数实现：

1. `/attach`：所有购买流程的一个函数调用。我们返回 Stripe Checkout URL，或处理升级/降级。

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  升级到专业版
</button>
```

2. `/check`：检查客户是否有权访问产品、功能或剩余使用量。
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

**贡献** 🤝：如果您有兴趣贡献，可以在[这里](/.github/CONTRIBUTING.md)查看我们的指南。我们感谢所有类型的帮助 :)

**支持** 💬：如果您需要任何类型的支持，我们通常在我们的 [Discord 频道](https://discord.gg/STqxY92zuS)上响应最快，但也欢迎发送电子邮件至 `hey@useautumn.com`！

## 贡献者

感谢所有贡献者帮助 Autumn 成为更好的产品！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

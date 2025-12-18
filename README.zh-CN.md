# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) 是 Stripe 和您的应用程序之间的开源层，允许您创建任何定价模型并使用几行代码嵌入。在 Autumn 上您可以构建：
- 订阅
- 信用系统和充值
- 基于使用量的模型和超额费用
- 为大客户定制的方案

所有这些都无需处理 webhook、升级/降级、取消或支付失败。


## 快速开始

**云版本**：开始使用 Autumn 的最快方式是通过我们的[云服务](https://app.useautumn.com)。

**自托管**：如果您想自托管 Autumn：

1. 确保已安装 `bun`
2. 安装项目依赖
```bash
bun install
```
3. 运行设置脚本：
```bash
bun setup
```

4. 在您的 PostgreSQL 数据库中生成相关表
```bash
bun db:generate && bun db:migrate
```

5. 运行 Autumn：

Windows 系统
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux 系统：
 ```bash
docker compose -f docker-compose.unix.yml up
```

完成！您应该能够在 `http://localhost:3000` 上看到 Autumn 仪表板。

> ⚠️ 要登录，请在登录页面输入电子邮件，OTP 将显示在您的控制台/终端中。通常，我们使用 Resend 发送 OTP 电子邮件或使用 Google OAuth——这些可以通过在 `server/.env` 中提供您的凭据来设置。

> ℹ️ 我们的设置脚本会初始化所需的环境变量和（可选的）Supabase 实例。如果您想使用自己的 Postgres 实例，可以这样做——只需将连接字符串粘贴到 `server/.env` 中的 `DATABASE_URL` 环境变量中。

## 故障排除

如果在之前运行过后再次运行 `bun setup` 时遇到 `SyntaxError: Unexpected end of JSON input` 错误，您可能需要先清除数据库表。这是一个[已知问题](https://github.com/drizzle-team/drizzle-orm/issues/4529)，可能在多次运行数据库迁移时发生。

解决方法：

1. 连接到您的数据库
2. 删除所有现有表
3. 再次运行设置脚本


## 为什么选择 Autumn

**1️⃣ 计费基础设施很快就会变得复杂**

不仅仅是支付：需要构建权限管理、计量、使用 cron 作业的使用限制，并将其连接到升级、降级、取消和支付失败状态。竞态条件、边缘情况和其他错误会拖慢您的进度。

**2️⃣ 计费和应用逻辑应该解耦**

成长中的公司经常迭代定价：提高价格、尝试信用或对新功能收费。数据库迁移、重建应用内流程、自定义定价的内部仪表板以及让用户保留旧定价是一场噩梦。


## 工作原理
首先，在仪表板上创建您的产品和方案。我们支持**任何**定价模型。一些我们见过的流行模型包括：

1. **使用量和超额** ⚡：设置实时使用限制并选择重置时间。如果用户超额则收费。
2. **信用** 💰：用户可以访问货币或任意信用，多个功能可以从中提取
3. **基于座位数与每座位限制** 👥：为客户的用户（或其他实体）计费
4. **预付费** 💳：让用户预先购买固定数量的功能，随着时间推移使用


接下来，您所有的计费逻辑只需通过 3 个函数即可实现：

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

!data.allowed && alert("已达到 AI 限制")
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

**贡献** 🤝：如果您有兴趣贡献，可以查看我们的指南[这里](/.github/CONTRIBUTING.md)。我们欢迎所有类型的帮助 :)

**支持** 💬：如果您需要任何类型的支持，我们通常在我们的 [Discord 频道](https://discord.gg/STqxY92zuS)上响应最快，但也欢迎给我们发送电子邮件 `hey@useautumn.com`！


## 贡献者

感谢所有贡献者帮助 Autumn 成为更好的产品！

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

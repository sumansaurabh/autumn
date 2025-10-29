# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) एक ओपन-सोर्स लेयर है जो Stripe और आपके एप्लिकेशन के बीच काम करती है, जिससे आप कोई भी प्राइसिंग मॉडल बना सकते हैं और इसे कुछ लाइनों के कोड के साथ एम्बेड कर सकते हैं। Autumn पर आप निर्माण कर सकते हैं:
- सब्सक्रिप्शन
- क्रेडिट सिस्टम और टॉप अप
- उपयोग-आधारित मॉडल और ओवरेज
- बड़े ग्राहकों के लिए कस्टम प्लान

यह सब कुछ webhooks, अपग्रेड/डाउनग्रेड, कैंसिलेशन या पेमेंट फेल्योर को संभाले बिना।


## शुरुआत करना

**Cloud**: Autumn का उपयोग शुरू करने का सबसे तेज़ तरीका हमारी [क्लाउड सर्विस](https://app.useautumn.com) के माध्यम से है।

**Self Hosted**: यदि आप Autumn को सेल्फ-होस्ट करना चाहते हैं:

1. सुनिश्चित करें कि आपके पास `bun` इंस्टॉल है
2. प्रोजेक्ट की डिपेंडेंसी इंस्टॉल करें
```bash
bun install
```
3. हमारी सेटअप स्क्रिप्ट चलाएं:
```bash
bun setup
```

4. अपने postgres DB में आवश्यक टेबल जनरेट करें
```bash
bun db:generate && bun db:migrate
```

5. Autumn चलाएं:

Windows के लिए
```bash
docker compose -f docker-compose.dev.yml up
```

Mac/Linux के लिए:
 ```bash
docker compose -f docker-compose.unix.yml up
```

बस! आप `http://localhost:3000` पर Autumn डैशबोर्ड देख सकते हैं।

> ⚠️ लॉग इन करने के लिए, साइन इन पेज पर एक ईमेल दर्ज करें, और एक OTP आपके कंसोल/टर्मिनल में दिखाई देगा। सामान्य रूप से, हम OTP ईमेल करने के लिए Resend या Google OAuth का उपयोग करते हैं -- इन्हें `server/.env` में अपने क्रेडेंशियल प्रदान करके सेटअप किया जा सकता है

> ℹ️ हमारी सेटअप स्क्रिप्ट आवश्यक env vars और (वैकल्पिक रूप से) एक Supabase इंस्टेंस को इनिशियलाइज़ करती है। यदि आप अपने खुद के Postgres इंस्टेंस का उपयोग करना चाहते हैं, तो आप ऐसा कर सकते हैं -- बस `server/.env` में `DATABASE_URL` env वेरिएबल में कनेक्शन स्ट्रिंग पेस्ट करें

## समस्या निवारण

यदि पहले चलाने के बाद फिर से `bun setup` चलाते समय आपको `SyntaxError: Unexpected end of JSON input` एरर का सामना करना पड़ता है, तो आपको पहले अपने डेटाबेस टेबल को क्लियर करना पड़ सकता है। यह एक [ज्ञात समस्या](https://github.com/drizzle-team/drizzle-orm/issues/4529) है जो डेटाबेस माइग्रेशन को कई बार चलाने पर हो सकती है।

इसे हल करने के लिए:

1. अपने डेटाबेस से कनेक्ट करें
2. सभी मौजूदा टेबल ड्रॉप करें
3. सेटअप स्क्रिप्ट फिर से चलाएं


## Autumn क्यों

**1️⃣ बिलिंग इंफ्रास्ट्रक्चर तेजी से जटिल हो जाती है**

केवल पेमेंट से अधिक: यह permission management, metering, cron jobs के साथ usage limits बनाना, और इसे upgrade, downgrade, cancellation और failed payments states से कनेक्ट करना है। Race conditions, edge cases, और अन्य बग आपको धीमा कर देंगे।

**2️⃣ बिलिंग और ऐप लॉजिक को अलग होना चाहिए**

बढ़ती कंपनियां अक्सर प्राइसिंग पर इटरेट करती हैं: कीमतें बढ़ाना, क्रेडिट के साथ एक्सपेरिमेंट करना या किसी नए फीचर के लिए चार्ज करना। DB migrations, in-app flows को फिर से बनाना, कस्टम प्राइसिंग के लिए इंटरनल डैशबोर्ड और पुरानी प्राइसिंग पर यूज़र्स को grandfathering करना एक दुःस्वप्न है।


## यह कैसे काम करता है
सबसे पहले, डैशबोर्ड पर अपने प्रोडक्ट और प्लान बनाएं। हम **किसी भी** प्राइसिंग मॉडल को सपोर्ट करते हैं। कुछ लोकप्रिय मॉडल जो हमने देखे हैं उनमें शामिल हैं:

1. **Usage & Overage** ⚡: रियल-टाइम usage limits सेट करें और चुनें कि वे कब रीसेट हों। यदि यूज़र्स ओवर जाते हैं तो उन्हें चार्ज करें।
2. **Credits** 💰: यूज़र्स मौद्रिक या arbitrary credits तक पहुंच सकते हैं जिन्हें कई फीचर्स उपयोग कर सकते हैं
3. **Seat-based with per-seat limits** 👥: अपने यूज़र्स (या अन्य entities) के लिए ग्राहकों को बिल करें
4. **Pay upfront** 💳: यूज़र्स को किसी फीचर की एक निश्चित मात्रा अग्रिम खरीदने दें, जो समय के साथ उपयोग की जाती है


इसके बाद, आपकी सारी बिलिंग लॉजिक केवल 3 फंक्शन के माध्यम से लागू की जा सकती है:

1. `/attach`: सभी purchase flows के लिए एक फंक्शन कॉल। हम एक Stripe Checkout URL रिटर्न करते हैं, या एक upgrade/downgrade को हैंडल करते हैं।

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Upgrade to Pro
</button>
```

2. `/check`: चेक करें कि क्या किसी ग्राहक के पास किसी प्रोडक्ट, फीचर या शेष usage तक पहुंच है।
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI limit reached")
```

3. `/track`: जब कोई ग्राहक usage-based फीचर का उपयोग करता है, तो एक usage event रिकॉर्ड करें।

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## अन्य

**Contributing** 🤝: यदि आप योगदान करने में रुचि रखते हैं, तो आप हमारी गाइड [यहां](/.github/CONTRIBUTING.md) देख सकते हैं। सभी प्रकार की मदद की सराहना की जाती है :)

**Support** 💬: यदि आपको किसी भी प्रकार की सहायता की आवश्यकता है, तो हम आमतौर पर अपने [Discord channel](https://discord.gg/STqxY92zuS) पर सबसे अधिक responsive हैं, लेकिन बेझिझक हमें `hey@useautumn.com` पर ईमेल करें!


## योगदानकर्ता

Autumn को बेहतर प्रोडक्ट बनाने में मदद करने के लिए हमारे सभी योगदानकर्ताओं का धन्यवाद!

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

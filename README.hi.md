# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Join%20Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Follow](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) एक ओपन-सोर्स लेयर है जो Stripe और आपकी एप्लिकेशन के बीच में आती है, जो आपको कोड की कुछ लाइनों के साथ कोई भी प्राइसिंग मॉडल बनाने और एम्बेड करने की सुविधा देती है। Autumn पर आप निम्नलिखित बना सकते हैं:
- सब्सक्रिप्शन
- क्रेडिट सिस्टम और टॉप अप
- उपयोग-आधारित मॉडल और ओवरेज
- बड़े ग्राहकों के लिए कस्टम प्लान

यह सब बिना webhooks, upgrades/downgrades, cancellations या payment fails को हैंडल किए।


## शुरुआत करना

**Cloud**: Autumn का उपयोग शुरू करने का सबसे तेज़ तरीका हमारी [cloud service](https://app.useautumn.com) के माध्यम से है।

**Self Hosted**: यदि आप Autumn को self-host करना चाहते हैं:

1. सुनिश्चित करें कि आपके पास `bun` इंस्टॉल है
2. प्रोजेक्ट डिपेंडेंसी इंस्टॉल करें
```bash
bun install
```
3. हमारी सेटअप स्क्रिप्ट चलाएं:
```bash
bun setup
```

4. अपने postgres DB में आवश्यक टेबल जेनरेट करें
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

बस इतना ही! आपको Autumn डैशबोर्ड `http://localhost:3000` पर दिखाई देना चाहिए।

> ⚠️ लॉग इन करने के लिए, साइन इन पेज पर एक ईमेल दर्ज करें, और आपके कंसोल / टर्मिनल में एक OTP दिखाई देगा। आम तौर पर, हम OTP ईमेल करने या Google OAuth के लिए Resend का उपयोग करते हैं -- इन्हें `server/.env` में अपने क्रेडेंशियल प्रदान करके सेट किया जा सकता है

> ℹ️ हमारी सेटअप स्क्रिप्ट आवश्यक env vars और (वैकल्पिक रूप से) एक Supabase इंस्टेंस को इनिशियलाइज़ करती है। यदि आप अपना खुद का Postgres इंस्टेंस उपयोग करना चाहते हैं, तो आप ऐसा कर सकते हैं -- बस `server/.env` में `DATABASE_URL` env variable में कनेक्शन स्ट्रिंग पेस्ट करें

## समस्या निवारण

यदि आप `bun setup` को पहले चलाने के बाद फिर से चलाते समय `SyntaxError: Unexpected end of JSON input` एरर का सामना करते हैं, तो आपको पहले अपने डेटाबेस टेबल को क्लियर करने की आवश्यकता हो सकती है। यह एक [ज्ञात समस्या](https://github.com/drizzle-team/drizzle-orm/issues/4529) है जो डेटाबेस माइग्रेशन को कई बार चलाने पर हो सकती है।

इसे हल करने के लिए:

1. अपने डेटाबेस से कनेक्ट करें
2. सभी मौजूदा टेबल ड्रॉप करें
3. सेटअप स्क्रिप्ट फिर से चलाएं:


## Autumn क्यों

**1️⃣ बिलिंग इंफ्रास्ट्रक्चर तेजी से जटिल हो जाता है**

यह केवल पेमेंट से अधिक है: यह permission management, metering, cron jobs के साथ usage limits बनाना, और इसे upgrade, downgrade, cancellation और failed payments states से कनेक्ट करना है। Race conditions, edge cases, और अन्य bugs आपको धीमा कर देंगे।

**2️⃣ बिलिंग और ऐप लॉजिक को अलग होना चाहिए**

बढ़ती कंपनियां अक्सर प्राइसिंग पर iterate करती हैं: कीमतें बढ़ाना, क्रेडिट के साथ प्रयोग करना या किसी नई फीचर के लिए चार्ज करना। DB migrations, in-app flows को फिर से बनाना, कस्टम प्राइसिंग के लिए इंटर्नल डैशबोर्ड और पुरानी प्राइसिंग पर यूजर्स को grandfathering करना एक दुःस्वप्न है।


## यह कैसे काम करता है
सबसे पहले, डैशबोर्ड पर अपने products और plans बनाएं। हम **किसी भी** प्राइसिंग मॉडल को सपोर्ट करते हैं। कुछ लोकप्रिय जो हमने देखे हैं उनमें शामिल हैं:

1. **Usage & Overage** ⚡: रियल-टाइम उपयोग सीमा सेट करें और चुनें कि वे कब रीसेट हों। यूजर्स को चार्ज करें यदि वे ओवर जाते हैं।
2. **Credits** 💰: यूजर्स मौद्रिक या मनमाने क्रेडिट एक्सेस कर सकते हैं जिनसे कई फीचर्स ड्रॉ कर सकते हैं
3. **Seat-based with per-seat limits** 👥: अपने यूजर्स (या अन्य entities) के लिए ग्राहकों को बिल करें
4. **Pay upfront** 💳: यूजर्स को किसी फीचर की एक निश्चित मात्रा अग्रिम में खरीदने दें, जो समय के साथ उपयोग होती है


इसके बाद, आपकी सभी बिलिंग लॉजिक को केवल 3 फंक्शन के माध्यम से लागू किया जा सकता है:

1. `/attach`: सभी purchase flows के लिए एक फंक्शन कॉल। हम एक Stripe Checkout URL रिटर्न करते हैं, या upgrade/downgrade हैंडल करते हैं।

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Pro में अपग्रेड करें
</button>
```

2. `/check`: जांचें कि क्या ग्राहक के पास किसी product, feature या शेष usage तक पहुंच है।
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("AI लिमिट पहुंच गई")
```

3. `/track`: जब कोई ग्राहक उपयोग-आधारित फीचर का उपयोग करता है, तो एक usage event रिकॉर्ड करें।

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## अन्य

**योगदान** 🤝: यदि आप योगदान करने में रुचि रखते हैं, तो आप हमारी गाइड [यहां](/.github/CONTRIBUTING.md) देख सकते हैं। सभी प्रकार की मदद की सराहना की जाती है :)

**सहायता** 💬: यदि आपको किसी भी प्रकार की सहायता की आवश्यकता है, तो हम आमतौर पर हमारे [Discord channel](https://discord.gg/STqxY92zuS) पर सबसे अधिक responsive होते हैं, लेकिन हमें `hey@useautumn.com` पर ईमेल करने के लिए भी स्वतंत्र महसूस करें!



<!-- ## बधाई हो!

आपने कुछ ही मिनटों में अपनी एप्लिकेशन में एक पूर्ण बिलिंग सिस्टम एम्बेड किया है। आप जो भी प्राइसिंग मॉडल परिवर्तन करना चाहते हैं, या अपने कोडबेस को बदले बिना कस्टम प्लान हैंडल कर सकते हैं।

Autumn को self-host करने के लिए स्वतंत्र महसूस करें, या https://useautumn.com पर हमारे होस्टेड संस्करण का उपयोग करें। और हमें hey@useautumn.com पर कोई भी प्रश्न, विचार या फीडबैक बताएं। -->

## योगदानकर्ता

autumn को एक बेहतर उत्पाद बनाने में मदद करने के लिए हमारे सभी योगदानकर्ताओं का धन्यवाद!

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

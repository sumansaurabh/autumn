# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Jiunge%20na%20Jamii-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Fuata](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Wingu](https://img.shields.io/badge/Wingu-☁️-blue)](https://app.useautumn.com)
[![Nyaraka](https://img.shields.io/badge/Nyaraka-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) ni safu ya chanzo wazi kati ya Stripe na programu yako, inayokuruhusu kuunda muundo wowote wa bei na kuiweka kwa mistari michache ya msimbo. Kwenye Autumn unaweza kujenga:
- Usajili wa huduma
- Mifumo ya mikopo na kujaza
- Miundo inayotegemea matumizi na malipo ya ziada
- Mipango maalum kwa wateja wakubwa

Haya yote bila kulazimika kushughulikia webhooks, kuboresha/kupunguza, kufuta au kushindwa kwa malipo.

## Kuanza

**Huduma ya Wingu**: Njia ya haraka zaidi ya kuanza kutumia Autumn ni kupitia [huduma yetu ya wingu](https://app.useautumn.com).

**Kupangisha Mwenyewe**: Ikiwa ungependa kupangisha Autumn mwenyewe:

1. Hakikisha una `bun` iliyosakinishwa
2. Sakinisha vitegemezi vya mradi
```bash
bun install
```
3. Endesha hati yetu ya usanidi:
```bash
bun setup
```

4. Tengeneza jedwali husika katika hifadhidata yako ya postgres
```bash
bun db:generate && bun db:migrate
```

5. Endesha Autumn:

Kwa Windows:
```bash
docker compose -f docker-compose.dev.yml up
```

Kwa Mac/Linux:
```bash
docker compose -f docker-compose.unix.yml up
```

Imeisha! Unapaswa kuweza kuona dashibodi ya Autumn kwenye `http://localhost:3000`.

> ⚠️ Ili kuingia, ingiza barua pepe kwenye ukurasa wa kuingia, na OTP itaonekana kwenye console/terminal yako. Kawaida, tunatumia Resend kutuma OTP kwa barua pepe au Google OAuth -- hizi zinaweza kusanidiwa kwa kutoa vitambulisho vyako katika `server/.env`

> ℹ️ Hati yetu ya usanidi inaanzisha vigezo vya mazingira vinavyohitajika na (kwa hiari) mfano wa Supabase. Ikiwa ungependa kutumia mfano wako wa Postgres, unaweza kufanya hivyo -- chomeka tu kamba ya muunganisho katika kigezo cha mazingira cha `DATABASE_URL` katika `server/.env`

## Kutatua Matatizo

Ikiwa unakutana na hitilafu ya `SyntaxError: Unexpected end of JSON input` wakati wa kuendesha `bun setup` tena baada ya kuiendesha hapo awali, huenda unahitaji kufuta jedwali la hifadhidata yako kwanza. Hii ni [tatizo linalojulikana](https://github.com/drizzle-team/drizzle-orm/issues/4529) ambalo linaweza kutokea wakati wa kuendesha uhamiaji wa hifadhidata mara nyingi.

Ili kutatua hili:

1. Unganisha kwenye hifadhidata yako
2. Ondoa jedwali zote zilizopo
3. Endesha hati ya usanidi tena

## Kwa Nini Autumn

**1️⃣ Miundombinu ya malipo inakuwa ngumu haraka**

Zaidi ya malipo: ni kujenga usimamizi wa ruhusa, kupima, vikomo vya matumizi na kazi za cron, na kuiunganisha na hali za kuboresha, kupunguza, kufuta na kushindwa kwa malipo. Hali za mashindano, kesi za ukingo, na hitilafu zingine zitakupunguzia kasi.

**2️⃣ Mantiki ya malipo na programu inapaswa kutenganishwa**

Makampuni yanayokua yanabadilisha bei mara kwa mara: kuongeza bei, kujaribu mikopo au kutoza kwa kipengele kipya. Uhamiaji wa hifadhidata, kujenga upya mtiririko wa ndani ya programu, dashibodi za ndani kwa bei maalum na kuweka watumiaji kwenye bei za zamani ni ndoto mbaya.

## Jinsi Inavyofanya Kazi

Kwanza, unda bidhaa na mipango yako kwenye dashibodi. Tunasaidia muundo **wowote** wa bei. Baadhi ya miundo maarufu tuliyoiona ni pamoja na:

1. **Matumizi na Ziada** ⚡: weka vikomo vya matumizi ya wakati halisi na chagua wakati wa kuzirudisha. Toza watumiaji ikiwa watazidi.
2. **Mikopo** 💰: watumiaji wanaweza kupata mikopo ya fedha au ya kawaida ambayo vipengele vingi vinaweza kuchota
3. **Kulingana na viti na vikomo kwa kila kiti** 👥: toza wateja kwa watumiaji wao (au vitu vingine)
4. **Lipa mapema** 💳: ruhusu watumiaji kununua kiasi kilichowekwa cha kipengele mapema, ambacho kinatumika kwa muda

Kisha, mantiki yako yote ya malipo inaweza kutekelezwa kupitia kazi 3 tu:

1. `/attach`: Wito mmoja wa kazi kwa mtiririko wote wa ununuzi. Tunarudisha URL ya Stripe Checkout, au kushughulikia kuboresha/kupunguza.

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Boresha hadi Pro
</button>
```

2. `/check`: Angalia kama mteja ana ufikiaji wa bidhaa, kipengele au matumizi yaliyobaki.
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("Kikomo cha AI kimefikiwa")
```

3. `/track`: Wakati mteja anatumia kipengele kinacholingana na matumizi, rekodi tukio la matumizi.

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## Mengineyo

**Kuchangia** 🤝: Ikiwa una nia ya kuchangia, unaweza kuangalia mwongozo wetu [hapa](/.github/CONTRIBUTING.md). Aina zote za msaada zinathaminiwa :)

**Msaada** 💬: Ikiwa unahitaji aina yoyote ya msaada, kwa kawaida tunajibu haraka zaidi kwenye [kituo chetu cha Discord](https://discord.gg/STqxY92zuS), lakini usisite kutuma barua pepe `hey@useautumn.com` pia!

## Wachangiaji

Asante kwa wachangiaji wetu wote kwa kusaidia kufanya Autumn kuwa bidhaa bora zaidi!

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

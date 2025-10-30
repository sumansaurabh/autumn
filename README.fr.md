# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Rejoindre%20la%20Communauté-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Suivre](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Cloud](https://img.shields.io/badge/Cloud-☁️-blue)](https://app.useautumn.com)
[![Documentation](https://img.shields.io/badge/Documentation-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) est une couche open-source entre Stripe et votre application, vous permettant de créer n'importe quel modèle de tarification et de l'intégrer avec quelques lignes de code. Avec Autumn, vous pouvez créer :
- Des abonnements
- Des systèmes de crédits et recharges
- Des modèles basés sur l'utilisation et dépassements
- Des plans personnalisés pour les grands clients

Tout cela sans avoir à gérer les webhooks, les mises à niveau/rétrogradations, les annulations ou les échecs de paiement.


## Démarrage

**Cloud** : Le moyen le plus rapide de commencer à utiliser Autumn est via notre [service cloud](https://app.useautumn.com).

**Auto-hébergé** : Si vous souhaitez auto-héberger Autumn :

1. Assurez-vous d'avoir `bun` installé
2. Installez les dépendances du projet
```bash
bun install
```
3. Exécutez notre script de configuration :
```bash
bun setup
```

4. Générez les tables pertinentes dans votre base de données Postgres
```bash
bun db:generate && bun db:migrate
```

5. Lancez Autumn :

Pour Windows
```bash
docker compose -f docker-compose.dev.yml up
```

Pour mac/linux :
 ```bash
docker compose -f docker-compose.unix.yml up
```

C'est tout ! Vous devriez pouvoir voir le tableau de bord Autumn sur `http://localhost:3000`.

> ⚠️ Pour vous connecter, entrez un email sur la page de connexion, et un OTP devrait apparaître dans votre console / terminal. Normalement, nous utilisons Resend pour envoyer un OTP par email ou Google OAuth -- ceux-ci peuvent être configurés en fournissant vos identifiants dans `server/.env`

> ℹ️ Notre script de configuration initialise les variables d'environnement requises et (optionnellement) une instance Supabase. Si vous souhaitez utiliser votre propre instance Postgres, vous pouvez le faire -- collez simplement la chaîne de connexion dans la variable d'environnement `DATABASE_URL` dans `server/.env`

## Dépannage

Si vous rencontrez une erreur `SyntaxError: Unexpected end of JSON input` lors de l'exécution de `bun setup` après l'avoir déjà exécuté précédemment, vous devrez peut-être d'abord effacer les tables de votre base de données. Il s'agit d'un [problème connu](https://github.com/drizzle-team/drizzle-orm/issues/4529) qui peut se produire lors de l'exécution de migrations de base de données plusieurs fois.

Pour résoudre ce problème :

1. Connectez-vous à votre base de données
2. Supprimez toutes les tables existantes
3. Exécutez à nouveau le script de configuration :


## Pourquoi Autumn

**1️⃣ L'infrastructure de facturation devient rapidement complexe**

Plus que des paiements : il s'agit de construire la gestion des permissions, la mesure, les limites d'utilisation avec des tâches cron, et de les connecter aux états de mise à niveau, rétrogradation, annulation et échecs de paiement. Les conditions de concurrence, les cas limites et autres bugs vous ralentiront.

**2️⃣ La facturation et la logique applicative doivent être découplées**

Les entreprises en croissance itèrent souvent sur la tarification : augmentation des prix, expérimentation avec des crédits ou facturation d'une nouvelle fonctionnalité. Les migrations de base de données, la reconstruction des flux dans l'application, les tableaux de bord internes pour la tarification personnalisée et le maintien des anciens tarifs pour les utilisateurs existants sont un cauchemar.


## Comment ça marche

Tout d'abord, créez vos produits et plans sur le tableau de bord. Nous supportons **n'importe quel** modèle de tarification. Voici quelques modèles populaires que nous avons vus :

1. **Utilisation et Dépassement** ⚡ : définissez des limites d'utilisation en temps réel et choisissez quand elles se réinitialisent. Facturez les utilisateurs s'ils dépassent.
2. **Crédits** 💰 : les utilisateurs peuvent accéder à des crédits monétaires ou arbitraires que plusieurs fonctionnalités peuvent utiliser
3. **Basé sur les places avec limites par place** 👥 : facturez les clients pour leurs utilisateurs (ou autres entités)
4. **Paiement anticipé** 💳 : permettez aux utilisateurs d'acheter une quantité fixe d'une fonctionnalité à l'avance, qui est utilisée au fil du temps


Ensuite, toute votre logique de facturation peut être implémentée avec seulement 3 fonctions :

1. `/attach` : Un seul appel de fonction pour tous les flux d'achat. Nous retournons une URL Stripe Checkout, ou gérons une mise à niveau/rétrogradation.

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Passer à Pro
</button>
```

2. `/check` : Vérifiez si un client a accès à un produit, une fonctionnalité ou une utilisation restante.
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("Limite IA atteinte")
```

3. `/track` : Lorsqu'un client utilise une fonctionnalité basée sur l'utilisation, enregistrez un événement d'utilisation.

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## Autres

**Contribution** 🤝 : Si vous êtes intéressé par la contribution, vous pouvez consulter notre guide [ici](/.github/CONTRIBUTING.md). Tous les types d'aide sont appréciés :)

**Support** 💬 : Si vous avez besoin d'un quelconque support, nous sommes généralement plus réactifs sur notre [canal Discord](https://discord.gg/STqxY92zuS), mais n'hésitez pas à nous envoyer un email à `hey@useautumn.com` également !



<!-- ## Félicitations !

Vous avez intégré un système de facturation complet dans votre application en quelques minutes. Vous pouvez apporter tous les changements de modèle de tarification dont vous avez besoin, ou gérer des plans personnalisés sans avoir à modifier votre base de code.

N'hésitez pas à auto-héberger Autumn, ou à utiliser notre version hébergée sur https://useautumn.com. Et faites-nous part de vos questions, réflexions ou commentaires à hey@useautumn.com. -->

## Contributeurs

Merci à tous nos contributeurs pour avoir aidé à faire d'Autumn un meilleur produit !

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

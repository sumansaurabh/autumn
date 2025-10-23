# Autumn

![Autumn](assets/github_hero.png)

[![Discord](https://img.shields.io/badge/Únete%20a%20la%20Comunidad-5865F2?logo=discord&logoColor=white)](https://discord.gg/53emPtY9tA)
[![Seguir](https://img.shields.io/twitter/follow/autumnpricing?style=social)](https://x.com/autumnpricing)
[![Y Combinator](https://img.shields.io/badge/Y%20Combinator-F24-orange)](https://www.ycombinator.com/companies/autumn)
[![Nube](https://img.shields.io/badge/Nube-☁️-blue)](https://app.useautumn.com)
[![Documentación](https://img.shields.io/badge/Documentación-📕-blue)](https://docs.useautumn.com)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/useautumn/autumn)

[Autumn](https://useautumn.com) es una capa de código abierto entre Stripe y tu aplicación, que te permite crear cualquier modelo de precios e integrarlo con unas pocas líneas de código. Con Autumn puedes construir:
- Suscripciones
- Sistemas de créditos y recargas
- Modelos basados en uso y excedentes
- Planes personalizados para clientes grandes

Todo esto sin tener que manejar webhooks, actualizaciones/degradaciones, cancelaciones o fallos de pago.

## Comenzando

**Nube**: La forma más rápida de comenzar a usar Autumn es a través de nuestro [servicio en la nube](https://app.useautumn.com).

**Auto-hospedado**: Si prefieres auto-hospedar Autumn:

1. Asegúrate de tener `bun` instalado
2. Instala las dependencias del proyecto
```bash
bun install
```
3. Ejecuta nuestro script de configuración:
```bash
bun setup
```

4. Genera las tablas relevantes en tu base de datos PostgreSQL
```bash
bun db:generate && bun db:migrate
```

5. Ejecuta Autumn:

Para Windows
```bash
docker compose -f docker-compose.dev.yml up
```

Para mac/linux:
```bash
docker compose -f docker-compose.unix.yml up
```

¡Eso es todo! Deberías poder ver el panel de Autumn en `http://localhost:3000`.

> ⚠️ Para iniciar sesión, ingresa un email en la página de inicio de sesión, y una OTP debería aparecer en tu consola / terminal. Normalmente, usamos Resend para enviar una OTP por email o Google OAuth -- estos se pueden configurar proporcionando tus credenciales en `server/.env`

> ℹ️ Nuestro script de configuración inicializa las variables de entorno requeridas y (opcionalmente) una instancia de Supabase. Si prefieres usar tu propia instancia de PostgreSQL, puedes hacerlo -- simplemente pega la cadena de conexión en la variable de entorno `DATABASE_URL` en `server/.env`

## Solución de Problemas

Si encuentras un error `SyntaxError: Unexpected end of JSON input` al ejecutar `bun setup` nuevamente después de haberlo ejecutado previamente, es posible que necesites limpiar las tablas de tu base de datos primero. Este es un [problema conocido](https://github.com/drizzle-team/drizzle-orm/issues/4529) que puede ocurrir al ejecutar migraciones de base de datos múltiples veces.

Para resolverlo:

1. Conéctate a tu base de datos
2. Elimina todas las tablas existentes
3. Ejecuta el script de configuración nuevamente

## Por Qué Autumn

**1️⃣ La infraestructura de facturación se vuelve compleja rápidamente**

Más que pagos: se trata de construir gestión de permisos, medición, límites de uso con trabajos cron, y conectarlo a estados de actualización, degradación, cancelación y fallos de pagos. Condiciones de carrera, casos extremos y otros errores te ralentizarán.

**2️⃣ La lógica de facturación y de la aplicación debe estar desacoplada**

Las empresas en crecimiento iteran sobre precios frecuentemente: subiendo precios, experimentando con créditos o cobrando por una nueva característica. Migraciones de base de datos, reconstruir flujos dentro de la aplicación, paneles internos para precios personalizados y mantener usuarios en precios antiguos es una pesadilla.

## Cómo Funciona

Primero, crea tus productos y planes en el panel. Admitimos **cualquier** modelo de precios. Algunos populares que hemos visto incluyen:

1. **Uso y Excedente** ⚡: establece límites de uso en tiempo real y elige cuándo se reinician. Cobra a los usuarios si los sobrepasan.
2. **Créditos** 💰: los usuarios pueden acceder a créditos monetarios o arbitrarios de los que muchas características pueden obtener
3. **Basado en asientos con límites por asiento** 👥: factura a los clientes por sus usuarios (u otras entidades)
4. **Pago por adelantado** 💳: permite a los usuarios comprar una cantidad fija de una característica por adelantado, que se usa con el tiempo

A continuación, toda tu lógica de facturación puede implementarse a través de solo 3 funciones:

1. `/attach`: Una llamada de función para todos los flujos de compra. Devolvemos una URL de Stripe Checkout, o manejamos una actualización/degradación.

```tsx
const { attach } = useAutumn();
<button
  onClick={async () => {
    await attach({ productId: "pro" });
  }}
>
  Actualizar a Pro
</button>
```

2. `/check`: Verifica si un cliente tiene acceso a un producto, característica o uso restante.
```ts
const { check } = useAutumn();

const { data } = await check({ featureId: "ai_tokens" })

!data.allowed && alert("Límite de IA alcanzado")
```

3. `/track`: Cuando un cliente usa una característica basada en uso, registra un evento de uso.

```ts
const { track } = useAutumn();

await track({
  featureId: "ai_tokens",
  value: 1312
})
```

## Otros

**Contribuir** 🤝: Si estás interesado en contribuir, puedes consultar nuestra guía [aquí](/.github/CONTRIBUTING.md). Se aprecia todo tipo de ayuda :)

**Soporte** 💬: Si necesitas cualquier tipo de soporte, normalmente somos más receptivos en nuestro [canal de Discord](https://discord.gg/STqxY92zuS), ¡pero siéntete libre de enviarnos un email a `hey@useautumn.com` también!

<!-- ## ¡Felicidades!

Has integrado un sistema completo de facturación en tu aplicación en unos pocos minutos. Puedes hacer cualquier cambio de modelo de precios que necesites, o manejar planes personalizados sin necesidad de alterar tu código base.

Siéntete libre de auto-hospedar Autumn, o usar nuestra versión hospedada en https://useautumn.com. Y haznos saber cualquier pregunta, pensamiento o comentario en hey@useautumn.com. -->

## Contribuidores

¡Gracias a todos nuestros contribuidores por ayudar a hacer de autumn un mejor producto!

<a href="https://github.com/useautumn/autumn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=useautumn/autumn" />
</a>

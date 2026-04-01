# dealwatch-worker

Cloudflare Worker that scrapes Apple's refurbished Mac listings and sends matching deals to Discord.

## Setup

```sh
pnpm install
```

## Development

```sh
pnpm dev
```

## CLI

Run locally to check for deals:

```sh
pnpm tsx cli.ts
```

Filter by model, price, or memory:

```sh
pnpm tsx cli.ts --model macMini --maxPrice 1500
pnpm tsx cli.ts -m macMini -m macStudio --minMemory 32gb
```

Available models: `macMini`, `macStudio`, `macBookPro`

## Config

The worker reads config from KV (`config` key). If no config is set, all models are enabled with no price/memory filters.

```sh
pnpm wrangler kv:key put --binding KV "config" '{"macMini":{"enabled":true,"maxPrice":1300,"minMemory":"16gb"},"macStudio":{"enabled":false},"macBookPro":{"enabled":true,"maxPrice":1800}}'
```

Enable/disable the worker:

```sh
pnpm wrangler kv:key put --binding KV "active" "true"
```

## Deploy

```sh
pnpm deploy
```
